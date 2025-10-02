"use client";

import { useAdvocates } from "../hooks/useAdvocates";
import { useAdvocateSearch } from "../hooks/useAdvocateSearch";
import { SearchInput } from "../components/SearchInput";
import { AdvocateTable } from "../components/AdvocateTable";

export default function Home() {
  const { advocates } = useAdvocates();
  const { filteredAdvocates, handleSearchChange, resetSearch } = useAdvocateSearch(advocates);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleSearchChange(e.target.value || "");
  };

  const onClick = () => {
    resetSearch();
  };

  return (
    <main style={{ margin: "24px" }}>
      <h1>Solace Advocates</h1>
      <br />
      <br />
      <SearchInput onChange={onChange} onReset={onClick} />
      <br />
      <br />
      <AdvocateTable advocates={filteredAdvocates} />
    </main>
  );
}
