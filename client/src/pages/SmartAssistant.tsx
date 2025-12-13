import { useState } from "react";
import { MISSIONS, TIPS_LEADERBOARD } from "@/lib/mockData";
import { Bot, Leaf, Trophy, ThumbsUp, ChevronRight, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import robotImage from "@assets/generated_images/robot_arm_holding_a_plant_sprout.png";
import badgeImage from "@assets/generated_images/gamified_farming_badge.png";

export default function SmartAssistant() {
  const [activeTab, setActiveTab] = useState<'ai' | 'missions' | 'tips'>('ai');

  return (
    <div className="h-full flex flex-col bg-muted/20">
      {/* Top Tabs */}
      <div className="bg-white p-2 flex gap-2 border-b border-border sticky top-0 z-10">
        <button 
          onClick={() => setActiveTab('ai')}
          className={cn(
            "flex-1 py-2 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-all",
            activeTab === 'ai' ? "bg-primary text-white shadow-md" : "text-muted-foreground hover:bg-muted"
          )}
        >
          <Bot className="w-4 h-4" /> AI Help
        </button>
        <button 
          onClick={() => setActiveTab('missions')}
          className={cn(
            "flex-1 py-2 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-all",
            activeTab === 'missions' ? "bg-primary text-white shadow-md" : "text-muted-foreground hover:bg-muted"
          )}
        >
          <Zap className="w-4 h-4" /> Missions
        </button>
        <button 
          onClick={() => setActiveTab('tips')}
          className={cn(
            "flex-1 py-2 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-all",
            activeTab === 'tips' ? "bg-primary text-white shadow-md" : "text-muted-foreground hover:bg-muted"
          )}
        >
          <Trophy className="w-4 h-4" /> Tips
        </button>
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

            <div className="space-y-3">
              <div className="bg-white p-3 rounded-xl rounded-tl-none border border-border shadow-sm max-w-[85%] self-start">
                <p className="text-sm">Namaste! How can I help you improve your harvest today?</p>
              </div>
              <div className="bg-primary text-white p-3 rounded-xl rounded-tr-none shadow-sm max-w-[85%] ml-auto">
                <p className="text-sm">What is the current market rate for Tomatoes in Kalimati?</p>
              </div>
               <div className="bg-white p-3 rounded-xl rounded-tl-none border border-border shadow-sm max-w-[85%] self-start">
                <p className="text-sm">Today's rate for Big Tomato in Kalimati is Rs 65/kg. It's trending upwards (+5%) from yesterday.</p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-2 mt-4">
              <button className="bg-white p-3 rounded-xl border border-border text-xs font-medium hover:bg-muted/50 text-left">
                🌧️ Check Weather
              </button>
              <button className="bg-white p-3 rounded-xl border border-border text-xs font-medium hover:bg-muted/50 text-left">
                🐛 Identify Pest
              </button>
              <button className="bg-white p-3 rounded-xl border border-border text-xs font-medium hover:bg-muted/50 text-left">
                💰 Price Forecast
              </button>
              <button className="bg-white p-3 rounded-xl border border-border text-xs font-medium hover:bg-muted/50 text-left">
                🌱 Soil Health
              </button>
            </div>
          </div>
        )}

        {activeTab === 'missions' && (
          <div className="space-y-4">
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
          <div className="space-y-4">
            <h3 className="font-bold text-lg">Community Leaderboard</h3>
            <div className="space-y-3">
              {TIPS_LEADERBOARD.map((item, index) => (
                <div key={item.id} className="bg-white p-4 rounded-xl border border-border shadow-sm flex gap-3">
                  <div className="font-bold text-lg text-muted-foreground w-6 flex-shrink-0 flex items-center justify-center">
                    {index + 1}
                  </div>
                  <img src={item.avatar} alt={item.farmer} className="w-10 h-10 rounded-full object-cover" />
                  <div className="flex-1">
                    <h4 className="font-bold text-sm">{item.farmer}</h4>
                    <p className="text-xs text-muted-foreground italic mt-1">"{item.tip}"</p>
                    <div className="flex items-center gap-1 mt-2 text-xs text-primary font-medium">
                      <ThumbsUp className="w-3 h-3" /> {item.likes} helpful votes
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <button className="w-full py-3 bg-white border border-dashed border-primary/50 text-primary rounded-xl font-medium text-sm flex items-center justify-center gap-2 hover:bg-primary/5">
              <Leaf className="w-4 h-4" /> Share your own tip
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
