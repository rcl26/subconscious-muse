import { useState, useMemo } from "react";
import { Dream } from "@/hooks/useDreams";
import { isWithinInterval, parseISO, startOfDay, endOfDay } from "date-fns";

interface DateRange {
  start: Date | null;
  end: Date | null;
}

export const useDreamFilters = (dreams: Dream[]) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState<DateRange>({ start: null, end: null });

  const filteredDreams = useMemo(() => {
    let filtered = [...dreams];

    // Filter by search term
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(dream => 
        dream.content.toLowerCase().includes(term) ||
        (dream.analysis && dream.analysis.toLowerCase().includes(term))
      );
    }

    // Filter by date range
    if (dateRange.start || dateRange.end) {
      filtered = filtered.filter(dream => {
        const dreamDate = parseISO(dream.date);
        
        if (dateRange.start && dateRange.end) {
          // Both start and end dates
          return isWithinInterval(dreamDate, {
            start: startOfDay(dateRange.start),
            end: endOfDay(dateRange.end)
          });
        } else if (dateRange.start) {
          // Only start date (from this date onwards)
          return dreamDate >= startOfDay(dateRange.start);
        } else if (dateRange.end) {
          // Only end date (up to this date)
          return dreamDate <= endOfDay(dateRange.end);
        }
        
        return true;
      });
    }

    return filtered;
  }, [dreams, searchTerm, dateRange]);

  const clearFilters = () => {
    setSearchTerm("");
    setDateRange({ start: null, end: null });
  };

  return {
    searchTerm,
    setSearchTerm,
    dateRange,
    setDateRange,
    filteredDreams,
    clearFilters,
    hasFilters: searchTerm.trim() !== "" || dateRange.start !== null || dateRange.end !== null
  };
};