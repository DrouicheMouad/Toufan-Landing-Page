import { pgTable, serial, text, boolean, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const ordersTable = pgTable("orders", {
  id: serial("id").primaryKey(),
  tracking: text("tracking"),
  firstname: text("firstname").notNull(),
  familyname: text("familyname").notNull(),
  contact_phone: text("contact_phone").notNull(),
  to_wilaya_name: text("to_wilaya_name").notNull(),
  to_commune_name: text("to_commune_name").notNull(),
  is_stopdesk: boolean("is_stopdesk").notNull(),
  stopdesk_id: integer("stopdesk_id"),
  address: text("address"),
  delivery_price: integer("delivery_price").notNull(),
  success: boolean("success").notNull().default(false),
  error_message: text("error_message"),
  created_at: timestamp("created_at").defaultNow().notNull(),
});

export const insertOrderSchema = createInsertSchema(ordersTable).omit({ id: true, created_at: true });
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Order = typeof ordersTable.$inferSelect;
