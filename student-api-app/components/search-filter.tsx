"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, X } from "lucide-react"

interface SearchFilterProps {
  searchTerm: string
  sortBy: string
  onSearchChange: (value: string) => void
  onSortChange: (value: string) => void
  onClearFilters: () => void
}

export function SearchFilter({ searchTerm, sortBy, onSearchChange, onSortChange, onClearFilters }: SearchFilterProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const hasActiveFilters = searchTerm !== "" || sortBy !== "firstName"

  return (
    <div className="space-y-4">
      <div className="flex gap-4 items-end flex-wrap">
        <div className="flex-1 min-w-64">
          <label className="text-sm font-medium text-foreground block mb-2">Search Students</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-foreground block mb-2">Sort By</label>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="px-3 py-2 border border-input rounded-md bg-background text-foreground text-sm"
          >
            <option value="firstName">First Name</option>
            <option value="lastName">Last Name</option>
            <option value="email">Email</option>
          </select>
        </div>

        {hasActiveFilters && (
          <Button variant="outline" size="sm" onClick={onClearFilters} className="gap-2 bg-transparent">
            <X className="w-4 h-4" />
            Clear Filters
          </Button>
        )}
      </div>

      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {searchTerm && (
            <Badge variant="secondary" className="gap-2">
              Search: {searchTerm}
              <button onClick={() => onSearchChange("")} className="hover:text-destructive">
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}
          {sortBy !== "firstName" && (
            <Badge variant="secondary" className="gap-2">
              Sort: {sortBy}
              <button onClick={() => onSortChange("firstName")} className="hover:text-destructive">
                <X className="w-3 h-3" />
              </button>
            </Badge>
          )}
        </div>
      )}
    </div>
  )
}
