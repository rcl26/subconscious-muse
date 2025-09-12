import { useState, useMemo } from "react";
import { Dream } from "@/hooks/useDreams";

export const useDreamFilters = (dreams: Dream[]) => {
  const [searchTerm, setSearchTerm] = useState("");

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

    return filtered;
  }, [dreams, searchTerm]);

  const clearFilters = () => {
    setSearchTerm("");
  };

  return {
    searchTerm,
    setSearchTerm,
    filteredDreams,
    clearFilters,
    hasFilters: searchTerm.trim() !== ""
  };
};