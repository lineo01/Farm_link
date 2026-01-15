import { useState, useEffect } from "react";
import { MISSIONS } from "@/lib/mockData";
import { Bot, Leaf, Trophy, ThumbsUp, ChevronRight, Zap, Activity, Send, Share2 } from "lucide-react";
import { cn } from "@/lib/utils";
import robotImage from "@assets/generated_images/robot_arm_holding_a_plant_sprout.png";
import badgeImage from "@assets/generated_images/gamified_farming_badge.png";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { db } from "@/lib/firebase";
import { collection, query, onSnapshot, orderBy, addDoc, serverTimestamp, updateDoc, doc, increment, getDocs, where } from "firebase/firestore";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";

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
  const [activeTab, setActiveTab] = useState<'ai' | 'missions' | 'tips' | 'iot'>('ai');
  const [tips, setTips] = useState<any[]>([]);
  const [newTip, setNewTip] = useState("");

  useEffect(() => {
    const q = query(collection(db, "community_tips"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const tipsList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setTips(tipsList);
    });
    return () => unsubscribe();
  }, []);

  const handleShareTip = async () => {
    if (!newTip.trim() || !user) return;

    // Check one tip per day rule
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const q = query(
      collection(db, "community_tips"),
      where("userId", "==", user.uid),
      where("createdAt", ">=", today)
    );
    
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
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
      {/* Top Tabs - Scrollable */}
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

      <div className="flex-1 overflow-y-auto p-4">
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
            {/* ... rest of AI chat UI ... */}
            <div className="space-y-3">
              <div className="bg-white p-3 rounded-xl rounded-tl-none border border-border shadow-sm max-w-[85%] self-start">
                <p className="text-sm">Namaste! How can I help you improve your harvest today?</p>
              </div>
              {/* Added example conversation */}
            </div>
          </div>
        )}

        {activeTab === 'iot' && (
           <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
              <div className="bg-white p-5 rounded-2xl border border-border shadow-sm">
                 <div className="flex justify-between items-center mb-6">
                    <div>
                      <h3 className="font-bold text-lg">Soil Moisture</h3>
                      <p className="text-xs text-muted-foreground">Weekly analysis</p>
                    </div>
                    <div className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">
                      Optimal
                    </div>
                 </div>
                 
                 <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={SOIL_DATA}>
                        <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis hide />
                        <Tooltip 
                          cursor={{fill: 'transparent'}}
                          contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                        />
                        <Bar dataKey="moisture" radius={[4, 4, 0, 0]}>
                          {SOIL_DATA.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.moisture < 40 ? '#fbbf24' : '#3b82f6'} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                 </div>
                 
                 <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground justify-center">
                    <div className="flex items-center gap-1">
                       <div className="w-3 h-3 bg-blue-500 rounded-sm"></div> Good
                    </div>
                    <div className="flex items-center gap-1">
                       <div className="w-3 h-3 bg-amber-400 rounded-sm"></div> Low
                    </div>
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                 <div className="bg-white p-4 rounded-xl border border-border shadow-sm">
                    <p className="text-xs text-muted-foreground mb-1">Avg Temperature</p>
                    <p className="text-2xl font-bold">24°C</p>
                    <div className="mt-2 h-1.5 w-full bg-muted rounded-full overflow-hidden">
                       <div className="h-full bg-orange-400 w-[60%]"></div>
                    </div>
                 </div>
                 <div className="bg-white p-4 rounded-xl border border-border shadow-sm">
                    <p className="text-xs text-muted-foreground mb-1">Nitrogen Level</p>
                    <p className="text-2xl font-bold">Good</p>
                    <div className="mt-2 h-1.5 w-full bg-muted rounded-full overflow-hidden">
                       <div className="h-full bg-green-500 w-[80%]"></div>
                    </div>
                 </div>
              </div>
           </div>
        )}

        {/* ... existing tabs ... */}
        {activeTab === 'missions' && (
           // Existing missions code wrapper
           <div className="space-y-4">
             {/* ... */}
             <div className="bg-gradient-to-r from-primary to-emerald-600 rounded-2xl p-4 text-white flex items-center justify-between shadow-lg">
              <div>
                <p className="text-xs font-medium opacity-90">Total XP</p>
                <h2 className="text-3xl font-bold font-serif">1,500</h2>
                <p className="text-xs mt-1 bg-white/20 inline-block px-2 py-0.5 rounded-full">Level 5: Green Guardian</p>
              </div>
              <img src={badgeImage} alt="Badge" className="w-16 h-16 object-contain drop-shadow-md" />
            </div>

            <h3 className="font-bold text-lg mt-2">Active Missions</h3>
            <div className="space-y-3">
              {MISSIONS.map((mission) => (
                <div key={mission.id} className="bg-white p-4 rounded-xl border border-border shadow-sm">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-sm">{mission.title}</h4>
                    <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded-full">+{mission.xp} XP</span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3">{mission.description}</p>
                  
                  <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                    <div 
                      className="bg-primary h-full rounded-full transition-all" 
                      style={{ width: `${mission.progress}%` }}
                    />
                  </div>
                  <div className="flex justify-between mt-1 text-[10px] text-muted-foreground">
                    <span>{mission.progress}% Complete</span>
                    <span>{mission.status === 'completed' ? 'Claimed' : 'In Progress'}</span>
                  </div>
                </div>
              ))}
            </div>
           </div>
        )}
        
        {activeTab === 'tips' && (
           <div className="space-y-4 pb-20">
            <div className="bg-white p-4 rounded-2xl border border-border shadow-sm space-y-3">
              <h3 className="font-bold text-sm">Share Daily Expert Tip</h3>
              <div className="flex gap-2">
                <Input 
                  placeholder="e.g., Best way to handle potato blight..." 
                  value={newTip}
                  onChange={(e) => setNewTip(e.target.value)}
                  className="rounded-xl bg-muted/30 border-none"
                />
                <Button size="icon" className="rounded-xl shrink-0" onClick={handleShareTip}>
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-[10px] text-muted-foreground italic">Rule: One expert tip per day to ensure high quality.</p>
            </div>

            <h3 className="font-bold text-lg">Live Community Wisdom</h3>
            <div className="space-y-3">
              {tips.map((item, index) => (
                <div key={item.id} className="bg-white p-4 rounded-xl border border-border shadow-sm flex gap-3 animate-in fade-in slide-in-from-bottom-2">
                  <div className="font-bold text-lg text-muted-foreground w-6 flex-shrink-0 flex items-center justify-center">
                    {index + 1}
                  </div>
                  <img src={item.avatar} alt={item.farmer} className="w-10 h-10 rounded-full object-cover" />
                  <div className="flex-1">
                    <h4 className="font-bold text-sm">{item.farmer}</h4>
                    <p className="text-xs text-muted-foreground italic mt-1">"{item.tip}"</p>
                    <div className="flex items-center gap-4 mt-3">
                      <button 
                        onClick={() => handleLikeTip(item.id)}
                        className="flex items-center gap-1 text-xs text-primary font-bold hover:scale-105 transition-transform"
                      >
                        <ThumbsUp className="w-3 h-3" /> {item.likes} Helpful
                      </button>
                      <button className="flex items-center gap-1 text-xs text-muted-foreground font-medium hover:text-foreground">
                        <Share2 className="w-3 h-3" /> Share
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {tips.length === 0 && (
                <div className="text-center py-10 text-muted-foreground">
                  <Leaf className="w-8 h-8 mx-auto mb-2 opacity-20" />
                  <p className="text-sm">No tips shared today. Be the first!</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
