import { headers } from 'next/headers';
import { Advocate } from "../types/advocate";
import { SearchClient } from "../components/SearchClient";

// Force dynamic rendering since we fetch fresh data
export const dynamic = 'force-dynamic';

async function getAdvocates(): Promise<{ advocates: Advocate[]; error?: string }> {
  try {
    // In server components, construct the full URL using headers
    const headersList = headers();
    const host = headersList.get('host') || 'localhost:3000';
    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
    const baseUrl = `${protocol}://${host}`;

    const response = await fetch(`${baseUrl}/api/advocates`);
    const data = await response.json();
    return { advocates: data.advocates || [] };
  } catch (error) {
    console.error('Failed to fetch advocates:', error);
    return { advocates: [], error: 'Failed to load advocates. Please try again later.' };
  }
}

export default async function Home() {
  const { advocates, error } = await getAdvocates();

  return (
    <main style={{ margin: "24px" }}>
      <h1>Solace Advocates</h1>
      <br />
      <br />
      {error && <div role="alert" style={{ color: 'red' }}>{error}</div>}
      <SearchClient initialAdvocates={advocates} />
    </main>
  );
}
