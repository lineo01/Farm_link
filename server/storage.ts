import {
  users,
  products,
  tenders,
  supplyNetworks,
  missions,
  userMissions,
  tips,
  type User,
  type InsertUser,
  type Product,
  type InsertProduct,
  type Tender,
  type InsertTender,
  type SupplyNetwork,
  type InsertSupplyNetwork,
  type Mission,
  type InsertMission,
  type UserMission,
  type InsertUserMission,
  type Tip,
  type InsertTip,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Products
  getProducts(): Promise<Product[]>;
  getProduct(id: string): Promise<Product | undefined>;
  getProductsByUser(userId: string): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  
  // Tenders
  getTenders(): Promise<Tender[]>;
  getTender(id: string): Promise<Tender | undefined>;
  createTender(tender: InsertTender): Promise<Tender>;
  
  // Supply Networks
  getSupplyNetworksByUser(userId: string): Promise<SupplyNetwork[]>;
  createSupplyNetwork(network: InsertSupplyNetwork): Promise<SupplyNetwork>;
  
  // Missions
  getMissions(): Promise<Mission[]>;
  getUserMissions(userId: string): Promise<(UserMission & { mission: Mission })[]>;
  createUserMission(userMission: InsertUserMission): Promise<UserMission>;
  updateUserMissionProgress(id: string, progress: number, status?: string): Promise<void>;
  
  // Tips
  getTips(): Promise<(Tip & { user: User })[]>;
  createTip(tip: InsertTip): Promise<Tip>;
}

export class DatabaseStorage implements IStorage {
  // Users
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  // Products
  async getProducts(): Promise<Product[]> {
    return await db.select().from(products).orderBy(desc(products.createdAt));
  }

  async getProduct(id: string): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product || undefined;
  }

  async getProductsByUser(userId: string): Promise<Product[]> {
    return await db.select().from(products).where(eq(products.userId, userId));
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const [product] = await db
      .insert(products)
      .values(insertProduct)
      .returning();
    return product;
  }

  // Tenders
  async getTenders(): Promise<Tender[]> {
    return await db.select().from(tenders).orderBy(desc(tenders.createdAt));
  }

  async getTender(id: string): Promise<Tender | undefined> {
    const [tender] = await db.select().from(tenders).where(eq(tenders.id, id));
    return tender || undefined;
  }

  async createTender(insertTender: InsertTender): Promise<Tender> {
    const [tender] = await db
      .insert(tenders)
      .values(insertTender)
      .returning();
    return tender;
  }

  // Supply Networks
  async getSupplyNetworksByUser(userId: string): Promise<SupplyNetwork[]> {
    return await db.select().from(supplyNetworks).where(eq(supplyNetworks.userId, userId));
  }

  async createSupplyNetwork(insertNetwork: InsertSupplyNetwork): Promise<SupplyNetwork> {
    const [network] = await db
      .insert(supplyNetworks)
      .values(insertNetwork)
      .returning();
    return network;
  }

  // Missions
  async getMissions(): Promise<Mission[]> {
    return await db.select().from(missions);
  }

  async getUserMissions(userId: string): Promise<(UserMission & { mission: Mission })[]> {
    const results = await db
      .select()
      .from(userMissions)
      .leftJoin(missions, eq(userMissions.missionId, missions.id))
      .where(eq(userMissions.userId, userId));
    
    return results.map(r => ({
      ...r.user_missions,
      mission: r.missions!,
    }));
  }

  async createUserMission(insertUserMission: InsertUserMission): Promise<UserMission> {
    const [userMission] = await db
      .insert(userMissions)
      .values(insertUserMission)
      .returning();
    return userMission;
  }

  async updateUserMissionProgress(id: string, progress: number, status?: string): Promise<void> {
    const updateData: any = { progress };
    if (status) updateData.status = status;
    await db.update(userMissions).set(updateData).where(eq(userMissions.id, id));
  }

  // Tips
  async getTips(): Promise<(Tip & { user: User })[]> {
    const results = await db
      .select()
      .from(tips)
      .leftJoin(users, eq(tips.userId, users.id))
      .orderBy(desc(tips.likes));
    
    return results.map(r => ({
      ...r.tips,
      user: r.users!,
    }));
  }

  async createTip(insertTip: InsertTip): Promise<Tip> {
    const [tip] = await db
      .insert(tips)
      .values(insertTip)
      .returning();
    return tip;
  }
}

export const storage = new DatabaseStorage();
