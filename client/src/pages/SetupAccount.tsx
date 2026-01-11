import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Camera, MapPin, CheckCircle2 } from "lucide-react";
import { db, storage } from "@/lib/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useLocation } from "wouter";

export default function SetupAccount() {
  const { user } = useAuth();
  const [_, setLocation] = useLocation();
  const [name, setName] = useState(user?.displayName || "");
  const [locationName, setLocationName] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(user?.photoURL || null);
  const [isSaving, setIsSaving] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsSaving(true);
    try {
      let photoURL = user.photoURL || "";
      if (imageFile) {
        const imageRef = ref(storage, `users/${user.uid}/profile`);
        await uploadBytes(imageRef, imageFile);
        photoURL = await getDownloadURL(imageRef);
      }

      await setDoc(doc(db, "users", user.uid), {
        displayName: name,
        photoURL,
        location: locationName,
        isSetupComplete: true,
        lastUpdated: serverTimestamp()
      }, { merge: true });

      setLocation("/");
    } catch (error) {
      console.error("Setup failed:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted/20 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-3xl shadow-2xl space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-serif font-bold text-foreground">Welcome Farmer!</h1>
          <p className="text-muted-foreground">Let's set up your profile for the community.</p>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          <div className="flex flex-col items-center gap-4">
            <label className="relative w-24 h-24 rounded-full bg-muted border-2 border-dashed border-primary/30 flex items-center justify-center cursor-pointer overflow-hidden group">
              <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
              {imagePreview ? (
                <img src={imagePreview} className="w-full h-full object-cover" />
              ) : (
                <Camera className="w-8 h-8 text-primary/50 group-hover:scale-110 transition-transform" />
              )}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <span className="text-[10px] text-white font-bold">Change</span>
              </div>
            </label>
            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Profile Photo</p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm font-bold">Your Full Name</Label>
              <Input 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                placeholder="e.g. Ram Bahadur" 
                required
                className="h-12 rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-bold">Primary Farm Location</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
                <Input 
                  value={locationName} 
                  onChange={(e) => setLocationName(e.target.value)} 
                  placeholder="e.g. Panchkhal, Kavre" 
                  required
                  className="pl-10 h-12 rounded-xl"
                />
              </div>
            </div>
          </div>

          <Button 
            disabled={isSaving}
            className="w-full h-14 rounded-xl text-base font-bold shadow-xl shadow-primary/20"
          >
            {isSaving ? "Saving..." : "Start Using Krishi Bajar"}
          </Button>
        </form>
      </div>
    </div>
  );
}
