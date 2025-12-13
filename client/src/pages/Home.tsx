import { PRODUCTS, MARKET_RATES } from "@/lib/mockData";
import { Heart, MapPin, MessageCircle, ShoppingBag, TrendingUp, TrendingDown, Minus, HandCoins } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { cn } from "@/lib/utils";

export default function Home() {
  const [likedPosts, setLikedPosts] = useState<number[]>([]);

  const toggleLike = (id: number) => {
    if (likedPosts.includes(id)) {
      setLikedPosts(likedPosts.filter(postId => postId !== id));
    } else {
      setLikedPosts([...likedPosts, id]);
    }
  };

  return (
    <div className="space-y-4 bg-muted/20 min-h-full pb-8">
      {PRODUCTS.map((product, index) => {
        // Mock market logic
        const marketRate = MARKET_RATES[product.name as keyof typeof MARKET_RATES];
        const isGoodPrice = marketRate && parseInt(product.price.split(' ')[1]) <= marketRate.max;

        return (
          <motion.div 
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white border-b-4 border-muted shadow-sm"
          >
            {/* Marketplace Header */}
            <div className="px-4 py-3 flex items-center justify-between border-b border-border/50">
               <div className="flex items-center gap-3">
                  <img 
                    src={product.farmerImage} 
                    alt={product.farmer}
                    className="w-9 h-9 rounded-full object-cover border border-border" 
                  />
                  <div>
                    <h3 className="font-bold text-sm text-foreground flex items-center gap-1">
                      {product.farmer}
                      <span className="bg-primary/10 text-primary text-[10px] px-1.5 py-0.5 rounded-full font-bold">VERIFIED</span>
                    </h3>
                    <div className="flex items-center text-xs text-muted-foreground gap-1">
                      <MapPin className="w-3 h-3" />
                      <span>{product.location}</span>
                    </div>
                  </div>
               </div>
               <span className="text-xs text-muted-foreground font-mono">{product.postedTime}</span>
            </div>

            {/* Product Image */}
            <div className="relative aspect-square w-full bg-muted overflow-hidden group">
              <img 
                src={product.image} 
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
              />
              {/* Floating Price Tag */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 pt-12">
                 <div className="flex justify-between items-end">
                    <div>
                      <p className="text-white/80 text-xs font-medium mb-1">{product.name}</p>
                      <p className="text-white text-2xl font-bold">{product.price}</p>
                    </div>
                    {/* Order Button in Image */}
                    <button className="bg-white text-black px-4 py-2 rounded-full font-bold text-sm shadow-lg hover:bg-gray-100 flex items-center gap-2 transform transition active:scale-95">
                       <ShoppingBag className="w-4 h-4" /> Order Now
                    </button>
                 </div>
              </div>
            </div>

            {/* Commerce Actions */}
            <div className="px-4 py-3">
              {/* Market Rate Comparison */}
              {marketRate && (
                <div className="bg-muted/30 rounded-lg p-2 flex items-center justify-between mb-3 text-xs border border-border/50">
                   <div className="flex items-center gap-2">
                      <div className={cn(
                        "w-6 h-6 rounded-full flex items-center justify-center",
                        marketRate.trend === 'up' ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"
                      )}>
                        {marketRate.trend === 'up' ? <TrendingUp className="w-3 h-3" /> : 
                         marketRate.trend === 'down' ? <TrendingDown className="w-3 h-3" /> :
                         <Minus className="w-3 h-3" />
                        }
                      </div>
                      <span className="text-muted-foreground">
                        Market Rate: <span className="font-semibold text-foreground">Rs. {marketRate.min}-{marketRate.max}</span>
                      </span>
                   </div>
                   <span className={cn(
                     "font-bold px-2 py-0.5 rounded text-[10px]",
                     isGoodPrice ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"
                   )}>
                     {isGoodPrice ? "GOOD DEAL" : "ABOVE MARKET"}
                   </span>
                </div>
              )}

              <p className="text-sm text-foreground mb-4 leading-relaxed">
                {product.description}
              </p>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3">
                 <Link href="/chat">
                   <button className="w-full py-2.5 rounded-xl border border-border font-semibold text-sm flex items-center justify-center gap-2 hover:bg-muted/50 transition-colors">
                      <HandCoins className="w-4 h-4" /> Negotiate
                   </button>
                 </Link>
                 <Link href="/chat">
                   <button className="w-full py-2.5 rounded-xl border border-border font-semibold text-sm flex items-center justify-center gap-2 hover:bg-muted/50 transition-colors">
                      <MessageCircle className="w-4 h-4" /> Message
                   </button>
                 </Link>
              </div>

              {/* Likes/Social */}
              <div className="mt-4 flex items-center gap-1">
                 <button 
                  onClick={() => toggleLike(product.id)}
                  className="p-1 -ml-1 rounded-full hover:bg-red-50 transition-colors"
                 >
                   <Heart className={cn("w-5 h-5", likedPosts.includes(product.id) ? "fill-red-500 text-red-500" : "text-muted-foreground")} />
                 </button>
                 <span className="text-xs text-muted-foreground font-medium">{product.likes} people interested</span>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
