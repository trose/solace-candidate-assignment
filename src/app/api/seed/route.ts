import db from "../../../db";
import { advocates } from "../../../db/schema";
import { advocateData } from "../../../db/seed/advocates";
import { cache } from "../../../utils/cache";
import { sql } from "drizzle-orm";

/**
 * Seed advocate records by performing per-record upserts and clearing the cache afterward.
 *
 * Processes each entry from the seed data: inserts a new advocate or updates fields on conflict
 * (conflict key: `firstName`, `lastName`). Individual record errors are logged and do not stop
 * processing of remaining records. After processing, the cache is cleared.
 *
 * @returns A Response whose JSON body contains:
 * - `message`: summary of inserted and updated counts,
 * - `advocates`: array of resulting advocate records,
 * - `stats`: object with `inserted`, `updated`, and `total` counts.
 * On failure returns a 500 Response with an `{ error: 'Failed to seed advocates' }` payload.
 */
export async function POST() {
  try {
    let insertedCount = 0;
    let updatedCount = 0;
    const results = [];

    // Process each advocate individually for better upsert control
    for (const advocate of advocateData) {
      try {
        // Use PostgreSQL's native INSERT ... ON CONFLICT UPDATE
        // Use xmax system column to detect if row was inserted (xmax = 0) or updated (xmax > 0)
        const [result] = await db
          .insert(advocates)
          .values(advocate)
          .onConflictDoUpdate({
            target: [advocates.firstName, advocates.lastName],
            set: {
              city: advocate.city,
              degree: advocate.degree,
              specialties: advocate.specialties,
              yearsOfExperience: advocate.yearsOfExperience,
              phoneNumber: advocate.phoneNumber,
            }
          })
          .returning({
            id: advocates.id,
            firstName: advocates.firstName,
            lastName: advocates.lastName,
            city: advocates.city,
            degree: advocates.degree,
            specialties: advocates.specialties,
            yearsOfExperience: advocates.yearsOfExperience,
            phoneNumber: advocates.phoneNumber,
            createdAt: advocates.createdAt,
            isInsert: sql<boolean>`(xmax = 0)`
          });

        results.push(result);

        // Use PostgreSQL xmax to determine if this was an insert or update
        if (result.isInsert) {
          insertedCount++;
        } else {
          updatedCount++;
        }
      } catch (recordError) {
        console.error(`Error processing advocate ${advocate.firstName} ${advocate.lastName}:`, recordError);
        // Continue with other records even if one fails
      }
    }

    // Clear cache after seeding to ensure fresh data
    await cache.clear();

    return Response.json({
      message: `Seeding completed: ${insertedCount} inserted, ${updatedCount} updated`,
      advocates: results,
      stats: {
        inserted: insertedCount,
        updated: updatedCount,
        total: results.length
      }
    });
  } catch (error) {
    console.error('Error seeding advocates:', error);
    return Response.json({ error: 'Failed to seed advocates' }, { status: 500 });
  }
}
