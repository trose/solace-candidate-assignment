import { pgTable, serial, text, integer, bigint, timestamp } from "drizzle-orm/pg-core"
  import { sql } from "drizzle-orm"



export const advocates = pgTable("advocates", {
	id: serial("id").primaryKey().notNull(),
	firstName: text("first_name").notNull(),
	lastName: text("last_name").notNull(),
	city: text("city").notNull(),
	degree: text("degree").notNull(),
	yearsOfExperience: integer("years_of_experience").notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	phoneNumber: bigint("phone_number", { mode: "number" }).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	specialties: text("specialties").default('{}').array().notNull(),
});