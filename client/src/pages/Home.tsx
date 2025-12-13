import { PRODUCTS } from "@/lib/mockData";
import { Heart, MapPin, MessageCircle } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

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
    <div className="space-y-4 bg-muted/20 min-h-full">
      {PRODUCTS.map((product, index) => (
        <motion.div 
          key={product.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white border-b border-border pb-4"
        >
          {/* Header */}
          <div className="px-4 py-3 flex items-center gap-3">
            <img 
              src={product.farmerImage} 
              alt={product.farmer}
              className="w-10 h-10 rounded-full object-cover border border-border" 
            />
            <div>
              <h3 className="font-semibold text-sm text-foreground">{product.farmer}</h3>
              <div className="flex items-center text-xs text-muted-foreground gap-1">
                <MapPin className="w-3 h-3" />
                <span>{product.location}</span>
              </div>
            </div>
            <span className="ml-auto text-xs text-muted-foreground">{product.postedTime}</span>
          </div>

          {/* Image */}
          <div className="relative aspect-square w-full bg-muted overflow-hidden">
            <img 
              src={product.image} 
              alt={product.name}
              className="w-full h-full object-cover" 
            />
            <div className="absolute bottom-4 right-4 bg-black/70 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-sm font-bold">
              {product.price}
            </div>
          </div>

          {/* Actions */}
          <div className="px-4 py-3 space-y-2">
            <div className="flex gap-4">
              <button 
                onClick={() => toggleLike(product.id)}
                className="transition-transform active:scale-90"
              >
                <Heart 
                  className={likedPosts.includes(product.id) ? "fill-red-500 text-red-500" : "text-foreground"} 
                />
              </button>
              <button className="transition-transform active:scale-90">
                <MessageCircle className="text-foreground" />
              </button>
            </div>
            
            <div>
              <span className="font-bold text-sm block mb-1">{product.name}</span>
              <p className="text-sm text-muted-foreground leading-snug">
                <span className="font-semibold text-foreground mr-1">{product.farmer}</span>
                {product.description}
              </p>
            </div>
          </div>
        </motion.div>
      ))}
      <div className="p-8 text-center text-muted-foreground text-sm">
        No more posts
      </div>
    </div>
  );
}
