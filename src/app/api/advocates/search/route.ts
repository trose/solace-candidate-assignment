import db from "../../../../db";
import { advocates } from "../../../../db/schema";
import { Advocate } from "../../../../types/advocate";
import { sql, ilike, or, and, gte, lte } from "drizzle-orm";
import { cache, cacheKeys } from "../../../../utils/cache";

/**
 * Handle GET requests to search advocates using optional filters, pagination, and caching.
 *
 * Performs a filtered search over advocates (by search text, city, degree, years of experience, and specialty),
 * applies limit/offset pagination, caches the result for 5 minutes, and returns the matching advocates and total count.
 *
 * @returns The successful response body: `{ advocates: Advocate[], total: number, limit: number | null, offset: number | null }`.
 *          On failure returns an error object `{ error: string }` with a 500 status.
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
    const limit = searchParams.get('limit');
    const offset = searchParams.get('offset');

    // Validate numeric parameters
    if (minExperience && isNaN(parseInt(minExperience))) {
      return Response.json({ error: 'minExperience must be a valid number' }, { status: 400 });
    }
    if (maxExperience && isNaN(parseInt(maxExperience))) {
      return Response.json({ error: 'maxExperience must be a valid number' }, { status: 400 });
    }
    if (limit && (isNaN(parseInt(limit)) || parseInt(limit) < 1)) {
      return Response.json({ error: 'limit must be a positive number' }, { status: 400 });
    }
    if (offset && (isNaN(parseInt(offset)) || parseInt(offset) < 0)) {
      return Response.json({ error: 'offset must be a non-negative number' }, { status: 400 });
    }

    // Create cache key from search parameters
    const cacheKey = cacheKeys.advocates.search({
      search: search || '',
      city: city || '',
      degree: degree || '',
      minExperience: minExperience || '',
      maxExperience: maxExperience || '',
      specialty: specialty || '',
      limit: limit || '',
      offset: offset || '',
    });

    // Check cache first
    const cachedResult = cache.get<{advocates: Advocate[], total: number}>(cacheKey);
    if (cachedResult) {
      return Response.json(cachedResult);
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

    // Add pagination
    if (limit) {
      query = query.limit(parseInt(limit));
    }
    if (offset) {
      query = query.offset(parseInt(offset));
    }

    const data = await query;

    // Get total count for pagination
    let countQuery = db.select({ count: sql<number>`count(*)` }).from(advocates);
    if (conditions.length > 0) {
      countQuery = countQuery.where(and(...conditions));
    }
    const [{ count }] = await countQuery;

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

    const result = {
      advocates: mappedAdvocates,
      total: count,
      limit: limit ? parseInt(limit) : null,
      offset: offset ? parseInt(offset) : null
    };

    // Cache the result for 5 minutes
    cache.set(cacheKey, result, 5 * 60 * 1000);

    return Response.json(result);
  } catch (error) {
    console.error('Error searching advocates:', error);
    return Response.json({ error: 'Failed to search advocates' }, { status: 500 });
  }
}
