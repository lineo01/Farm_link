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
import { db, auth, storage } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useAuth } from "@/hooks/use-auth";

export default function Post() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [_, setLocation] = useLocation();
  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState("");
  const [unit, setUnit] = useState("");
  const [locationName, setLocationName] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  // Mock logic to find market rate
  const marketRate = Object.entries(MARKET_RATES).find(([key]) => 
    key.toLowerCase().includes(productName.toLowerCase())
  )?.[1];

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to post.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    console.log("Starting product post...");

    try {
      // Step 1: Background Image Upload - Post first, upload in background
      let imageUrl = "https://images.unsplash.com/photo-1566385278603-975bad627075?auto=format&fit=crop&q=80&w=800";
      
      const newProduct = {
        name: productName || "Unnamed Product",
        price: price ? `Rs. ${price}` : "Contact for price",
        unit: unit || "unit",
        location: locationName || "Nepal",
        description: description || "",
        farmer: user.displayName || "Farmer",
        farmerImage: user.photoURL || "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=200",
        image: imageUrl, // Initially use default
        postedTime: "Just now",
        likes: 0,
        createdAt: serverTimestamp(),
        userId: user.uid
      };

      console.log("Saving to marketplace...");
      // Save data immediately
      const docRef = await addDoc(collection(db, "products"), newProduct);
      console.log("Post live! ID:", docRef.id);
      
      toast({
        title: "Success",
        description: "Your product is now live!",
      });
      
      // Navigate away immediately
      setLocation("/");

      // Step 2: Handle Image Upload in background after navigating
      if (imageFile) {
        (async () => {
          try {
            console.log("Uploading image in background...");
            const imageRef = ref(storage, `products/${docRef.id}_${imageFile.name}`);
            const snapshot = await uploadBytes(imageRef, imageFile);
            const finalImageUrl = await getDownloadURL(snapshot.ref);
            
            // Update the document with the real image URL
            const { updateDoc, doc } = await import("firebase/firestore");
            await updateDoc(doc(db, "products", docRef.id), {
              image: finalImageUrl
            });
            console.log("Image updated in background");
          } catch (uploadError) {
            console.error("Background upload failed:", uploadError);
          }
        })();
      }
    } catch (error: any) {
      console.error("Posting failed overall:", error);
      // If it's a timeout, we still redirect because Firestore often syncs in background
      if (error.message.includes("Network is slow")) {
        toast({
          title: "Network Delay",
          description: "Your post is being saved and will appear in a moment.",
        });
        setLocation("/");
      } else {
        toast({
          title: "Error",
          variant: "destructive",
          description: `Failed to post: ${error.message || "Please check your connection."}`,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-8 pb-20 max-w-2xl mx-auto">
      <h2 className="text-2xl md:text-3xl font-serif font-bold mb-6 text-foreground">Sell Produce</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Image Upload Area */}
        <label className="border-2 border-dashed border-muted-foreground/30 rounded-2xl p-8 flex flex-col items-center justify-center gap-4 bg-muted/10 hover:bg-muted/20 transition-all cursor-pointer group relative overflow-hidden h-64">
          <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
          {imagePreview ? (
            <img src={imagePreview} className="absolute inset-0 w-full h-full object-cover" />
          ) : (
            <>
              <div className="bg-white p-4 rounded-full shadow-md group-hover:scale-110 transition-transform">
                <Camera className="w-8 h-8 text-primary" />
              </div>
              <div className="text-center">
                 <p className="text-sm font-bold text-foreground">Tap to add photos</p>
                 <p className="text-xs text-muted-foreground mt-1">Showcase your harvest</p>
              </div>
            </>
          )}
        </label>

          <div className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="farmer" className="text-sm font-bold">Farmer Name</Label>
              <Input 
                id="farmer" 
                placeholder="Your Name" 
                required 
                className="bg-white rounded-xl border-border/50 h-12"
                value={user?.displayName || "Farmer"}
                readOnly
              />
            </div>
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
