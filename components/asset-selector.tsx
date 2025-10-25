"use client"

import { useState, useEffect, useCallback } from "react"
import { Check, ChevronsUpDown, Search } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { useDebounce } from "@/hooks/use-debounce"

interface Asset {
  id: number
  asset_id: string
  asset_name: string
  asset_type: string
  classification: string
  owner: string
  
}

interface AssetSelectorProps {
  value?: Asset | null
  onChange: (asset: Asset | null) => void
  placeholder?: string
  disabled?: boolean
  className?: string
}

export function AssetSelector({
  value,
  onChange,
  placeholder = "Search assets...",
  disabled = false,
  className
}: AssetSelectorProps) {
  const [open, setOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [assets, setAssets] = useState<Asset[]>([])
  const [loading, setLoading] = useState(false)

  const debouncedSearchTerm = useDebounce(searchTerm, 300)

  const searchAssets = useCallback(async (query: string) => {
    if (!query.trim()) {
      setAssets([])
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`/api/assets/search?q=${encodeURIComponent(query)}&limit=20`)
      const result = await response.json()

      if (result.success) {
        setAssets(result.data)
      } else {
        console.error('Error searching assets:', result.error)
        setAssets([])
      }
    } catch (error) {
      console.error('Error searching assets:', error)
      setAssets([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (debouncedSearchTerm) {
      searchAssets(debouncedSearchTerm)
    } else {
      setAssets([])
    }
  }, [debouncedSearchTerm, searchAssets])

  const handleSelect = (asset: Asset) => {
    onChange(asset)
    setOpen(false)
    setSearchTerm("")
  }

  const handleClear = () => {
    onChange(null)
    setSearchTerm("")
  }

  return (
    <div className={cn("relative", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            role="combobox"
            aria-expanded={open}
            className={cn(
              "w-full justify-between bg-gray-50 border-blue-400 dark:bg-gray-900",
              !value && "text-muted-foreground",
              disabled && "opacity-50 cursor-not-allowed"
            )}
            disabled={disabled}
          >
            {value ? (
              <div className="flex items-center gap-2 truncate">
                <span className="truncate">{value.display_name}</span>
                {value.model_version && (
                  <Badge variant="secondary" className="text-xs">
                    {value.model_version}
                  </Badge>
                )}
              </div>
            ) : (
              placeholder
            )}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command>
            <div className="flex items-center border-b px-3">
              <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
              <CommandInput
                placeholder="Search assets..."
                value={searchTerm}
                onValueChange={setSearchTerm}
                className="flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
            <CommandList>
              <CommandEmpty>
                {loading ? (
                  <div className="py-6 text-center text-sm text-muted-foreground">
                    Searching...
                  </div>
                ) : searchTerm ? (
                  <div className="py-6 text-center text-sm text-muted-foreground">
                    No assets found.
                  </div>
                ) : (
                  <div className="py-6 text-center text-sm text-muted-foreground">
                    Start typing to search assets...
                  </div>
                )}
              </CommandEmpty>
              <CommandGroup>
                {assets.map((asset) => (
                  <CommandItem
                    key={asset.id}
                    value={asset.asset_id}
                    onSelect={() => handleSelect(asset)}
                    className="cursor-pointer"
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value?.id === asset.id ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <div className="flex flex-col gap-1">
                      <div className="font-medium">{asset.asset_name}</div>
                      <div className="text-sm text-muted-foreground">
                        {asset.asset_type} • {asset.asset_id}
                        {asset.model_version && ` • ${asset.model_version}`}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Owner: {asset.owner} • {asset.classification}
                      </div>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {value && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleClear}
          className="absolute right-8 top-0 h-full px-3 py-2 hover:bg-transparent"
          disabled={disabled}
        >
          ✕
        </Button>
      )}
    </div>
  )
}
