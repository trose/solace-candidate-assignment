import db from "../../../db";
import { advocates } from "../../../db/schema";
import { Advocate } from "../../../types/advocate";
import { sql, ilike, or, and, gte, lte } from "drizzle-orm";
import { cache, cacheKeys } from "../../../utils/cache";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const city = searchParams.get('city');
    const degree = searchParams.get('degree');
    const minExperience = searchParams.get('minExperience');
    const maxExperience = searchParams.get('maxExperience');
    const specialty = searchParams.get('specialty');

    // Create cache key from search parameters
    const cacheKey = cacheKeys.advocates.search({
      search: search || '',
      city: city || '',
      degree: degree || '',
      minExperience: minExperience || '',
      maxExperience: maxExperience || '',
      specialty: specialty || '',
    });

    // Check cache first
    const cachedResult = cache.get<Advocate[]>(cacheKey);
    if (cachedResult) {
      return Response.json({ advocates: cachedResult });
    }

    let query = db.select().from(advocates);

    // Build dynamic where conditions
    const conditions = [];

    if (search) {
      const searchPattern = `%${search.toLowerCase()}%`;
      conditions.push(
        or(
          ilike(advocates.firstName, searchPattern),
          ilike(advocates.lastName, searchPattern),
          ilike(advocates.city, searchPattern),
          ilike(advocates.degree, searchPattern),
          sql`LOWER(${advocates.specialties}::text) LIKE ${searchPattern}`
        )
      );
    }

    if (city) {
      conditions.push(ilike(advocates.city, `%${city}%`));
    }

    if (degree) {
      conditions.push(ilike(advocates.degree, `%${degree}%`));
    }

    if (minExperience) {
      conditions.push(gte(advocates.yearsOfExperience, parseInt(minExperience)));
    }

    if (maxExperience) {
      conditions.push(lte(advocates.yearsOfExperience, parseInt(maxExperience)));
    }

    if (specialty) {
      conditions.push(sql`${advocates.specialties} @> ARRAY[${specialty}]`);
    }

    // Apply conditions if any exist
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    const data = await query;

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

    // Cache the result for 5 minutes
    cache.set(cacheKey, mappedAdvocates, 5 * 60 * 1000);

    return Response.json({ advocates: mappedAdvocates });
  } catch (error) {
    console.error('Error fetching advocates:', error);
    return Response.json({ error: 'Failed to fetch advocates' }, { status: 500 });
  }
}
