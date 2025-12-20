import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Camera, MapPin, TrendingUp, Info, Upload } from "lucide-react";
import { useLocation } from "wouter";
import { useState, useRef } from "react";
import { cn } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";

export default function Post() {
  const { toast } = useToast();
  const [_, setLocation] = useLocation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    unit: "kg",
    location: "Kathmandu",
    description: "",
    image: "",
  });
  const [imageName, setImageName] = useState("");

  // Submit mutation
  const { mutate: submitProduct, isPending } = useMutation({
    mutationFn: async (data: typeof formData) => {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          ...data,
          userId: "default", // Will be replaced by server with authenticated user
        }),
      });
      if (!res.ok) throw new Error("Failed to post product");
      return res.json();
    },
    onSuccess: () => {
      // Invalidate products query to refetch
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      
      toast({
        title: "Success!",
        description: "Your product has been posted to the marketplace.",
      });
      setLocation("/");
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to post product",
        variant: "destructive",
      });
    },
  });

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData(prev => ({
          ...prev,
          image: event.target?.result as string, // Base64 encoded image
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.location) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    submitProduct(formData);
  };

  return (
    <div className="p-4 pb-20">
      <h2 className="text-2xl font-serif font-bold mb-6 text-foreground">Sell Produce</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Image Upload Area */}
        <input 
          ref={fileInputRef}
          type="file" 
          accept="image/*" 
          onChange={handleImageSelect}
          className="hidden"
          data-testid="input-image"
        />
        
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-muted-foreground/30 rounded-2xl p-8 flex flex-col items-center justify-center gap-4 bg-muted/10 hover:bg-muted/20 transition-all cursor-pointer group"
          data-testid="button-upload-image"
        >
          <div className="bg-white p-4 rounded-full shadow-md group-hover:scale-110 transition-transform">
            <Camera className="w-8 h-8 text-primary" />
          </div>
          <div className="text-center">
             <p className="text-sm font-bold text-foreground">
               {imageName || "Tap to add photos"}
             </p>
             <p className="text-xs text-muted-foreground mt-1">
               {imageName ? `Selected: ${imageName}` : "Showcase your harvest"}
             </p>
          </div>
          {formData.image && (
            <div className="w-32 h-32 rounded-lg overflow-hidden mt-4 border-2 border-primary">
              <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
            </div>
          )}
        </div>

        <div className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-bold">Product Name *</Label>
            <Input 
              id="name" 
              placeholder="e.g. Organic Red Tomatoes" 
              required 
              className="bg-white rounded-xl border-border/50 h-12"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              data-testid="input-name"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price" className="text-sm font-bold">Price (Rs.) *</Label>
              <Input 
                id="price" 
                placeholder="00" 
                required 
                className="bg-white rounded-xl border-border/50 h-12"
                value={formData.price}
                onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                data-testid="input-price"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="unit" className="text-sm font-bold">Unit</Label>
              <Input 
                id="unit" 
                placeholder="per kg" 
                className="bg-white rounded-xl border-border/50 h-12"
                value={formData.unit}
                onChange={(e) => setFormData(prev => ({ ...prev, unit: e.target.value }))}
                data-testid="input-unit"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location" className="text-sm font-bold">Farm Location *</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
              <Input 
                id="location" 
                placeholder="Select location" 
                className="pl-10 bg-white rounded-xl border-border/50 h-12"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                data-testid="input-location"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-bold">Description & Methods</Label>
            <Textarea 
              id="description" 
              placeholder="Tell buyers about your farming methods (e.g., Organic, Greenhouse)..." 
              className="bg-white min-h-[120px] rounded-xl border-border/50 resize-none p-4"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              data-testid="textarea-description"
            />
          </div>
        </div>

        <Button 
          type="submit" 
          size="lg" 
          className="w-full h-14 text-base font-bold shadow-xl shadow-primary/20 rounded-xl"
          disabled={isPending}
          data-testid="button-submit-post"
        >
          {isPending ? "Posting..." : "Post to Marketplace"}
        </Button>
      </form>
    </div>
  );
}
