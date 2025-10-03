import { LazyAdvocateApp } from "../components/LazyComponents";

// Force dynamic rendering since we fetch fresh data
export const dynamic = 'force-dynamic';

/**
 * Renders the home page containing the "Solace Advocates" heading and the Advocate app.
 * Uses lazy loading and React context for better performance and state management.
 *
 * @returns The page's JSX element with the main container, heading, and embedded Advocate app.
 */
export default async function Home() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Solace Advocates</h1>
      <LazyAdvocateApp />
    </main>
  );
}
