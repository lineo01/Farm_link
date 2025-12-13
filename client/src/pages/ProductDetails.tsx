import { PRODUCTS } from "@/lib/mockData";
import { Link, useRoute } from "wouter";
import { ArrowLeft, MapPin, Share2, ShieldCheck, Sprout, Droplets, Sun, Thermometer, MessageCircle, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import soilImage from "@assets/generated_images/detailed_farm_soil_close_up.png";

export default function ProductDetails() {
  const [match, params] = useRoute("/product/:id");
  const id = params ? parseInt(params.id) : 0;
  const product = PRODUCTS.find(p => p.id === id);

  if (!product) return <div>Product not found</div>;

  return (
    <div className="bg-white min-h-screen pb-24">
      {/* Header Image */}
      <div className="relative h-[40vh]">
        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
        <div className="absolute top-0 left-0 right-0 p-4 pt-8 bg-gradient-to-b from-black/60 to-transparent flex justify-between items-center">
          <Link href="/">
            <button className="bg-white/20 backdrop-blur-md p-2 rounded-full text-white hover:bg-white/30 transition-colors">
              <ArrowLeft className="w-6 h-6" />
            </button>
          </Link>
          <button className="bg-white/20 backdrop-blur-md p-2 rounded-full text-white hover:bg-white/30 transition-colors">
            <Share2 className="w-6 h-6" />
          </button>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-white to-transparent pt-20">
          <h1 className="text-3xl font-serif font-bold text-foreground mb-1">{product.name}</h1>
          <p className="text-xl font-bold text-primary">{product.price}</p>
        </div>
      </div>

      <div className="px-5 py-4 space-y-8">
        {/* Farmer Profile */}
        <div className="flex items-center justify-between">
           <div className="flex items-center gap-3">
              <img src={product.farmerImage} className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-md" />
              <div>
                <h3 className="font-bold text-foreground">{product.farmer}</h3>
                <div className="flex items-center text-xs text-muted-foreground gap-1">
                  <MapPin className="w-3 h-3" /> {product.location}
                </div>
              </div>
           </div>
           <Link href="/chat">
             <Button variant="outline" size="sm" className="rounded-full font-bold">Message</Button>
           </Link>
        </div>

        {/* Farming Methods */}
        <div>
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-green-600" />
            Farming Details
          </h3>
          <div className="bg-muted/10 border border-border rounded-2xl p-5 space-y-4">
             <p className="text-sm leading-relaxed text-muted-foreground">
               {product.description} Grown using traditional methods with modern organic supplements. We prioritize soil health and strictly avoid chemical pesticides.
             </p>
             
             <div className="grid grid-cols-2 gap-3">
               <div className="bg-white p-3 rounded-xl border border-border flex items-center gap-3">
                 <div className="bg-green-100 p-2 rounded-lg text-green-700">
                   <Sprout className="w-4 h-4" />
                 </div>
                 <div className="text-xs">
                   <p className="font-bold">Organic</p>
                   <p className="text-muted-foreground">Certified</p>
                 </div>
               </div>
               <div className="bg-white p-3 rounded-xl border border-border flex items-center gap-3">
                 <div className="bg-blue-100 p-2 rounded-lg text-blue-700">
                   <Droplets className="w-4 h-4" />
                 </div>
                 <div className="text-xs">
                   <p className="font-bold">Irrigation</p>
                   <p className="text-muted-foreground">Drip System</p>
                 </div>
               </div>
             </div>
          </div>
        </div>

        {/* Live Farm Data (Mock IoT) */}
        <div>
           <h3 className="font-bold text-lg mb-4">Live Farm Conditions</h3>
           <div className="relative rounded-2xl overflow-hidden h-40 group">
             <img src={soilImage} className="absolute inset-0 w-full h-full object-cover brightness-[0.4]" />
             
             <div className="absolute inset-0 p-5 flex items-center justify-around text-white">
                <div className="text-center">
                  <div className="bg-white/20 backdrop-blur-md p-3 rounded-full mb-2 mx-auto w-fit">
                    <Thermometer className="w-6 h-6 text-orange-300" />
                  </div>
                  <p className="text-2xl font-bold">24°C</p>
                  <p className="text-xs opacity-80">Soil Temp</p>
                </div>
                <div className="h-12 w-px bg-white/20"></div>
                <div className="text-center">
                  <div className="bg-white/20 backdrop-blur-md p-3 rounded-full mb-2 mx-auto w-fit">
                    <Droplets className="w-6 h-6 text-blue-300" />
                  </div>
                  <p className="text-2xl font-bold">65%</p>
                  <p className="text-xs opacity-80">Moisture</p>
                </div>
                <div className="h-12 w-px bg-white/20"></div>
                <div className="text-center">
                  <div className="bg-white/20 backdrop-blur-md p-3 rounded-full mb-2 mx-auto w-fit">
                    <Sun className="w-6 h-6 text-yellow-300" />
                  </div>
                  <p className="text-2xl font-bold">High</p>
                  <p className="text-xs opacity-80">UV Index</p>
                </div>
             </div>
           </div>
           <p className="text-xs text-muted-foreground mt-2 text-center">Data updated 5 mins ago via FarmIoT™ Sensors</p>
        </div>

        {/* Comments Section */}
        <div>
          <h3 className="font-bold text-lg mb-4">Questions & Reviews (3)</h3>
          <div className="space-y-4">
             <div className="flex gap-3">
               <div className="w-8 h-8 rounded-full bg-gray-200 flex-shrink-0" />
               <div className="bg-muted/30 p-3 rounded-2xl rounded-tl-none flex-1">
                 <p className="text-xs font-bold mb-1">Hotel Annapurna</p>
                 <p className="text-sm">Is this suitable for salad usage?</p>
               </div>
             </div>
             
             <div className="flex gap-3 flex-row-reverse">
               <img src={product.farmerImage} className="w-8 h-8 rounded-full flex-shrink-0 border border-white shadow-sm" />
               <div className="bg-primary/10 p-3 rounded-2xl rounded-tr-none flex-1">
                 <p className="text-xs font-bold mb-1 text-primary">Ram Bahadur (Farmer)</p>
                 <p className="text-sm">Yes! These are salad-grade tomatoes, very firm and juicy.</p>
               </div>
             </div>
          </div>

          <div className="mt-4 relative">
             <Input placeholder="Ask a question..." className="pl-4 pr-12 h-12 rounded-full bg-white border-border shadow-sm" />
             <button className="absolute right-1 top-1 h-10 w-10 bg-primary text-white rounded-full flex items-center justify-center hover:bg-primary/90">
               <Send className="w-4 h-4" />
             </button>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Action */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-border flex gap-3 pb-safe z-30 max-w-md mx-auto">
        <div className="flex-1">
           <p className="text-xs text-muted-foreground">Total Price</p>
           <p className="text-xl font-bold text-primary">{product.price}</p>
        </div>
        <Button size="lg" className="flex-1 rounded-xl font-bold shadow-lg shadow-primary/20">
           Order Now
        </Button>
      </div>
    </div>
  );
}
