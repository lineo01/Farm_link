import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Camera, MapPin, Upload } from "lucide-react";
import { useLocation } from "wouter";

export default function Post() {
  const { toast } = useToast();
  const [_, setLocation] = useLocation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Success",
      description: "Your product has been posted to the marketplace.",
    });
    setLocation("/");
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-serif font-bold mb-6 text-foreground">Sell Produce</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Image Upload Area */}
        <div className="border-2 border-dashed border-muted-foreground/30 rounded-xl p-8 flex flex-col items-center justify-center gap-3 bg-muted/10 hover:bg-muted/20 transition-colors cursor-pointer">
          <div className="bg-white p-3 rounded-full shadow-sm">
            <Camera className="w-6 h-6 text-primary" />
          </div>
          <p className="text-sm text-muted-foreground font-medium">Take a photo or upload</p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Product Name</Label>
            <Input id="name" placeholder="e.g. Fresh Tomatoes" required className="bg-white" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price</Label>
              <Input id="price" placeholder="Rs. 00" required className="bg-white" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="unit">Unit</Label>
              <Input id="unit" placeholder="per kg" required className="bg-white" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Farm Location</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input id="location" placeholder="Select location" className="pl-9 bg-white" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea 
              id="description" 
              placeholder="Describe your produce (freshness, type, etc.)" 
              className="bg-white min-h-[100px]"
            />
          </div>
        </div>

        <Button type="submit" size="lg" className="w-full text-base font-semibold shadow-lg shadow-primary/20">
          Post to Marketplace
        </Button>
      </form>
    </div>
  );
}
