import db from "../../../db";
import { advocates } from "../../../db/schema";
import { advocateData } from "../../../db/seed/advocates";

export async function POST() {
  try {
    // change to upsert
    const records = await db.insert(advocates).values(advocateData).returning();

    return Response.json({ advocates: records });
  } catch (error) {
    console.error('Error seeding advocates:', error);
    return Response.json({ error: 'Failed to seed advocates' }, { status: 500 });
  }
}
