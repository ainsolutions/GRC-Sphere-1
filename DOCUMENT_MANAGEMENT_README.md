# Document Management System

## Overview

The Document Management System provides comprehensive functionality for managing organizational documents with version control, approval workflows, and secure file storage.

## Features

### ✅ Currently Working Features

#### 1. Document Creation & Upload
- **Upload Documents**: Upload files (PDF, DOC, DOCX, TXT, MD, RTF) up to 10MB
- **Metadata Management**: Comprehensive document information including title, type, category, owner, department
- **Form Validation**: Client-side and server-side validation
- **Progress Tracking**: Visual upload progress indicators

#### 2. Document Management
- **Document Listing**: View all documents with filtering and search
- **Document Details**: Complete document information display
- **File Storage**: Secure file storage in `uploads/documents/` directory
- **Download Functionality**: Secure document download with access logging

#### 3. Basic Version Control (Simplified)
- **Version Display**: Show current document version
- **Version History**: Basic version history (shows current version)
- **Version Notes**: Track what changed in each version

#### 4. Status Workflow (Simplified)
- **Status Tracking**: Track document status (draft, reviewed, approved)
- **Workflow Visualization**: Visual workflow progress
- **Status Transitions**: Manual status updates

#### 5. Security & Access
- **File Type Validation**: Only allowed file types accepted
- **File Size Limits**: 10MB maximum file size
- **Access Logging**: Basic access tracking

## Database Schema

### Current Schema (Basic)
```sql
CREATE TABLE governance_documents (
    id SERIAL PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    document_type VARCHAR(100) NOT NULL,
    version VARCHAR(20) NOT NULL,
    status VARCHAR(50) DEFAULT 'draft',
    category VARCHAR(100) NOT NULL,
    subcategory VARCHAR(100),
    description TEXT,
    document_owner VARCHAR(100) NOT NULL,
    department VARCHAR(100),
    approval_authority VARCHAR(100),
    review_frequency VARCHAR(50) DEFAULT 'annual',
    related_documents TEXT[],
    applicable_frameworks TEXT[],
    tags TEXT[],
    confidentiality_level VARCHAR(50) DEFAULT 'internal',
    distribution_list TEXT[],
    change_history JSONB,
    approval_workflow JSONB,
    compliance_requirements TEXT[],
    file_path VARCHAR(500),
    file_name VARCHAR(255),
    file_size BIGINT,
    mime_type VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(100),
    updated_by VARCHAR(100)
);
```

### Enhanced Schema (Future Upgrade)
The system is designed to support an enhanced schema with full version history, approval workflows, and access controls. See `scripts/73-create-document-version-history-table.sql` for the complete enhanced schema.

## API Endpoints

### Document CRUD
- `POST /api/governance/documents` - Create new document
- `GET /api/governance/documents` - List documents with filtering
- `GET /api/governance/documents/[id]` - Get document details
- `PUT /api/governance/documents/[id]` - Update document
- `DELETE /api/governance/documents/[id]` - Delete document

### File Management
- `POST /api/governance/documents/upload` - Upload document files
- `GET /api/governance/documents/download` - Download document files

### Version Management
- `GET /api/governance/documents/versions` - Get document versions (simplified)
- `POST /api/governance/documents/versions` - Manage versions (basic implementation)

## Frontend Components

### Core Components
- `DocumentUploadForm` - Comprehensive document creation form
- `DocumentVersionHistory` - Version history display (simplified)
- `DocumentStatusWorkflow` - Status workflow visualization (simplified)

### Integration
- Integrated into Governance page under "Documents" tab
- Upload button in the header
- Action buttons for each document (Version History, Workflow, Download)

## Usage Instructions

### 1. Upload a Document
1. Navigate to **Governance → Documents** tab
2. Click **"Upload Document"** button
3. Fill in the document information:
   - **Title**: Document title (required)
   - **Document Type**: Policy, Procedure, Standard, etc. (required)
   - **Category**: Information Security, Compliance, etc. (required)
   - **Document Owner**: Person responsible (required)
   - **Department Owner**: Owning department
   - **Description**: Document description
   - **File**: Select a file to upload (optional)
4. Click **"Create Document"**

### 2. View Documents
- All documents are listed in the main table
- Use filters to find specific documents
- Click action buttons to:
  - **Git Branch Icon**: View version history
  - **Activity Icon**: View workflow status
  - **Download Icon**: Download the document file
  - **Edit Icon**: Edit document details

### 3. Document Status
Documents can have the following statuses:
- **draft**: Initial creation state
- **under_review**: Being reviewed
- **reviewed**: Review completed
- **approved**: Approved for use
- **published**: Published and active

## File Storage

### Directory Structure
```
uploads/
└── documents/
    ├── document-1-file.pdf
    ├── document-2-file.docx
    └── ...
```

### File Naming
- Files are stored with unique UUIDs to prevent conflicts
- Original filenames are preserved in the database
- Files are organized by document ID for easy management

## Security Considerations

### File Upload Security
- File type validation (PDF, DOC, DOCX, TXT, MD, RTF only)
- File size limits (10MB maximum)
- Server-side validation of all inputs

### Access Control (Future Enhancement)
- Role-based access control
- Document confidentiality levels
- Distribution list management
- Access logging and audit trails

## Future Enhancements

### Planned Features
1. **Full Version History**: Complete version control with diff tracking
2. **Approval Workflows**: Multi-step approval processes
3. **Access Control**: Role-based permissions and document sharing
4. **Document Templates**: Pre-defined document templates
5. **Bulk Operations**: Bulk upload, approval, and management
6. **Advanced Search**: Full-text search and advanced filtering
7. **Document Relationships**: Link related documents
8. **Compliance Tracking**: Track compliance requirements
9. **Audit Logging**: Complete audit trail of all actions

### Database Migration
To enable full functionality, run the enhanced schema migration:
```bash
psql "$DATABASE_URL" -f scripts/73-create-document-version-history-table.sql
```

## Troubleshooting

### Common Issues

1. **"Database not configured" error**
   - Ensure `DATABASE_URL` environment variable is set
   - Check database connection

2. **File upload fails**
   - Check file size (max 10MB)
   - Verify file type is supported
   - Ensure uploads directory exists and is writable

3. **Document creation fails**
   - Check required fields are filled
   - Verify database connection
   - Check server logs for detailed error messages

### Debug Information
- Server logs are available in the console
- API responses include detailed error messages
- Frontend shows toast notifications for user feedback

## Support

For issues or questions about the Document Management System:
1. Check the server logs for detailed error information
2. Verify database connectivity and schema
3. Ensure file permissions are correct for uploads directory
4. Check browser console for frontend errors

---

## Quick Start

1. **Navigate to Documents**: Go to Governance → Documents
2. **Upload Document**: Click "Upload Document" button
3. **Fill Form**: Complete required fields (Title, Type, Category, Owner)
4. **Add File**: Optionally upload a file
5. **Create**: Click "Create Document"
6. **Manage**: Use action buttons to view history, workflow, and download

The system is now ready for immediate use with basic document management functionality!
