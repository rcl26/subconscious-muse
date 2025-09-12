import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Calendar as CalendarIcon, X } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface DreamSearchFilterProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  dateRange: { start: Date | null; end: Date | null };
  onDateRangeChange: (range: { start: Date | null; end: Date | null }) => void;
  onClearFilters: () => void;
  resultsCount: number;
  totalCount: number;
}

export const DreamSearchFilter = ({
  searchTerm,
  onSearchChange,
  dateRange,
  onDateRangeChange,
  onClearFilters,
  resultsCount,
  totalCount
}: DreamSearchFilterProps) => {
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [tempDateRange, setTempDateRange] = useState(dateRange);

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return;
    
    if (!tempDateRange.start || (tempDateRange.start && tempDateRange.end)) {
      // Start new range
      setTempDateRange({ start: date, end: null });
    } else if (tempDateRange.start && !tempDateRange.end) {
      // Complete the range
      const start = tempDateRange.start;
      const end = date;
      const finalRange = start > end ? { start: end, end: start } : { start, end };
      setTempDateRange(finalRange);
      onDateRangeChange(finalRange);
      setIsDatePickerOpen(false);
    }
  };

  const clearDateRange = () => {
    const clearedRange = { start: null, end: null };
    setTempDateRange(clearedRange);
    onDateRangeChange(clearedRange);
    setIsDatePickerOpen(false);
  };

  const hasFilters = searchTerm || dateRange.start || dateRange.end;

  return (
    <div className="space-y-4 mb-6">
      {/* Search and Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search your dreams..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 bg-background/50 border-border/50 text-foreground placeholder:text-muted-foreground"
          />
        </div>

        {/* Date Range Filter */}
        <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "justify-start text-left font-normal bg-background/50 border-border/50",
                !dateRange.start && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dateRange.start ? (
                dateRange.end ? (
                  `${format(dateRange.start, "MMM dd")} - ${format(dateRange.end, "MMM dd")}`
                ) : (
                  format(dateRange.start, "MMM dd, yyyy")
                )
              ) : (
                "Filter by date"
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <div className="p-3 border-b">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium">Select date range</h4>
                {(dateRange.start || dateRange.end) && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearDateRange}
                    className="h-6 px-2 text-xs"
                  >
                    Clear
                  </Button>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Click a start date, then click an end date
              </p>
            </div>
            <Calendar
              mode="single"
              selected={tempDateRange.start || undefined}
              onSelect={handleDateSelect}
              initialFocus
              className="rounded-md"
            />
          </PopoverContent>
        </Popover>

        {/* Clear All Filters */}
        {hasFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4 mr-1" />
            Clear
          </Button>
        )}
      </div>

      {/* Active Filters and Results Count */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Search Term Badge */}
        {searchTerm && (
          <Badge variant="secondary" className="bg-primary/10 text-primary">
            <Search className="h-3 w-3 mr-1" />
            "{searchTerm}"
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onSearchChange("")}
              className="h-4 w-4 p-0 ml-1 hover:bg-transparent"
            >
              <X className="h-3 w-3" />
            </Button>
          </Badge>
        )}

        {/* Date Range Badge */}
        {(dateRange.start || dateRange.end) && (
          <Badge variant="secondary" className="bg-primary/10 text-primary">
            <CalendarIcon className="h-3 w-3 mr-1" />
            {dateRange.start && dateRange.end
              ? `${format(dateRange.start, "MMM dd")} - ${format(dateRange.end, "MMM dd")}`
              : dateRange.start
              ? `From ${format(dateRange.start, "MMM dd")}`
              : `Until ${format(dateRange.end!, "MMM dd")}`
            }
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDateRangeChange({ start: null, end: null })}
              className="h-4 w-4 p-0 ml-1 hover:bg-transparent"
            >
              <X className="h-3 w-3" />
            </Button>
          </Badge>
        )}

        {/* Results Count */}
        <div className="ml-auto text-sm text-muted-foreground">
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
    </div>
  );
};