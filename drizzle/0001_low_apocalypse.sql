CREATE INDEX IF NOT EXISTS "advocates_first_name_idx" ON "advocates" USING btree ("first_name");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "advocates_last_name_idx" ON "advocates" USING btree ("last_name");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "advocates_city_idx" ON "advocates" USING btree ("city");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "advocates_degree_idx" ON "advocates" USING btree ("degree");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "advocates_years_of_experience_idx" ON "advocates" USING btree ("years_of_experience");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "advocates_full_name_idx" ON "advocates" USING btree ("first_name","last_name");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "advocates_specialties_idx" ON "advocates" USING gin ("specialties");