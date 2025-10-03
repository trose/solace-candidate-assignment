import { pgTable, index, unique, serial, text, integer, bigint, timestamp } from "drizzle-orm/pg-core"
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
	specialties: text("specialties").array().default(sql`'{}'`).notNull(),
},
(table) => {
	return {
		cityIdx: index("advocates_city_idx").using("btree", table.city),
		degreeIdx: index("advocates_degree_idx").using("btree", table.degree),
		firstNameIdx: index("advocates_first_name_idx").using("btree", table.firstName),
		fullNameIdx: index("advocates_full_name_idx").using("btree", table.firstName, table.lastName),
		lastNameIdx: index("advocates_last_name_idx").using("btree", table.lastName),
		specialtiesIdx: index("advocates_specialties_idx").using("gin", table.specialties),
		yearsOfExperienceIdx: index("advocates_years_of_experience_idx").using("btree", table.yearsOfExperience),
		advocatesUniqueNameIdx: unique("advocates_unique_name_idx").on(table.firstName, table.lastName),
	}
});