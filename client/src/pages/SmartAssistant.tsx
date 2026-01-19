import { useState, useEffect } from "react";
import { Bot, Leaf, Trophy, ThumbsUp, ChevronRight, Zap, Activity, Send, Share2, Plus, ShoppingBag, Hammer, Sprout as SproutIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import robotImage from "@assets/generated_images/robot_arm_holding_a_plant_sprout.png";
import badgeImage from "@assets/generated_images/gamified_farming_badge.png";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { db } from "@/lib/firebase";
import { collection, query, onSnapshot, orderBy, addDoc, serverTimestamp, updateDoc, doc, increment, getDocs, where, deleteDoc } from "firebase/firestore";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

// Mock IoT Data for Graph
const SOIL_DATA = [
  { name: 'Mon', moisture: 40, temp: 24 },
  { name: 'Tue', moisture: 30, temp: 25 },
  { name: 'Wed', moisture: 60, temp: 22 }, // Rain
  { name: 'Thu', moisture: 55, temp: 23 },
  { name: 'Fri', moisture: 50, temp: 24 },
  { name: 'Sat', moisture: 45, temp: 26 },
  { name: 'Sun', moisture: 42, temp: 25 },
];

export default function SmartAssistant() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'ai' | 'missions' | 'tips' | 'iot' | 'rewards'>('ai');
  const [tips, setTips] = useState<any[]>([]);
  const [newTip, setNewTip] = useState("");
  const [missions, setMissions] = useState<any[]>([]);
  const [isAddingMission, setIsAddingMission] = useState(false);
  const [userTokens, setUserTokens] = useState(1500); // Mock tokens (linked to XP)
  
  const isAdmin = user?.email === 'admin@krishibajar.com' || user?.uid === 'admin-uid'; // Simplified admin check

  useEffect(() => {
    const qTips = query(collection(db, "community_tips"), orderBy("createdAt", "desc"));
    const unsubTips = onSnapshot(qTips, (snapshot) => {
      setTips(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    const qMissions = query(collection(db, "missions"), orderBy("createdAt", "desc"));
    const unsubMissions = onSnapshot(qMissions, (snapshot) => {
      setMissions(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => {
      unsubTips();
      unsubMissions();
    };
  }, []);

  const handleAddMission = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    try {
      await addDoc(collection(db, "missions"), {
        title: formData.get("title"),
        description: formData.get("description"),
        xp: parseInt(formData.get("xp") as string),
        tokens: parseInt(formData.get("xp") as string), // Tokens equal to XP
        createdAt: serverTimestamp(),
        progress: 0,
        status: 'pending'
      });
      setIsAddingMission(false);
      toast({ title: "Mission Added", description: "New task is now available for all farmers." });
    } catch (error) {
      toast({ title: "Error", description: "Failed to add mission", variant: "destructive" });
    }
  };

  const handleDeleteMission = async (id: string) => {
    try {
      await deleteDoc(doc(db, "missions", id));
      toast({ title: "Mission Deleted" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete mission", variant: "destructive" });
    }
  };

  const handleExchange = (item: string, cost: number) => {
    if (userTokens >= cost) {
      setUserTokens(prev => prev - cost);
      toast({ 
        title: "Exchange Successful!", 
        description: `You have exchanged ${cost} tokens for ${item}. Check your inventory.` 
      });
    } else {
      toast({ 
        title: "Insufficient Tokens", 
        description: "Complete more missions to earn tokens!", 
        variant: "destructive" 
      });
    }
  };

  const handleShareTip = async () => {
    if (!newTip.trim() || !user) return;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const q = query(collection(db, "community_tips"), where("userId", "==", user.uid));
    const snapshot = await getDocs(q);
    const hasTipToday = snapshot.docs.some(doc => {
      const data = doc.data();
      const createdAt = data.createdAt?.toDate();
      return createdAt && createdAt >= today;
    });

    if (hasTipToday) {
      toast({
        title: "Limit Reached",
        description: "You can only share one expert tip per day. Keep farming!",
        variant: "destructive"
      });
      return;
    }

    try {
      await addDoc(collection(db, "community_tips"), {
        tip: newTip,
        farmer: user.displayName || "Farmer",
        avatar: user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}`,
        userId: user.uid,
        likes: 0,
        createdAt: serverTimestamp(),
      });
      setNewTip("");
      toast({ title: "Tip Shared!", description: "Your farming wisdom is now live." });
    } catch (error) {
      console.error("Error sharing tip:", error);
    }
  };

  const handleLikeTip = async (tipId: string) => {
    try {
      const tipRef = doc(db, "community_tips", tipId);
      await updateDoc(tipRef, { likes: increment(1) });
    } catch (error) {
      console.error("Error liking tip:", error);
    }
  };

  return (
    <div className="h-full flex flex-col bg-muted/20">
      <div className="bg-white p-2 border-b border-border sticky top-0 z-10 overflow-x-auto no-scrollbar">
        <div className="flex gap-2 min-w-max">
          <button 
            onClick={() => setActiveTab('ai')}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-all",
              activeTab === 'ai' ? "bg-primary text-white shadow-md" : "text-muted-foreground hover:bg-muted"
            )}
          >
            <Bot className="w-4 h-4" /> AI Help
          </button>
          <button 
            onClick={() => setActiveTab('iot')}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-all",
              activeTab === 'iot' ? "bg-primary text-white shadow-md" : "text-muted-foreground hover:bg-muted"
            )}
          >
            <Activity className="w-4 h-4" /> Farm IoT
          </button>
          <button 
            onClick={() => setActiveTab('missions')}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-all",
              activeTab === 'missions' ? "bg-primary text-white shadow-md" : "text-muted-foreground hover:bg-muted"
            )}
          >
            <Zap className="w-4 h-4" /> Missions
          </button>
          <button 
            onClick={() => setActiveTab('rewards')}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-all",
              activeTab === 'rewards' ? "bg-primary text-white shadow-md" : "text-muted-foreground hover:bg-muted"
            )}
          >
            <ShoppingBag className="w-4 h-4" /> Rewards
          </button>
          <button 
            onClick={() => setActiveTab('tips')}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-all",
              activeTab === 'tips' ? "bg-primary text-white shadow-md" : "text-muted-foreground hover:bg-muted"
            )}
          >
            <Trophy className="w-4 h-4" /> Tips
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 pb-24">
        {activeTab === 'ai' && (
          <div className="space-y-4">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-border/50 text-center space-y-4">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <img src={robotImage} alt="AI Bot" className="w-12 h-12 object-contain" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-lg">Krishi Sahayak AI</h3>
                <p className="text-sm text-muted-foreground">Ask me anything about pests, weather, or market rates.</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'iot' && (
           <div className="space-y-4">
              <div className="bg-white p-5 rounded-2xl border border-border shadow-sm">
                 <div className="flex justify-between items-center mb-6">
                    <div>
                      <h3 className="font-bold text-lg">Soil Moisture</h3>
                      <p className="text-xs text-muted-foreground">Weekly analysis</p>
                    </div>
                    <div className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">Optimal</div>
                 </div>
                 <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={SOIL_DATA}>
                        <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis hide />
                        <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                        <Bar dataKey="moisture" radius={[4, 4, 0, 0]}>
                          {SOIL_DATA.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.moisture < 40 ? '#fbbf24' : '#3b82f6'} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                 </div>
              </div>
           </div>
        )}

        {activeTab === 'missions' && (
           <div className="space-y-4">
            <div className="bg-gradient-to-r from-primary to-emerald-600 rounded-2xl p-4 text-white flex items-center justify-between shadow-lg">
              <div>
                <p className="text-xs font-medium opacity-90">Tokens Earned</p>
                <h2 className="text-3xl font-bold font-serif">{userTokens.toLocaleString()}</h2>
                <p className="text-xs mt-1 bg-white/20 inline-block px-2 py-0.5 rounded-full">Farmer Dashboard</p>
              </div>
              <img src={badgeImage} alt="Badge" className="w-16 h-16 object-contain drop-shadow-md" />
            </div>

            <div className="flex justify-between items-center mt-6">
              <h3 className="font-bold text-lg">Active Missions</h3>
              {isAdmin && (
                <Dialog open={isAddingMission} onOpenChange={setIsAddingMission}>
                  <DialogTrigger asChild>
                    <Button size="sm" className="gap-2 rounded-full">
                      <Plus className="w-4 h-4" /> Add Task
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create New Mission</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleAddMission} className="space-y-4 mt-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Title</label>
                        <Input name="title" placeholder="e.g. Harvest 50kg Organic Potatoes" required />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Description</label>
                        <Input name="description" placeholder="Short detail about the task..." required />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">XP / Token Reward</label>
                        <Input name="xp" type="number" placeholder="500" required />
                      </div>
                      <Button type="submit" className="w-full">Publish Mission</Button>
                    </form>
                  </DialogContent>
                </Dialog>
              )}
            </div>

            <div className="space-y-3">
              {missions.map((mission) => (
                <div key={mission.id} className="bg-white p-4 rounded-xl border border-border shadow-sm">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-bold text-sm">{mission.title}</h4>
                      <p className="text-xs text-muted-foreground">{mission.description}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded-full">+{mission.xp} Tokens</span>
                      {isAdmin && (
                        <button onClick={() => handleDeleteMission(mission.id)} className="text-[10px] text-destructive hover:underline">Remove</button>
                      )}
                    </div>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2 mt-3 overflow-hidden">
                    <div className="bg-primary h-full rounded-full transition-all" style={{ width: `${mission.progress || 0}%` }} />
                  </div>
                </div>
              ))}
              {missions.length === 0 && (
                <div className="text-center py-10 text-muted-foreground border-2 border-dashed rounded-xl">
                  <p className="text-sm">No active missions available.</p>
                </div>
              )}
            </div>
           </div>
        )}

        {activeTab === 'rewards' && (
          <div className="space-y-6">
            <div className="bg-primary/5 p-4 rounded-2xl border border-primary/10 flex items-center justify-between">
              <div>
                <p className="text-xs text-primary font-bold uppercase tracking-wider">Available Balance</p>
                <h3 className="text-2xl font-bold">{userTokens} Tokens</h3>
              </div>
              <ShoppingBag className="w-8 h-8 text-primary/40" />
            </div>

            <h3 className="font-bold text-lg">Exchange Store</h3>
            <div className="grid grid-cols-2 gap-4">
              {[
                { name: "Premium Seeds", cost: 500, icon: <SproutIcon className="w-5 h-5" />, color: "bg-green-100 text-green-700" },
                { name: "Organic Fertilizer", cost: 800, icon: <Leaf className="w-5 h-5" />, color: "bg-emerald-100 text-emerald-700" },
                { name: "Hand Trowel", cost: 1200, icon: <Hammer className="w-5 h-5" />, color: "bg-blue-100 text-blue-700" },
                { name: "NPK Starter Pack", cost: 1500, icon: <Zap className="w-5 h-5" />, color: "bg-amber-100 text-amber-700" },
              ].map((item) => (
                <div key={item.name} className="bg-white p-4 rounded-2xl border border-border shadow-sm flex flex-col justify-between h-40">
                  <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center mb-3", item.color)}>
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">{item.name}</h4>
                    <p className="text-xs text-primary font-bold">{item.cost} Tokens</p>
                  </div>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="mt-3 rounded-xl text-[10px] h-8"
                    onClick={() => handleExchange(item.name, item.cost)}
                  >
                    Exchange
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'tips' && (
           <div className="space-y-4">
            <div className="bg-white p-4 rounded-2xl border border-border shadow-sm space-y-3">
              <h3 className="font-bold text-sm">Share Daily Expert Tip</h3>
              <div className="flex gap-2">
                <Input placeholder="e.g., Best way to handle potato blight..." value={newTip} onChange={(e) => setNewTip(e.target.value)} className="rounded-xl bg-muted/30 border-none" />
                <Button size="icon" className="rounded-xl shrink-0" onClick={handleShareTip}>
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-[10px] text-muted-foreground italic">Rule: One expert tip per day to ensure high quality.</p>
            </div>

            <h3 className="font-bold text-lg">Live Community Wisdom</h3>
            <div className="space-y-3">
              {tips.map((item, index) => (
                <div key={item.id} className="bg-white p-4 rounded-xl border border-border shadow-sm flex gap-3">
                  <div className="font-bold text-lg text-muted-foreground w-6 flex-shrink-0 flex items-center justify-center">{index + 1}</div>
                  <img src={item.avatar} alt={item.farmer} className="w-10 h-10 rounded-full object-cover" />
                  <div className="flex-1">
                    <h4 className="font-bold text-sm">{item.farmer}</h4>
                    <p className="text-xs text-muted-foreground italic mt-1">"{item.tip}"</p>
                    <div className="flex items-center gap-4 mt-3">
                      <button onClick={() => handleLikeTip(item.id)} className="flex items-center gap-1 text-xs text-primary font-bold hover:scale-105 transition-transform">
                        <ThumbsUp className="w-3 h-3" /> {item.likes} Helpful
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
