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

  const getPriceValue = (priceString: string) => {
    if (!priceString) return 0;
    const cleanString = priceString.replace(/,/g, '');
    const matches = cleanString.match(/\d+(\.\d+)?/);
    return matches ? parseFloat(matches[0]) : 0;
  };

  return (
    <div className="bg-[#f8fafc] min-h-full pb-20">
      {/* Search & Filter Header */}
      <div className="bg-white/80 backdrop-blur-xl p-4 sticky top-0 z-10 border-b border-green-100/50">
        <div className="relative mb-4">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-green-600/50" />
          <input 
            type="text"
            placeholder="Search fresh harvest, organic farmers..." 
            className="w-full pl-12 pr-4 py-4 bg-green-50/30 border-2 border-transparent rounded-2xl focus:outline-none focus:border-green-500/20 focus:bg-white transition-all shadow-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 hover:bg-green-50 rounded-xl transition-colors"
          >
            <SlidersHorizontal className="h-5 w-5 text-green-600" />
          </button>
        </div>

        {/* Filter Chips */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
           {["All", "Kavre", "Dhading", "Sindhuli", "Bhaktapur"].map(loc => (
             <button
               key={loc}
               onClick={() => setActiveFilter(loc)}
               className={cn(
                 "px-5 py-2 rounded-xl text-xs font-black whitespace-nowrap border-2 transition-all",
                 activeFilter === loc 
                   ? "bg-green-600 text-white border-green-600 shadow-lg shadow-green-600/20 scale-105" 
                   : "bg-white text-green-700 border-green-100 hover:border-green-300 hover:bg-green-50/30"
               )}
             >
               {loc}
             </button>
           ))}
        </div>
      </div>

      {/* Hero Section */}
      <div className="px-4 py-6">
        <div className="bg-gradient-to-br from-green-600 to-emerald-700 rounded-3xl p-6 text-white shadow-xl shadow-green-900/10 relative overflow-hidden mb-8">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Sprout className="w-32 h-32" />
          </div>
          <div className="relative z-10">
            <h2 className="text-2xl font-serif font-black mb-2">Direct from Farm to Your Table</h2>
            <p className="text-green-50 text-sm font-medium mb-6 opacity-90 leading-relaxed max-w-[240px]">Supporting 5,000+ local Nepali farmers with fresh organic produce.</p>
            <div className="flex gap-4">
               <Link href="/tenders">
                 <button className="bg-white text-green-700 px-5 py-2.5 rounded-xl text-xs font-black shadow-lg hover:bg-green-50 transition-all flex items-center gap-2">
                   <FileText className="w-4 h-4" /> View Tenders
                 </button>
               </Link>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mb-4 px-1">
          <h3 className="text-lg font-black text-foreground">Featured Harvests</h3>
          <span className="text-[10px] font-black uppercase tracking-widest text-green-600 bg-green-50 px-3 py-1 rounded-full">Organic Only</span>
        </div>

        {/* Product List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredProducts.map((product, index) => {
            const marketRate = MARKET_RATES[product.name as keyof typeof MARKET_RATES];
            const isGoodPrice = marketRate && getPriceValue(product.price) <= marketRate.max;

            return (
              <motion.div 
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-[2rem] shadow-xl shadow-green-900/5 border border-green-50 overflow-hidden group hover:shadow-2xl hover:shadow-green-900/10 transition-all duration-500"
              >
              {/* Marketplace Header */}
              <div className="px-5 py-4 flex items-center justify-between">
                 <div className="flex items-center gap-3">
                    <div className="relative">
                      <img 
                        src={product.farmerImage} 
                        alt={product.farmer}
                        className="w-11 h-11 rounded-full object-cover ring-2 ring-green-50 shadow-sm" 
                      />
                      <div className="absolute -bottom-1 -right-1 bg-green-500 text-white text-[7px] px-1.5 py-0.5 rounded-full font-black border-2 border-white shadow-sm">
                        PURE
                      </div>
                    </div>
                    <div>
                      <h3 className="font-black text-sm text-foreground">
                        {product.farmer}
                      </h3>
                      <div className="flex items-center text-[10px] text-muted-foreground font-bold gap-1">
                        <MapPin className="w-3 h-3 text-green-500" />
                        <span>{product.location}</span>
                      </div>
                    </div>
                 </div>
                 <div className="text-right">
                   <p className="text-[9px] font-black text-green-600/40 uppercase tracking-tighter">Listed On</p>
                   <p className="text-[10px] font-black text-foreground/60">{product.postedTime || "Today"}</p>
                 </div>
              </div>

              {/* Product Image */}
              <Link href={`/product/${product.id}`}>
                <div className="relative aspect-[4/3] w-full bg-green-50/30 overflow-hidden cursor-pointer">
                  {product.image && (product.image.includes('res.cloudinary.com') || product.image.includes('cloudinary.com') || !product.image.startsWith('http')) ? (
                    <AdvancedImage 
                      cldImg={cloudinary.image(product.image.split('/').pop()?.split('.')[0] || product.image).resize(fill().width(800).height(600))} 
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    />
                  ) : (
                    <img 
                      src={product.image || "https://images.unsplash.com/photo-1566385278603-975bad627075?auto=format&fit=crop&q=80&w=800"} 
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                    />
                  )}
                  
                  {/* Floating Price Tag & Overlay */}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-6 pt-20 flex flex-col justify-end">
                     <div className="flex justify-between items-end">
                        <div className="text-white">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="bg-green-500/80 backdrop-blur-md text-white text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest border border-white/20">Certified</span>
                            <p className="text-sm font-black opacity-90">{product.name}</p>
                          </div>
                          <p className="text-4xl font-black tracking-tight">{product.price}</p>
                        </div>
                     </div>
                  </div>

                  {/* Badge Overlay */}
                  {isGoodPrice && (
                     <div className="absolute top-5 right-5 bg-white/90 backdrop-blur-md text-green-600 text-[10px] font-black px-4 py-2 rounded-2xl shadow-xl border border-green-100 flex items-center gap-2 animate-bounce">
                       <TrendingDown className="w-3.5 h-3.5" /> Best Market Deal
                     </div>
                  )}
                </div>
              </Link>

              {/* Commerce Actions */}
              <div className="px-5 py-5 space-y-5">
                <p className="text-sm text-foreground/70 leading-relaxed font-medium line-clamp-2">
                  {product.description}
                </p>

                {/* Action Buttons */}
                <div className="flex items-center gap-3">
                   <Link href={`/chat?user=${product.userId}`} className="flex-1">
                     <button className="w-full py-4 rounded-[1.25rem] bg-green-50 text-green-700 font-black text-xs flex items-center justify-center gap-2 hover:bg-green-100 transition-all border border-green-100">
                        <MessageCircle className="w-4 h-4" /> Chat
                     </button>
                   </Link>
                   <Link href={`/product/${product.id}`} className="flex-[1.5]">
                     <button className="w-full py-4 rounded-[1.25rem] bg-green-600 text-white font-black text-xs flex items-center justify-center gap-2 hover:bg-green-700 transition-all shadow-xl shadow-green-600/30 active:scale-95">
                        <ShoppingBag className="w-4 h-4" /> Order Fresh
                     </button>
                   </Link>
                </div>
              </div>
            </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
