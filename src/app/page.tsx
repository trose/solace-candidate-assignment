import { SearchClientWithStore } from "../components/SearchClientWithStore";

// Force dynamic rendering since we fetch fresh data
export const dynamic = 'force-dynamic';

/**
 * Renders the home page containing the "Solace Advocates" heading and the search interface.
 * Uses Zustand for state management.
 *
 * @returns The page's JSX element with the main container, heading, and embedded search interface.
 */
export default async function Home() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Solace Advocates</h1>
      <SearchClientWithStore />
    </main>
  );
}
