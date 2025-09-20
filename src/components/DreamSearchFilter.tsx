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
    <div className="space-y-6">
      <div className="flex flex-col items-center space-y-4">
        <div className="relative w-full max-w-md mx-auto">
          <div className="glass-pill p-1">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground/60 h-5 w-5" />
              <Input
                type="text"
                placeholder="Search your dreams..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-12 pr-4 py-3 bg-transparent border-none focus:outline-none focus:ring-0 text-foreground placeholder:text-muted-foreground/60 text-center font-medium"
              />
            </div>
          </div>
        </div>
        
        {/* Filter Chips */}
        <div className="flex flex-wrap gap-2 justify-center">
          <button className="glass-pill px-4 py-2 text-sm font-medium text-muted-foreground/80 hover:text-primary hover:bg-primary/10 transition-all duration-200">
            By Date
          </button>
          <button className="glass-pill px-4 py-2 text-sm font-medium text-muted-foreground/80 hover:text-primary hover:bg-primary/10 transition-all duration-200">
            By Theme
          </button>
          <button className="glass-pill px-4 py-2 text-sm font-medium text-muted-foreground/80 hover:text-primary hover:bg-primary/10 transition-all duration-200">
            Analyzed
          </button>
        </div>
      </div>
      
      {searchTerm && (
        <div className="flex justify-center">
          <div className="glass-pill px-4 py-2 bg-primary/20 text-primary border-primary/30">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Search: "{searchTerm}"</span>
              <button
                onClick={() => onSearchChange("")}
                className="hover:bg-primary/20 rounded-full p-1 transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};