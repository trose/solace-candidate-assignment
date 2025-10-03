import { sql } from "drizzle-orm";
import {
  pgTable,
  integer,
  text,
  serial,
  timestamp,
  bigint,
  index,
  unique,
} from "drizzle-orm/pg-core";

const advocates = pgTable("advocates", {
  id: serial("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  city: text("city").notNull(),
  degree: text("degree").notNull(),
  specialties: text("specialties").array().default(sql`'{}'`).notNull(),
  yearsOfExperience: integer("years_of_experience").notNull(),
  phoneNumber: bigint("phone_number", { mode: "number" }).notNull(),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
}, (table) => ({
  // Indexes for searchable fields
  firstNameIdx: index("advocates_first_name_idx").on(table.firstName),
  lastNameIdx: index("advocates_last_name_idx").on(table.lastName),
  cityIdx: index("advocates_city_idx").on(table.city),
  degreeIdx: index("advocates_degree_idx").on(table.degree),
  yearsOfExperienceIdx: index("advocates_years_of_experience_idx").on(table.yearsOfExperience),
  // Composite index for full name searches
  fullNameIdx: index("advocates_full_name_idx").on(table.firstName, table.lastName),
  // GIN index for array searches on specialties
  specialtiesIdx: index("advocates_specialties_idx").using("gin", table.specialties),
  // Unique constraint on first name + last name combination
  uniqueNameIdx: unique("advocates_unique_name_idx").on(table.firstName, table.lastName),
}));

export { advocates };
