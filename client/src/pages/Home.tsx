import { PRODUCTS, MARKET_RATES } from "@/lib/mockData";
import { MapPin, MessageCircle, ShoppingBag, TrendingUp, TrendingDown, Minus, HandCoins, ArrowRight } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { cn } from "@/lib/utils";

export default function Home() {
  return (
    <div className="space-y-6 bg-muted/20 min-h-full pb-8 pt-2">
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
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                />
                
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
                 <Link href="/chat">
                   <button className="w-full py-3 rounded-xl bg-muted/50 font-bold text-sm flex items-center justify-center gap-2 hover:bg-muted transition-colors text-foreground/80">
                      <MessageCircle className="w-4 h-4" /> Message
                   </button>
                 </Link>
                 <Link href="/chat">
                   <button className="w-full py-3 rounded-xl bg-primary text-white font-bold text-sm flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">
                      <ShoppingBag className="w-4 h-4" /> Order
                   </button>
                 </Link>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
