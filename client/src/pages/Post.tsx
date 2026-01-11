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

export default function Post() {
  const { toast } = useToast();
  const [_, setLocation] = useLocation();
  const [productName, setProductName] = useState("");
  
  // Mock logic to find market rate
  const marketRate = Object.entries(MARKET_RATES).find(([key]) => 
    key.toLowerCase().includes(productName.toLowerCase())
  )?.[1];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Success",
      description: "Your product has been posted to the marketplace.",
    });
    setLocation("/");
  };

  return (
    <div className="p-4 md:p-8 pb-20 max-w-2xl mx-auto">
      <h2 className="text-2xl md:text-3xl font-serif font-bold mb-6 text-foreground">Sell Produce</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Image Upload Area */}
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
            
            {/* Live Market Rate Card */}
            {productName.length > 2 && (
              <div className="mt-3 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-4 animate-in fade-in slide-in-from-top-2">
                <div className="flex items-start gap-3">
                   <div className="bg-blue-100 p-2 rounded-lg">
                     <TrendingUp className="w-5 h-5 text-blue-600" />
                   </div>
                   <div className="flex-1">
                     <h4 className="font-bold text-sm text-blue-900 mb-1">Market Insight</h4>
                     {marketRate ? (
                       <div className="text-sm">
                         <span className="text-muted-foreground">Current rate in Kalimati:</span>
                         <div className="font-bold text-lg text-blue-700 mt-1">
                           Rs. {marketRate.min} - {marketRate.max} <span className="text-xs font-normal text-muted-foreground">/kg</span>
                         </div>
                         <p className="text-xs text-blue-600/80 mt-1 flex items-center gap-1">
                           <Info className="w-3 h-3" /> 
                           Trend is {marketRate.trend} today
                         </p>
                       </div>
                     ) : (
                       <p className="text-sm text-muted-foreground italic">
                         Enter specific produce name to see rates...
                       </p>
                     )}
                   </div>
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price" className="text-sm font-bold">Price</Label>
              <Input id="price" placeholder="Rs. 00" required className="bg-white rounded-xl border-border/50 h-12" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="unit" className="text-sm font-bold">Unit</Label>
              <Input id="unit" placeholder="per kg" required className="bg-white rounded-xl border-border/50 h-12" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location" className="text-sm font-bold">Farm Location</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
              <Input id="location" placeholder="Select location" className="pl-10 bg-white rounded-xl border-border/50 h-12" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-bold">Description & Methods</Label>
            <Textarea 
              id="description" 
              placeholder="Tell buyers about your farming methods (e.g., Organic, Greenhouse)..." 
              className="bg-white min-h-[120px] rounded-xl border-border/50 resize-none p-4"
            />
          </div>
        </div>

        <Button type="submit" size="lg" className="w-full h-14 text-base font-bold shadow-xl shadow-primary/20 rounded-xl">
          Post to Marketplace
        </Button>
      </form>
    </div>
  );
}
