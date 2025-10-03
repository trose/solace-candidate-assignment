"use client";

import { AdvocateProvider } from "../contexts/AdvocateContext";
import { SearchClientWithStore } from "./SearchClientWithStore";

/**
 * Main app component that provides the Advocate context
 * Wraps the SearchClientWithStore with the necessary context provider
 */
export function AdvocateApp() {
  return (
    <AdvocateProvider>
      <SearchClientWithStore />
    </AdvocateProvider>
  );
}
