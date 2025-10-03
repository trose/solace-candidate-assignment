import { NextRequest, NextResponse } from 'next/server';
import db from '../../../db';
import { advocates } from '../../../db/schema';
import { Advocate } from '../../../types/advocate';
import { sql, ilike, or, and, gte, lte, type SQL } from 'drizzle-orm';
import { cache, cacheKeys } from '../../../utils/cache';

// Force dynamic rendering since we use request.url
export const dynamic = 'force-dynamic';

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
    const cachedResult = await cache.get<Advocate[]>(cacheKey);
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
    await cache.set(cacheKey, mappedAdvocates, 5 * 60);

    return Response.json({ advocates: mappedAdvocates });
  } catch (error) {
    console.error('Error fetching advocates:', error);
    return Response.json({ error: 'Failed to fetch advocates' }, { status: 500 });
  }
}

/**
 * Handle POST requests to create a new advocate
 *
 * @param request - The incoming HTTP request containing advocate data in the body
 * @returns A JSON Response containing the created advocate on success, or an error message on failure
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    const { firstName, lastName, city, degree, specialties, yearsOfExperience, phoneNumber } = body;

    if (!firstName || !lastName || !city || !degree || !specialties || yearsOfExperience === undefined || !phoneNumber) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate specialties is an array
    if (!Array.isArray(specialties) || specialties.length === 0) {
      return NextResponse.json(
        { error: 'Specialties must be a non-empty array' },
        { status: 400 }
      );
    }

    // Validate years of experience is a number
    if (typeof yearsOfExperience !== 'number' || yearsOfExperience < 0) {
      return NextResponse.json(
        { error: 'Years of experience must be a non-negative number' },
        { status: 400 }
      );
    }

    // Validate phone number (convert to number if it's a string)
    const phoneNumberValue = typeof phoneNumber === 'string'
      ? parseInt(phoneNumber.replace(/\D/g, ''), 10)
      : phoneNumber;

    if (isNaN(phoneNumberValue) || phoneNumberValue <= 0) {
      return NextResponse.json(
        { error: 'Phone number must be a valid number' },
        { status: 400 }
      );
    }

    // Create the advocate
    const [newAdvocate] = await db
      .insert(advocates)
      .values({
        firstName,
        lastName,
        city,
        degree,
        specialties,
        yearsOfExperience,
        phoneNumber: phoneNumberValue,
      })
      .returning();

    // Clear cache to ensure fresh data
    await cache.clear();

    return NextResponse.json({
      message: 'Advocate created successfully',
      advocate: newAdvocate
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating advocate:', error);

    // Handle unique constraint violation
    if (error instanceof Error && error.message.includes('advocates_unique_name_idx')) {
      return NextResponse.json(
        { error: 'An advocate with this name already exists' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create advocate' },
      { status: 500 }
    );
  }
}