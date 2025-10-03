"use client";

import { useState, useCallback } from "react";
import { useAdvocateSearch } from "../hooks/useAdvocateSearch";
import { SearchInput } from "./SearchInput";
import { AdvocateTable } from "./AdvocateTable";

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