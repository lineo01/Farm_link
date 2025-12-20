import { db } from "../server/db";
import { missions, tenders } from "../shared/schema";

async function seed() {
  console.log("Starting database seed...");

  try {
    // Create sample missions
    const missionData = [
      { title: "First Harvest", description: "Post your first product", xpReward: 100 },
      { title: "10 Products Sold", description: "Sell 10 products", xpReward: 500 },
      { title: "5-Star Farmer", description: "Reach 5-star rating", xpReward: 1000 },
    ];

    for (const mission of missionData) {
      await db.insert(missions).values(mission).onConflictDoNothing();
    }

    // Create sample tenders
    const tenderData = [
      {
        buyerName: "Fresh Market Retail",
        buyerType: "Retail",
        itemName: "Tomatoes",
        quantity: "500kg",
        priceMin: "20",
        priceMax: "30",
        location: "Kathmandu",
        description: "Fresh tomatoes for retail sale",
        deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        status: "open",
      },
      {
        buyerName: "Hotel Grand Palace",
        buyerType: "Hospitality",
        itemName: "Lettuce",
        quantity: "200kg",
        priceMin: "25",
        priceMax: "35",
        location: "Kathmandu",
        description: "Organic lettuce for restaurant",
        deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        status: "open",
      },
    ];

    for (const tender of tenderData) {
      await db.insert(tenders).values(tender).onConflictDoNothing();
    }

    console.log("✓ Database seed completed successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
}

seed();
