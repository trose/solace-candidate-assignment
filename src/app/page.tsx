import { Advocate } from "../types/advocate";
import { SearchClient } from "../components/SearchClient";

async function getAdvocates(): Promise<Advocate[]> {
  try {
    const response = await fetch('/api/advocates', {
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
