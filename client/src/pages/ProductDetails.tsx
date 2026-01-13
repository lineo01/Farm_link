import { Link, useRoute } from "wouter";
import { ArrowLeft, MapPin, Share2, ShieldCheck, Sprout, Droplets, Sun, Thermometer, MessageCircle, HelpCircle, BadgeCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import soilImage from "@assets/generated_images/detailed_farm_soil_close_up.png";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useState, useEffect } from "react";
import { cloudinary } from "@/lib/cloudinary";
import { AdvancedImage } from "@cloudinary/react";
import { fill } from "@cloudinary/url-gen/actions/resize";

export default function ProductDetails() {
  const [match, params] = useRoute("/product/:id");
  const id = params?.id;
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProduct() {
      if (!id) return;
      try {
        const docRef = doc(db, "products", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProduct({ id: docSnap.id, ...docSnap.data() });
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="animate-pulse text-primary font-bold">Loading harvest details...</div>
    </div>
  );

  if (!product) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white p-6 text-center">
      <h2 className="text-2xl font-serif font-bold text-foreground mb-2">Product Not Found</h2>
      <p className="text-muted-foreground mb-6">This harvest listing might have been removed or sold.</p>
      <Link href="/">
        <Button className="rounded-xl px-8">Back to Marketplace</Button>
      </Link>
    </div>
  );

  const sensorData = product.sensorData || {
    temperature: "24°C",
    soilMoisture: "65%",
    uvIndex: "High"
  };

  return (
    <div className="bg-white min-h-screen pb-24">
      {/* Header Image */}
      <div className="relative h-[40vh]">
        {product.image && (product.image.includes('res.cloudinary.com') || product.image.includes('cloudinary.com') || !product.image.startsWith('http')) ? (
          <AdvancedImage 
            cldImg={cloudinary.image(product.image.split('/').pop()?.split('.')[0] || product.image).resize(fill().width(800).height(600))} 
            className="w-full h-full object-cover"
          />
        ) : (
          <img src={product.image || "https://images.unsplash.com/photo-1566385278603-975bad627075?auto=format&fit=crop&q=80&w=800"} alt={product.name} className="w-full h-full object-cover" />
        )}
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
             <div className="text-sm leading-relaxed text-muted-foreground">
               <p className="mb-3 font-medium text-foreground">Growing Methods:</p>
               <p>{product.description || "Grown using traditional methods with modern organic supplements. We prioritize soil health and strictly avoid chemical pesticides."}</p>
               {product.methods && (
                 <p className="mt-2 text-primary font-bold">{product.methods}</p>
               )}
             </div>
             
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

        {/* Live Farm Data (Smart Sensors) */}
        <div>
           <h3 className="font-bold text-lg mb-4">Live Farm Conditions</h3>
           <div className="relative rounded-2xl overflow-hidden h-40 group">
             <img src={soilImage} className="absolute inset-0 w-full h-full object-cover brightness-[0.4]" />
             
             <div className="absolute inset-0 p-5 flex items-center justify-around text-white">
                <div className="text-center">
                  <div className="bg-white/20 backdrop-blur-md p-3 rounded-full mb-2 mx-auto w-fit">
                    <Thermometer className="w-6 h-6 text-orange-300" />
                  </div>
                  <p className="text-2xl font-bold">{sensorData.temperature}</p>
                  <p className="text-xs opacity-80">Soil Temp</p>
                </div>
                <div className="h-12 w-px bg-white/20"></div>
                <div className="text-center">
                  <div className="bg-white/20 backdrop-blur-md p-3 rounded-full mb-2 mx-auto w-fit">
                    <Droplets className="w-6 h-6 text-blue-300" />
                  </div>
                  <p className="text-2xl font-bold">{sensorData.soilMoisture || sensorData.humidity}</p>
                  <p className="text-xs opacity-80">Moisture</p>
                </div>
                <div className="h-12 w-px bg-white/20"></div>
                <div className="text-center">
                  <div className="bg-white/20 backdrop-blur-md p-3 rounded-full mb-2 mx-auto w-fit">
                    <Sun className="w-6 h-6 text-yellow-300" />
                  </div>
                  <p className="text-2xl font-bold">{sensorData.uvIndex || "High"}</p>
                  <p className="text-xs opacity-80">UV Index</p>
                </div>
             </div>
           </div>
           <p className="text-xs text-muted-foreground mt-2 text-center">Data auto-synced via FarmIoT™ Smart Sensors</p>
        </div>

        {/* Professional Q&A Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
             <h3 className="font-bold text-lg">Buyer Questions (3)</h3>
             <span className="text-xs text-muted-foreground font-medium">All answered</span>
          </div>
          
          <div className="space-y-4">
             {/* Questions logic remains similar but could be tied to DB later */}
             <div className="border-b border-border/50 pb-4">
                <div className="flex items-start gap-2 mb-2">
                   <HelpCircle className="w-4 h-4 text-muted-foreground mt-0.5" />
                   <p className="text-sm font-semibold text-foreground">Is this suitable for commercial salad usage?</p>
                </div>
                <div className="flex items-start gap-2 pl-6">
                   <div className="min-w-[16px] mt-0.5">
                     <BadgeCheck className="w-4 h-4 text-primary" />
                   </div>
                   <div>
                     <p className="text-sm text-muted-foreground leading-relaxed">
                       Yes, these are Grade A salad tomatoes. Ideal for restaurants and hotels.
                     </p>
                   </div>
                </div>
             </div>
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
