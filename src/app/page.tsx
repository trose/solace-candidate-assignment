import { SearchClient } from "../components/SearchClient";

// Force dynamic rendering since we fetch fresh data
export const dynamic = 'force-dynamic';

export default async function Home() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Solace Advocates</h1>
      <SearchClient />
    </main>
  );
}
