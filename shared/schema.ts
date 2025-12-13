import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, decimal, boolean } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users/Farmers
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  location: text("location").notNull(),
  phone: text("phone"),
  avatar: text("avatar"),
  rating: decimal("rating", { precision: 2, scale: 1 }).default("0"),
  totalSold: integer("total_sold").default(0),
  yearsActive: decimal("years_active", { precision: 3, scale: 1 }).default("0"),
  xp: integer("xp").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

// Products
export const products = pgTable("products", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  name: text("name").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  unit: text("unit").notNull(),
  description: text("description").notNull(),
  image: text("image"),
  location: text("location").notNull(),
  farmingMethod: text("farming_method"),
  isCertifiedOrganic: boolean("is_certified_organic").default(false),
  irrigationType: text("irrigation_type"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Tenders (Bulk Purchase Requests from Buyers)
export const tenders = pgTable("tenders", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  buyerName: text("buyer_name").notNull(),
  buyerType: text("buyer_type").notNull(), // Retail, Hospitality, Wholesale
  itemName: text("item_name").notNull(),
  quantity: text("quantity").notNull(),
  priceMin: decimal("price_min", { precision: 10, scale: 2 }),
  priceMax: decimal("price_max", { precision: 10, scale: 2 }),
  location: text("location").notNull(),
  description: text("description"),
  deadline: timestamp("deadline").notNull(),
  status: text("status").default("open"), // open, closed, urgent
  createdAt: timestamp("created_at").defaultNow(),
});

// Supply Network (Farmer's partners)
export const supplyNetworks = pgTable("supply_networks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  partnerName: text("partner_name").notNull(),
  partnerType: text("partner_type").notNull(),
  status: text("status").default("pending"), // active, pending
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Missions (Gamification)
export const missions = pgTable("missions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  xpReward: integer("xp_reward").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// User Missions (Progress tracking)
export const userMissions = pgTable("user_missions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  missionId: varchar("mission_id").notNull().references(() => missions.id),
  progress: integer("progress").default(0),
  status: text("status").default("active"), // active, completed, locked
  completedAt: timestamp("completed_at"),
});

// Tips (Community sharing)
export const tips = pgTable("tips", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  content: text("content").notNull(),
  likes: integer("likes").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  products: many(products),
  supplyNetworks: many(supplyNetworks),
  userMissions: many(userMissions),
  tips: many(tips),
}));

export const productsRelations = relations(products, ({ one }) => ({
  user: one(users, {
    fields: [products.userId],
    references: [users.id],
  }),
}));

export const supplyNetworksRelations = relations(supplyNetworks, ({ one }) => ({
  user: one(users, {
    fields: [supplyNetworks.userId],
    references: [users.id],
  }),
}));

export const userMissionsRelations = relations(userMissions, ({ one }) => ({
  user: one(users, {
    fields: [userMissions.userId],
    references: [users.id],
  }),
  mission: one(missions, {
    fields: [userMissions.missionId],
    references: [missions.id],
  }),
}));

export const tipsRelations = relations(tips, ({ one }) => ({
  user: one(users, {
    fields: [tips.userId],
    references: [users.id],
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true });
export const insertProductSchema = createInsertSchema(products).omit({ id: true, createdAt: true });
export const insertTenderSchema = createInsertSchema(tenders).omit({ id: true, createdAt: true });
export const insertSupplyNetworkSchema = createInsertSchema(supplyNetworks).omit({ id: true, createdAt: true });
export const insertMissionSchema = createInsertSchema(missions).omit({ id: true, createdAt: true });
export const insertUserMissionSchema = createInsertSchema(userMissions).omit({ id: true, completedAt: true });
export const insertTipSchema = createInsertSchema(tips).omit({ id: true, createdAt: true });

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof products.$inferSelect;
export type InsertTender = z.infer<typeof insertTenderSchema>;
export type Tender = typeof tenders.$inferSelect;
export type InsertSupplyNetwork = z.infer<typeof insertSupplyNetworkSchema>;
export type SupplyNetwork = typeof supplyNetworks.$inferSelect;
export type InsertMission = z.infer<typeof insertMissionSchema>;
export type Mission = typeof missions.$inferSelect;
export type InsertUserMission = z.infer<typeof insertUserMissionSchema>;
export type UserMission = typeof userMissions.$inferSelect;
export type InsertTip = z.infer<typeof insertTipSchema>;
export type Tip = typeof tips.$inferSelect;
