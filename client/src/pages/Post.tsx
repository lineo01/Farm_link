import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Camera, MapPin, TrendingUp, Info } from "lucide-react";
import { useLocation } from "wouter";
import { MARKET_RATES } from "@/lib/mockData";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function Post() {
  const { toast } = useToast();
  const [_, setLocation] = useLocation();
  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState("");
  const [unit, setUnit] = useState("");
  const [locationName, setLocationName] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  // Mock logic to find market rate
  const marketRate = Object.entries(MARKET_RATES).find(([key]) => 
    key.toLowerCase().includes(productName.toLowerCase())
  )?.[1];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await addDoc(collection(db, "products"), {
        name: productName,
        price: `Rs. ${price}`,
        unit,
        location: locationName,
        description,
        farmer: "Ram Bahadur", // Default for now
        farmerImage: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=200",
        image: "https://images.unsplash.com/photo-1566385278603-975bad627075?auto=format&fit=crop&q=80&w=800",
        postedTime: "Just now",
        likes: 0,
        createdAt: serverTimestamp()
      });

      toast({
        title: "Success",
        description: "Your product has been posted and is now live!",
      });
      setLocation("/");
    } catch (error) {
      toast({
        title: "Error",
        variant: "destructive",
        description: "Failed to post product. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-8 pb-20 max-w-2xl mx-auto">
      <h2 className="text-2xl md:text-3xl font-serif font-bold mb-6 text-foreground">Sell Produce</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* ... image upload ... */}
        <div className="border-2 border-dashed border-muted-foreground/30 rounded-2xl p-8 flex flex-col items-center justify-center gap-4 bg-muted/10 hover:bg-muted/20 transition-all cursor-pointer group">
          <div className="bg-white p-4 rounded-full shadow-md group-hover:scale-110 transition-transform">
            <Camera className="w-8 h-8 text-primary" />
          </div>
          <div className="text-center">
             <p className="text-sm font-bold text-foreground">Tap to add photos</p>
             <p className="text-xs text-muted-foreground mt-1">Showcase your harvest</p>
          </div>
        </div>

        <div className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-bold">Product Name</Label>
            <Input 
              id="name" 
              placeholder="e.g. Organic Red Tomatoes" 
              required 
              className="bg-white rounded-xl border-border/50 h-12"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
            />
            {/* Market Rate Card logic remains same */}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price" className="text-sm font-bold">Price (Rs.)</Label>
              <Input 
                id="price" 
                placeholder="00" 
                required 
                className="bg-white rounded-xl border-border/50 h-12"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="unit" className="text-sm font-bold">Unit</Label>
              <Input 
                id="unit" 
                placeholder="per kg" 
                required 
                className="bg-white rounded-xl border-border/50 h-12"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location" className="text-sm font-bold">Farm Location</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
              <Input 
                id="location" 
                placeholder="Select location" 
                className="pl-10 bg-white rounded-xl border-border/50 h-12"
                value={locationName}
                onChange={(e) => setLocationName(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-bold">Description & Methods</Label>
            <Textarea 
              id="description" 
              placeholder="Tell buyers about your farming methods (e.g., Organic, Greenhouse)..." 
              className="bg-white min-h-[120px] rounded-xl border-border/50 resize-none p-4"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>

        <Button 
          type="submit" 
          size="lg" 
          disabled={isLoading}
          className="w-full h-14 text-base font-bold shadow-xl shadow-primary/20 rounded-xl"
        >
          {isLoading ? "Posting..." : "Post to Marketplace"}
        </Button>
      </form>
    </div>
  );
}
