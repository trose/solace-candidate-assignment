import db from "../../../../db";
import { advocates } from "../../../../db/schema";
import { Advocate } from "../../../../types/advocate";
import { sql, ilike, or, and, gte, lte, type SQL } from "drizzle-orm";
import { cache, cacheKeys } from "../../../../utils/cache";

// Force dynamic rendering since we use request.url
export const dynamic = 'force-dynamic';

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
    const cachedResult = await cache.get<{advocates: Advocate[], total: number}>(cacheKey);
    if (cachedResult) {
      return Response.json(cachedResult);
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

    // Get total count for pagination
    let countResult;
    if (conditions.length > 0) {
      countResult = await db.select({ count: sql<number>`count(*)` }).from(advocates).where(and(...conditions));
    } else {
      countResult = await db.select({ count: sql<number>`count(*)` }).from(advocates);
    }
    const count = countResult[0].count;

    // Build and execute query with pagination
    let data;
    if (conditions.length > 0) {
      const baseQuery = db.select().from(advocates).where(and(...conditions));
      if (limit && offset) {
        data = await baseQuery.limit(parseInt(limit)).offset(parseInt(offset));
      } else if (limit) {
        data = await baseQuery.limit(parseInt(limit));
      } else if (offset) {
        data = await baseQuery.offset(parseInt(offset));
      } else {
        data = await baseQuery;
      }
    } else {
      const baseQuery = db.select().from(advocates);
      if (limit && offset) {
        data = await baseQuery.limit(parseInt(limit)).offset(parseInt(offset));
      } else if (limit) {
        data = await baseQuery.limit(parseInt(limit));
      } else if (offset) {
        data = await baseQuery.offset(parseInt(offset));
      } else {
        data = await baseQuery;
      }
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

    const result = {
      advocates: mappedAdvocates,
      total: count,
      limit: limit ? parseInt(limit) : null,
      offset: offset ? parseInt(offset) : null
    };

    // Cache the result for 5 minutes
    await cache.set(cacheKey, result, 5 * 60);

    return Response.json(result);
  } catch (error) {
    console.error('Error searching advocates:', error);
    return Response.json({ error: 'Failed to search advocates' }, { status: 500 });
  }
}
