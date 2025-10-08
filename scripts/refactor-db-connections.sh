#!/bin/bash

# Database Connection Refactoring Script
# This script replaces all hardcoded neon(process.env.DATABASE_URL!) calls
# with the centralized getDatabase() function from @/lib/database

echo "🔧 Refactoring database connections to use centralized getDatabase()..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to refactor a single file
refactor_file() {
    local file="$1"
    
    # Check if file contains the old pattern
    if grep -q "const sql = neon(process.env.DATABASE_URL!)" "$file"; then
        print_status "Refactoring: $file"
        
        # Create backup
        cp "$file" "$file.backup"
        
        # Replace the import and const declaration
        sed -i '' \
            -e 's/import { neon } from "@neondatabase\/serverless"/import { getDatabase } from "@\/lib\/database"/' \
            -e 's/const sql = neon(process.env.DATABASE_URL!)/const sql = getDatabase()/' \
            "$file"
        
        # Check if replacement was successful
        if grep -q "const sql = getDatabase()" "$file"; then
            print_success "  ✅ Refactored: $file"
            return 0
        else
            print_error "  ❌ Failed to refactor: $file"
            # Restore backup
            mv "$file.backup" "$file"
            return 1
        fi
    elif grep -q "const db = neon(process.env.DATABASE_URL!)" "$file"; then
        print_status "Refactoring: $file (db variable)"
        
        # Create backup
        cp "$file" "$file.backup"
        
        # Replace the import and const declaration
        sed -i '' \
            -e 's/import { neon } from "@neondatabase\/serverless"/import { getDatabase } from "@\/lib\/database"/' \
            -e 's/const db = neon(process.env.DATABASE_URL!)/const db = getDatabase()/' \
            "$file"
        
        # Check if replacement was successful
        if grep -q "const db = getDatabase()" "$file"; then
            print_success "  ✅ Refactored: $file"
            return 0
        else
            print_error "  ❌ Failed to refactor: $file"
            # Restore backup
            mv "$file.backup" "$file"
            return 1
        fi
    else
        print_warning "  ⚠️  No refactoring needed: $file"
        return 0
    fi
}

# Find all TypeScript/JavaScript files that need refactoring
print_status "Searching for files with hardcoded database connections..."

# Find files in lib/actions and app/api directories
FILES_TO_REFACTOR=(
    $(find lib/actions -name "*.ts" -type f)
    $(find app/api -name "*.ts" -type f)
)

TOTAL_FILES=${#FILES_TO_REFACTOR[@]}
SUCCESS_COUNT=0
ERROR_COUNT=0

print_status "Found $TOTAL_FILES files to process"

# Process each file
for file in "${FILES_TO_REFACTOR[@]}"; do
    if [ -f "$file" ]; then
        if refactor_file "$file"; then
            ((SUCCESS_COUNT++))
        else
            ((ERROR_COUNT++))
        fi
    fi
done

echo ""
echo "📊 Refactoring Summary:"
echo "  ✅ Successful: $SUCCESS_COUNT files"
echo "  ❌ Errors: $ERROR_COUNT files"
echo "  📁 Total processed: $TOTAL_FILES files"

if [ $ERROR_COUNT -eq 0 ]; then
    print_success "🎉 All database connections refactored successfully!"
    echo ""
    echo "Next steps:"
    echo "1. Run 'npm run build' to verify the build works"
    echo "2. Test the application to ensure database functionality works"
else
    print_error "⚠️  Some files failed to refactor. Check the errors above."
    echo ""
    echo "You may need to manually refactor the failed files or check the backup files."
fi

echo ""
echo "Note: Backup files have been created with .backup extension"
echo "You can remove them after verifying everything works:"
echo "find . -name '*.backup' -delete"


