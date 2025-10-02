import db from "../../../db";
import { advocates } from "../../../db/schema";
import { Advocate } from "../../../types/advocate";

export async function GET() {
  const data = await db.select().from(advocates);

  // Drizzle maps snake_case to camelCase automatically
  const mappedAdvocates: Advocate[] = data.map((row) => {
    const r = row as Record<string, unknown>;
    return {
      id: r.id as number,
      firstName: r.firstName as string,
      lastName: r.lastName as string,
      city: r.city as string,
      degree: r.degree as string,
      specialties: Array.isArray(r.specialties) ? r.specialties as string[] : [],
      yearsOfExperience: r.yearsOfExperience as number,
      phoneNumber: r.phoneNumber as number,
      createdAt: (r.createdAt as Date)?.toISOString() || new Date().toISOString(),
    };
  });

  return Response.json({ advocates: mappedAdvocates });
}
