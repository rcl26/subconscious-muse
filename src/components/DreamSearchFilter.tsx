import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, X } from "lucide-react";

interface DreamSearchFilterProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onClearFilters: () => void;
  resultsCount: number;
  totalCount: number;
}

export const DreamSearchFilter = ({
  searchTerm,
  onSearchChange,
  onClearFilters,
  resultsCount,
  totalCount
}: DreamSearchFilterProps) => {
  const hasFilters = searchTerm.trim() !== "";

  return (
    <div className="space-y-4 mb-6">
      {/* Search Controls */}
      <div className="flex gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-primary-foreground/40" />
          <Input
            placeholder="Search your dreams..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-12 pr-4 py-3 bg-primary-foreground/5 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50 focus:bg-primary-foreground/10 focus:border-primary-foreground/40 rounded-xl text-base transition-all duration-200"
          />
          {searchTerm && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onSearchChange("")}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0 text-primary-foreground/60 hover:text-primary-foreground hover:bg-primary-foreground/10 rounded-lg"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Active Filters and Results Count */}
      {(hasFilters || totalCount > 0) && (
        <div className="flex flex-wrap items-center gap-2">
          {/* Search Term Badge */}
          {searchTerm && (
            <Badge variant="secondary" className="bg-primary-foreground/15 text-primary-foreground border-primary-foreground/20 rounded-lg px-3 py-1">
              <Search className="h-3 w-3 mr-2" />
              "{searchTerm}"
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onSearchChange("")}
                className="h-4 w-4 p-0 ml-2 hover:bg-transparent text-primary-foreground/80 hover:text-primary-foreground"
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}

          {/* Results Count */}
          <div className="ml-auto text-sm text-primary-foreground/60">
            {hasFilters ? (
              <>
                {resultsCount} of {totalCount} dreams
                {resultsCount === 0 && " found"}
              </>
            ) : (
              `${totalCount} dreams`
            )}
          </div>
        </div>
      )}
    </div>
  );
};