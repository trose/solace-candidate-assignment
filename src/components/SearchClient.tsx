"use client";

import { useState } from "react";
import { Advocate } from "../types/advocate";
import { filterAdvocates } from "../utils/search";
import { SearchInput } from "./SearchInput";
import { AdvocateTable } from "./AdvocateTable";

interface SearchClientProps {
  initialAdvocates: Advocate[];
}

export function SearchClient({ initialAdvocates }: SearchClientProps) {
  const [filteredAdvocates, setFilteredAdvocates] = useState<Advocate[]>(initialAdvocates);

  const handleSearchChange = (term: string) => {
    const filtered = filterAdvocates(initialAdvocates, term);
    setFilteredAdvocates(filtered);
  };

  const handleReset = () => {
    setFilteredAdvocates(initialAdvocates);
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleSearchChange(e.target.value || "");
  };

  return (
    <>
      <SearchInput onChange={onChange} onReset={handleReset} />
      <br />
      <br />
      <AdvocateTable advocates={filteredAdvocates} />
    </>
  );
}