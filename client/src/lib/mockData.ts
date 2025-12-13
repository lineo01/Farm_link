import produceImage from "@assets/generated_images/fresh_vegetables_in_bamboo_basket.png";
import farmerImage from "@assets/generated_images/friendly_nepali_farmer_portrait.png";

export const PRODUCTS = [
  {
    id: 1,
    name: "Organic Red Tomatoes",
    price: "Rs. 60/kg",
    farmer: "Ram Bahadur",
    location: "Kavre",
    description: "Freshly picked organic tomatoes from my farm in Kavre. No pesticides used.",
    image: produceImage,
    farmerImage: farmerImage,
    postedTime: "2 hours ago",
    likes: 24,
  },
  {
    id: 2,
    name: "Fresh Spinach (Saag)",
    price: "Rs. 40/bundle",
    farmer: "Sita Devi",
    location: "Dhading",
    description: "Green leafy spinach, very healthy and fresh. Harvested this morning.",
    image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&q=80&w=800",
    farmerImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
    postedTime: "4 hours ago",
    likes: 15,
  },
  {
    id: 3,
    name: "Local Oranges (Junar)",
    price: "Rs. 120/kg",
    farmer: "Hari Krishna",
    location: "Sindhuli",
    description: "Sweet and juicy Junar from Sindhuli. Best quality guaranteed.",
    image: "https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?auto=format&fit=crop&q=80&w=800",
    farmerImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
    postedTime: "5 hours ago",
    likes: 42,
  },
  {
    id: 4,
    name: "Cauliflower",
    price: "Rs. 50/kg",
    farmer: "Gita Sharma",
    location: "Bhaktapur",
    description: "Large white cauliflower, pesticide free.",
    image: "https://images.unsplash.com/photo-1568584711075-3d021a7c3ca3?auto=format&fit=crop&q=80&w=800",
    farmerImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200",
    postedTime: "Yesterday",
    likes: 8,
  }
];

export const NOTIFICATIONS = [
  {
    id: 1,
    type: "truck",
    message: "Collection Truck #BA-2-KHA 4455 is arriving at your location in 15 mins.",
    time: "Just now",
    read: false,
  },
  {
    id: 2,
    type: "order",
    message: "New order received for 10kg Tomatoes from Hotel Annapurna.",
    time: "1 hour ago",
    read: true,
  },
  {
    id: 3,
    type: "system",
    message: "Market price update: Tomato prices have increased by Rs. 5/kg.",
    time: "3 hours ago",
    read: true,
  }
];

export const CHATS = [
  {
    id: 1,
    name: "Bhat Bhateni Supplier",
    lastMessage: "Can you deliver 50kg by tomorrow morning?",
    time: "10:30 AM",
    unread: 2,
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=200"
  },
  {
    id: 2,
    name: "Kalimati Wholesaler",
    lastMessage: "Payment sent via eSewa.",
    time: "Yesterday",
    unread: 0,
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200"
  }
];
