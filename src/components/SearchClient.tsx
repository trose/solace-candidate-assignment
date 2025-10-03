"use client";

import { useState, useCallback } from "react";
import { useAdvocateSearch } from "../hooks/useAdvocateSearch";
import { SearchInput } from "./SearchInput";
import { AdvocateTable } from "./AdvocateTable";

/**
 * Renders a search UI and advocates table powered by the useAdvocateSearch hook.
 *
 * The component maintains the current search term, triggers hook-driven searches when the term is non-empty, and reloads all advocates when the term is cleared or reset. It displays a controlled SearchInput, a "Searching..." indicator while loading, an error alert when present, and an AdvocateTable with the current advocates.
 *
 * @returns The component's React element containing the search input, status messages, and advocate table.
 */
export function SearchClient() {
  const { advocates, loading, error, searchAdvocates, loadAllAdvocates } = useAdvocateSearch();
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = useCallback((term: string) => {
    setSearchTerm(term);
    if (term.trim()) {
      searchAdvocates({ search: term });
    } else {
      loadAllAdvocates();
    }
  }, [searchAdvocates, loadAllAdvocates]);

  const handleReset = useCallback(() => {
    setSearchTerm("");
    loadAllAdvocates();
  }, [loadAllAdvocates]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleSearchChange(e.target.value);
  };

  return (
    <div className="flex flex-col gap-4">
      <SearchInput onChange={onChange} onReset={handleReset} value={searchTerm} />
      {loading && <div className="text-gray-600">Searching...</div>}
      {error && <div className="text-red-600" role="alert">{error}</div>}
      <AdvocateTable advocates={advocates} />
    </div>
  );
}