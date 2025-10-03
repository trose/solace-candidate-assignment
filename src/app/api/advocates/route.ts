import db from "../../../db";
import { advocates } from "../../../db/schema";
import { Advocate } from "../../../types/advocate";
import { sql, ilike, or, and, gte, lte, type SQL } from "drizzle-orm";
import { cache, cacheKeys } from "../../../utils/cache";

/**
 * Handle GET requests to fetch advocates filtered by URL search parameters and return the results as JSON.
 *
 * Supported query parameters: `search`, `city`, `degree`, `minExperience`, `maxExperience`, and `specialty`. Results are cached for 5 minutes keyed by the provided parameters.
 *
 * @param request - The incoming HTTP request whose URL search parameters drive the filter criteria
 * @returns A JSON Response containing `{ advocates: Advocate[] }` on success, or `{ error: 'Failed to fetch advocates' }` with status 500 on failure
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const city = searchParams.get('city');
    const degree = searchParams.get('degree');
    const minExperience = searchParams.get('minExperience');
    const maxExperience = searchParams.get('maxExperience');
    const specialty = searchParams.get('specialty');

    // Validate numeric parameters
    if (minExperience && isNaN(parseInt(minExperience))) {
      return Response.json({ error: 'minExperience must be a valid number' }, { status: 400 });
    }
    if (maxExperience && isNaN(parseInt(maxExperience))) {
      return Response.json({ error: 'maxExperience must be a valid number' }, { status: 400 });
    }

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

    // Build dynamic where conditions
    const conditions: SQL[] = [];

    if (search) {
      const searchPattern = `%${search.toLowerCase()}%`;
      const searchCondition = or(
        ilike(advocates.firstName, searchPattern),
        ilike(advocates.lastName, searchPattern),
        ilike(advocates.city, searchPattern),
        ilike(advocates.degree, searchPattern),
        sql`LOWER(${advocates.specialties}::text) LIKE ${searchPattern}`
      );
      if (searchCondition) {
        conditions.push(searchCondition);
      }
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

    // Build and execute query
    let data;
    if (conditions.length > 0) {
      data = await db.select().from(advocates).where(and(...conditions));
    } else {
      data = await db.select().from(advocates);
    }

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
