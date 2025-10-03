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

/**
 * Database schema for the advocates table
 * Contains all advocate information including personal details, specialties, and experience
 */
const advocates = pgTable("advocates", {
  /** Unique identifier for the advocate */
  id: serial("id").primaryKey(),
  /** First name of the advocate */
  firstName: text("first_name").notNull(),
  /** Last name of the advocate */
  lastName: text("last_name").notNull(),
  /** City where the advocate is located */
  city: text("city").notNull(),
  /** Educational degree of the advocate */
  degree: text("degree").notNull(),
  /** Array of specialties the advocate works with */
  specialties: text("specialties").array().default(sql`'{}'`).notNull(),
  /** Number of years of professional experience */
  yearsOfExperience: integer("years_of_experience").notNull(),
  /** Phone number for contact */
  phoneNumber: bigint("phone_number", { mode: "number" }).notNull(),
  /** Timestamp when the record was created */
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
