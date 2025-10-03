import { headers } from 'next/headers';
import { Advocate } from "../types/advocate";
import { SearchClient } from "../components/SearchClient";

// Force dynamic rendering since we fetch fresh data
export const dynamic = 'force-dynamic';

async function getAdvocates(): Promise<Advocate[]> {
  try {
    // In server components, construct the full URL using headers
    const headersList = headers();
    const host = headersList.get('host') || 'localhost:3000';
    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
    const baseUrl = `${protocol}://${host}`;

    const response = await fetch(`${baseUrl}/api/advocates`, {
      cache: 'no-store' // Ensure fresh data on each request
    });
    const data = await response.json();
    return data.advocates || [];
  } catch (error) {
    console.error('Failed to fetch advocates:', error);
    return [];
  }
}

export default async function Home() {
  const advocates = await getAdvocates();

  return (
    <main style={{ margin: "24px" }}>
      <h1>Solace Advocates</h1>
      <br />
      <br />
      <SearchClient initialAdvocates={advocates} />
    </main>
  );
}
