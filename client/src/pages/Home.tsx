import { useState, useEffect } from "react";
import { Search, Filter, MapPin, ChevronDown, SlidersHorizontal, FileText, HandCoins, Heart, MessageCircle, ShoppingBag, TrendingUp, TrendingDown, Minus, ArrowRight } from "lucide-react";
import { MARKET_RATES } from "@/lib/mockData";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { db, auth } from "@/lib/firebase";
import { collection, query, onSnapshot, orderBy } from "firebase/firestore";
import { useAuth } from "@/hooks/use-auth";
import { cloudinary } from "@/lib/cloudinary";
import { AdvancedImage } from "@cloudinary/react";
import { fill } from "@cloudinary/url-gen/actions/resize";

export default function Home() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [showFilters, setShowFilters] = useState(false);
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    console.log("Subscribing to products...");
    const productsRef = collection(db, "products");
    const q = query(productsRef, orderBy("createdAt", "desc"));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      console.log("Firestore Snapshot received, size:", snapshot.size);
      const productList = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          // Ensure we have fallback values for display
          name: data.name || "Unnamed Product",
          farmer: data.farmer || "Unknown Farmer",
          price: data.price || "Contact for price",
          location: data.location || "Nepal",
          image: data.image || "https://images.unsplash.com/photo-1566385278603-975bad627075?auto=format&fit=crop&q=80&w=800",
          farmerImage: data.farmerImage || "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=200"
        } as any;
      });
      console.log("Processed products:", productList.length);
      setProducts(productList);
    }, (error) => {
      console.error("Detailed product subscription error:", error);
    });
    return () => unsubscribe();
  }, []);

  // Use the logged in user's display name or a fallback
  const currentUserName = user?.displayName || "Farmer";
  const currentUserPhoto = user?.photoURL || "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=200";

  // Filter based on state products instead of mock data
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          product.farmer?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === "All" || product.location === activeFilter;
    return matchesSearch && matchesFilter;
  });

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
          />
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="absolute right-3 top-2.5 p-1.5 hover:bg-muted rounded-lg transition-colors"
          >
            <SlidersHorizontal className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>

        {/* Filter Chips */}
        {showFilters && (
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 animate-in slide-in-from-top-2">
             {["All", "Kavre", "Dhading", "Sindhuli", "Bhaktapur"].map(loc => (
               <button
                 key={loc}
                 onClick={() => setActiveFilter(loc)}
                 className={cn(
                   "px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap border transition-colors",
                   activeFilter === loc 
                     ? "bg-primary text-white border-primary" 
                     : "bg-white text-muted-foreground border-border hover:border-primary/50"
                 )}
               >
                 {loc}
               </button>
             ))}
             <button className="px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap border bg-white text-muted-foreground border-border flex items-center gap-1">
                Qty: High to Low <ChevronDown className="w-3 h-3" />
             </button>
          </div>
        )}
        
        {/* Quick Actions / Featured */}
        <div className="grid grid-cols-2 gap-3 mb-4 px-1">
          <Link href="/tenders">
            <div className="bg-white p-3 rounded-2xl border border-border shadow-sm flex items-center gap-3 cursor-pointer hover:bg-muted/30 transition-colors">
              <div className="bg-blue-100 p-2 rounded-xl text-blue-600">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground font-bold uppercase">Active</p>
                <p className="text-xs font-bold">Tenders</p>
              </div>
            </div>
          </Link>
          <div className="bg-white p-3 rounded-2xl border border-border shadow-sm flex items-center gap-3 cursor-pointer hover:bg-muted/30 transition-colors">
            <div className="bg-orange-100 p-2 rounded-xl text-orange-600">
              <HandCoins className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground font-bold uppercase">Market</p>
              <p className="text-xs font-bold">Rates</p>
            </div>
          </div>
        </div>
      </div>

      {/* Product List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 pt-4 px-4 md:px-0">
        {filteredProducts.map((product, index) => {
          const marketRate = MARKET_RATES[product.name as keyof typeof MARKET_RATES];
          const isGoodPrice = marketRate && parseInt(product.price.split(' ')[1]) <= marketRate.max;

          return (
            <motion.div 
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white border-y border-border/50 sm:border sm:rounded-3xl sm:mx-4 shadow-sm overflow-hidden"
            >
            {/* Marketplace Header */}
            <div className="px-4 py-3 flex items-center justify-between bg-white/50 backdrop-blur-sm">
               <div className="flex items-center gap-3">
                  <div className="relative">
                    <img 
                      src={product.farmerImage} 
                      alt={product.farmer}
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-white shadow-sm" 
                    />
                    <div className="absolute -bottom-1 -right-1 bg-green-500 text-white text-[8px] px-1.5 py-0.5 rounded-full font-bold border-2 border-white">
                      PRO
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-foreground flex items-center gap-1">
                      {product.farmer}
                    </h3>
                    <div className="flex items-center text-xs text-muted-foreground gap-1">
                      <MapPin className="w-3 h-3" />
                      <span>{product.location}</span>
                    </div>
                  </div>
               </div>
               <span className="text-xs font-medium text-muted-foreground bg-muted/50 px-2 py-1 rounded-lg">
                 {product.postedTime}
               </span>
            </div>

            {/* Product Image */}
            <Link href={`/product/${product.id}`}>
              <div className="relative aspect-square w-full bg-muted overflow-hidden group cursor-pointer">
                {product.image && (product.image.includes('res.cloudinary.com') || product.image.includes('cloudinary.com') || !product.image.startsWith('http')) ? (
                  <AdvancedImage 
                    cldImg={cloudinary.image(product.image.split('/').pop()?.split('.')[0] || product.image).resize(fill().width(600).height(600))} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <img 
                    src={product.image || "https://images.unsplash.com/photo-1566385278603-975bad627075?auto=format&fit=crop&q=80&w=800"} 
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                  />
                )}
                
                {/* Floating Price Tag & Overlay */}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-5 pt-20 flex flex-col justify-end">
                   <div className="flex justify-between items-end mb-1">
                      <div className="text-white">
                        <p className="text-sm font-medium opacity-90 mb-0.5">{product.name}</p>
                        <p className="text-3xl font-bold tracking-tight">{product.price}</p>
                      </div>
                   </div>
                   
                   {/* Tap to view details hint */}
                   <div className="flex items-center gap-2 text-white/60 text-xs font-medium mt-2">
                     <span>Tap to view farm details</span>
                     <ArrowRight className="w-3 h-3" />
                   </div>
                </div>

                {/* Badge Overlay */}
                {isGoodPrice && (
                   <div className="absolute top-4 right-4 bg-green-500/90 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg border border-white/20">
                     Best Value
                   </div>
                )}
              </div>
            </Link>

            {/* Commerce Actions */}
            <div className="px-4 py-4 space-y-4">
              {/* Market Rate Comparison */}
              {marketRate && (
                <div className="bg-blue-50/50 rounded-xl p-3 flex items-center justify-between text-xs border border-blue-100">
                   <div className="flex items-center gap-2">
                      <div className={cn(
                        "w-7 h-7 rounded-full flex items-center justify-center shadow-sm",
                        marketRate.trend === 'up' ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"
                      )}>
                        {marketRate.trend === 'up' ? <TrendingUp className="w-3.5 h-3.5" /> : 
                         marketRate.trend === 'down' ? <TrendingDown className="w-3.5 h-3.5" /> :
                         <Minus className="w-3.5 h-3.5" />
                        }
                      </div>
                      <div>
                        <p className="text-muted-foreground font-medium">Market Rate</p>
                        <p className="font-bold text-foreground">Rs. {marketRate.min}-{marketRate.max}</p>
                      </div>
                   </div>
                   <div className="text-right">
                     <p className="text-[10px] text-muted-foreground">vs Market</p>
                     <p className={cn(
                       "font-bold",
                       isGoodPrice ? "text-green-600" : "text-orange-600"
                     )}>
                       {isGoodPrice ? "Lower" : "Higher"}
                     </p>
                   </div>
                </div>
              )}

              <p className="text-sm text-foreground/80 leading-relaxed line-clamp-2">
                {product.description}
              </p>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3">
                 <Link href={`/chat?user=${product.userId}`}>
                   <button className="w-full py-3 rounded-xl bg-muted/50 font-bold text-sm flex items-center justify-center gap-2 hover:bg-muted transition-colors text-foreground/80">
                      <MessageCircle className="w-4 h-4" /> Message
                   </button>
                 </Link>
                 <Link href={`/product/${product.id}`}>
                   <button className="w-full py-3 rounded-xl bg-primary text-white font-bold text-sm flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">
                      <ShoppingBag className="w-4 h-4" /> Order Now
                   </button>
                 </Link>
              </div>
            </div>
          </motion.div>
          );
        })}
      </div>
    </div>
  );
}
