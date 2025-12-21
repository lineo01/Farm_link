import { db } from "../server/db.js";
import { products } from "../shared/schema.js";

const DEMO_PRODUCTS = [
  {
    userId: "farmer_001",
    name: "Organic Tomatoes",
    price: "45.00",
    unit: "kg",
    location: "Kathmandu",
    description: "Fresh, pesticide-free tomatoes from organic farm",
    farmingMethod: "Organic",
    isCertifiedOrganic: true,
    irrigationType: "Drip Irrigation",
  },
  {
    userId: "farmer_002",
    name: "Basmati Rice",
    price: "120.00",
    unit: "bag",
    location: "Kavre",
    description: "Premium basmati rice, high quality grain",
    farmingMethod: "Conventional",
    isCertifiedOrganic: false,
    irrigationType: "Flood",
  },
  {
    userId: "farmer_003",
    name: "Fresh Lettuce",
    price: "35.00",
    unit: "bunch",
    location: "Dhading",
    description: "Crisp, tender lettuce, perfect for salads",
    farmingMethod: "Organic",
    isCertifiedOrganic: true,
    irrigationType: "Sprinkler",
  },
  {
    userId: "farmer_004",
    name: "Potatoes (Russet)",
    price: "30.00",
    unit: "kg",
    location: "Sindhuli",
    description: "Large, starchy potatoes for cooking",
    farmingMethod: "Conventional",
    isCertifiedOrganic: false,
    irrigationType: "Flood",
  },
  {
    userId: "farmer_005",
    name: "Bell Peppers (Mixed)",
    price: "55.00",
    unit: "kg",
    location: "Kathmandu",
    description: "Mix of red, yellow, and green bell peppers",
    farmingMethod: "Organic",
    isCertifiedOrganic: true,
    irrigationType: "Drip Irrigation",
  },
  {
    userId: "farmer_001",
    name: "Cucumber",
    price: "25.00",
    unit: "kg",
    location: "Kathmandu",
    description: "Fresh cucumber, ideal for pickling",
    farmingMethod: "Conventional",
    isCertifiedOrganic: false,
    irrigationType: "Sprinkler",
  },
  {
    userId: "farmer_002",
    name: "Onions (Yellow)",
    price: "35.00",
    unit: "kg",
    location: "Kavre",
    description: "Yellow onions with good storage quality",
    farmingMethod: "Conventional",
    isCertifiedOrganic: false,
    irrigationType: "Flood",
  },
  {
    userId: "farmer_003",
    name: "Spinach (Fresh)",
    price: "40.00",
    unit: "kg",
    location: "Dhading",
    description: "Tender spinach, rich in iron",
    farmingMethod: "Organic",
    isCertifiedOrganic: true,
    irrigationType: "Sprinkler",
  },
];

async function seedData() {
  console.log("🌱 Seeding demo products...");
  try {
    for (const product of DEMO_PRODUCTS) {
      await db.insert(products).values(product);
    }
    console.log("✅ Successfully seeded", DEMO_PRODUCTS.length, "demo products");
  } catch (error) {
    console.error("❌ Error seeding data:", error);
    process.exit(1);
  }
}

seedData();
