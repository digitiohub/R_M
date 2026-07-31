import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

const contentFields = {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  slug: text("slug").notNull(),
  status: text("status").notNull().default("draft"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
};
export const services = sqliteTable("services", { ...contentFields, description: text("description").notNull(), metric: text("metric") });
export const caseStudies = sqliteTable("case_studies", { ...contentFields, summary: text("summary").notNull(), metric: text("metric"), metricLabel: text("metric_label") });
export const testimonials = sqliteTable("testimonials", { id: integer("id").primaryKey({ autoIncrement: true }), quote: text("quote").notNull(), author: text("author"), company: text("company"), status: text("status").notNull().default("draft") });
export const masterclasses = sqliteTable("masterclasses", { ...contentFields, description: text("description"), duration: text("duration") });
export const articles = sqliteTable("articles", { ...contentFields, excerpt: text("excerpt"), body: text("body") });
export const integrations = sqliteTable("integrations", { id: integer("id").primaryKey({ autoIncrement: true }), name: text("name").notNull(), url: text("url"), status: text("status").notNull().default("draft") });
export const auditEnquiries = sqliteTable("audit_enquiries", {
  id: integer("id").primaryKey({ autoIncrement: true }), name: text("name").notNull(), company: text("company").notNull(),
  email: text("email").notNull(), phone: text("phone").notNull(), website: text("website").notNull(), orderVolume: text("order_volume").notNull(),
  platforms: text("platforms").notNull().default(""), challenge: text("challenge").notNull(), consent: integer("consent", { mode: "boolean" }).notNull(),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});
export const contactEnquiries = sqliteTable("contact_enquiries", {
  id: integer("id").primaryKey({ autoIncrement: true }), name: text("name").notNull(), email: text("email").notNull(),
  message: text("message").notNull(), createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});
