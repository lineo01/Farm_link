import { useState, useEffect } from "react";
import { Search, Filter, MapPin, ChevronDown, SlidersHorizontal, Heart, MessageCircle, ShoppingBag, TrendingUp, TrendingDown, Minus, HandCoins, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [showFilters, setShowFilters] = useState(false);

  // Fetch real products from API
  const { data: products = [], isLoading } = useQuery({
    queryKey: ["/api/products"],
    queryFn: async () => {
      const res = await fetch("/api/products");
      if (!res.ok) throw new Error("Failed to fetch products");
      return res.json();
    },
  });

  // Filter products
  const filteredProducts = products.filter((product: any) => {
    const matchesSearch = product.name?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === "All" || product.location === activeFilter;
    return matchesSearch && matchesFilter;
  });

  const locations = ["All", "Kathmandu", "Kavre", "Dhading", "Sindhuli", "Bhaktapur"];

  return (
    <div className="bg-muted/10 min-h-full pb-20">
      {/* Search & Filter Header */}
      <div className="bg-white p-4 sticky top-0 z-10 shadow-sm border-b border-border">
        <div className="relative mb-3">
          <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
          <input 
            type="text"
            placeholder="Search products, farmers..." 
            className="w-full pl-10 pr-4 py-3 bg-muted/30 border border-border/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            data-testid="input-search"
          />
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="absolute right-3 top-2.5 p-1.5 hover:bg-muted rounded-lg transition-colors"
            data-testid="button-filter"
          >
            <SlidersHorizontal className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>

        {/* Filter Chips */}
        {showFilters && (
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 animate-in slide-in-from-top-2">
             {locations.map(loc => (
               <button
                 key={loc}
                 onClick={() => setActiveFilter(loc)}
                 className={cn(
                   "px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap border transition-colors",
                   activeFilter === loc 
                     ? "bg-primary text-white border-primary" 
                     : "bg-white text-muted-foreground border-border hover:border-primary/50"
                 )}
                 data-testid={`button-filter-${loc}`}
               >
                 {loc}
               </button>
             ))}
          </div>
        )}
        
        {/* Tenders Banner */}
        <Link href="/tenders">
          <div className="mt-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-3 text-white flex items-center justify-between shadow-lg shadow-blue-200 cursor-pointer hover:scale-[1.01] transition-transform" data-testid="banner-tenders">
             <div>
               <p className="text-xs font-medium opacity-80">New Opportunities</p>
               <p className="font-bold text-sm">Active Tenders for your crops</p>
             </div>
             <div className="bg-white/20 p-2 rounded-lg">
               <ArrowRight className="w-4 h-4" />
             </div>
          </div>
        </Link>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      )}

      {/* Product List */}
      {!isLoading && (
        <div className="space-y-6 pt-4 px-0 sm:px-4">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground">No products found. Be the first to post!</p>
            </div>
          ) : (
            filteredProducts.map((product: any, index: number) => (
              <motion.div 
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white border-y border-border/50 sm:border sm:rounded-3xl sm:mx-0 shadow-sm overflow-hidden"
                data-testid={`card-product-${product.id}`}
              >
              {/* Marketplace Header */}
              <div className="px-4 py-3 flex items-center justify-between bg-white/50 backdrop-blur-sm">
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-white font-bold">
                      {product.name?.[0] || "P"}
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-foreground">Farmer</h3>
                      <div className="flex items-center text-xs text-muted-foreground gap-1">
                        <MapPin className="w-3 h-3" />
                        <span>{product.location || "Location unknown"}</span>
                      </div>
                    </div>
                 </div>
                 <span className="text-xs font-medium text-muted-foreground bg-muted/50 px-2 py-1 rounded-lg">
                   {new Date(product.createdAt).toLocaleDateString()}
                 </span>
              </div>

              {/* Product Image */}
              <Link href={`/product/${product.id}`}>
                <div className="relative aspect-square w-full bg-muted overflow-hidden group cursor-pointer">
                  {product.image ? (
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted to-muted/50">
                      <ShoppingBag className="w-12 h-12 text-muted-foreground/30" />
                    </div>
                  )}
                </div>
              </Link>

              {/* Product Details */}
              <div className="p-4 space-y-3">
                <div>
                  <h2 className="text-lg font-bold text-foreground text-truncate" data-testid={`text-name-${product.id}`}>
                    {product.name}
                  </h2>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {product.description || "No description provided"}
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold text-primary" data-testid={`text-price-${product.id}`}>
                      Rs. {product.price}
                    </p>
                    <p className="text-xs text-muted-foreground">per {product.unit || "unit"}</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="bg-white border border-border/50 p-3 rounded-lg hover:bg-muted transition-colors" data-testid="button-like">
                      <Heart className="w-5 h-5" />
                    </button>
                    <button className="bg-primary text-white px-6 py-3 rounded-lg font-bold hover:bg-primary/90 transition-colors flex items-center gap-2" data-testid="button-chat">
                      <MessageCircle className="w-4 h-4" />
                      <span className="hidden sm:inline">Chat</span>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
