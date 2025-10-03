import db from "../../../db";
import { advocates } from "../../../db/schema";
import { advocateData } from "../../../db/seed/advocates";
import { cache } from "../../../utils/cache";

/**
 * POST /api/seed
 * Seeds the database with advocate data using PostgreSQL upsert
 * @returns JSON response with seeding statistics
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
          .returning();

        results.push(result);

        // Check if this was an insert or update by comparing created_at
        // If created_at is very recent (within last second), it was likely an insert
        const now = new Date();
        const createdAt = result.createdAt ? new Date(result.createdAt) : now;
        const timeDiff = now.getTime() - createdAt.getTime();

        if (timeDiff < 1000) {
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
    cache.clear();

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
