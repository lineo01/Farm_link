import { CHATS } from "@/lib/mockData";
import { Search, MoreVertical, Phone, Video, CreditCard, Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function Chat() {
  const [activeChat, setActiveChat] = useState<number | null>(null);

  if (activeChat) {
    return (
      <div className="flex flex-col h-full bg-white">
        <div className="p-3 border-b border-border flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-md z-10">
           <div className="flex items-center gap-3">
             <button onClick={() => setActiveChat(null)} className="text-muted-foreground hover:text-foreground">
               ←
             </button>
             <div className="relative">
                <img src={CHATS[0].avatar} className="w-8 h-8 rounded-full" />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></span>
             </div>
             <div>
               <h3 className="font-bold text-sm">{CHATS[0].name}</h3>
               <p className="text-[10px] text-green-600 font-medium">Online</p>
             </div>
           </div>
           <div className="flex items-center gap-3 text-primary">
             <Phone className="w-5 h-5" />
             <Video className="w-5 h-5" />
           </div>
        </div>

        <div className="flex-1 p-4 space-y-4 overflow-y-auto bg-muted/10">
           <div className="flex justify-center">
             <span className="text-[10px] bg-muted text-muted-foreground px-2 py-1 rounded-full">Today</span>
           </div>
           
           <div className="flex justify-end">
             <div className="bg-primary text-white p-3 rounded-2xl rounded-tr-none max-w-[80%] text-sm shadow-sm">
               Hi! Is the 50kg lot still available?
             </div>
           </div>

           <div className="flex justify-start">
             <div className="bg-white border border-border text-foreground p-3 rounded-2xl rounded-tl-none max-w-[80%] text-sm shadow-sm">
               Yes, Ram! I can have the truck pick it up by 2 PM.
             </div>
           </div>

           {/* Payment Request Bubble */}
           <div className="flex justify-start w-full">
              <div className="bg-white border border-border p-3 rounded-2xl rounded-tl-none max-w-[85%] shadow-sm space-y-2">
                 <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    <CreditCard className="w-3 h-3" /> Payment Request
                 </div>
                 <div className="text-xl font-bold">Rs. 15,000</div>
                 <p className="text-xs text-muted-foreground">For 250kg Tomatoes</p>
                 <div className="grid grid-cols-2 gap-2 mt-2">
                    <button className="bg-green-600 text-white py-2 rounded-lg text-xs font-bold hover:bg-green-700">eSewa</button>
                    <button className="bg-purple-600 text-white py-2 rounded-lg text-xs font-bold hover:bg-purple-700">Khalti</button>
                 </div>
              </div>
           </div>
        </div>

        <div className="p-3 border-t border-border bg-white flex items-center gap-2">
           <button className="p-2 text-muted-foreground hover:bg-muted rounded-full transition-colors">
             <CreditCard className="w-5 h-5" />
           </button>
           <Input placeholder="Type a message..." className="rounded-full bg-muted/30 border-none" />
           <button className="p-2 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors shadow-sm">
             <Send className="w-4 h-4" />
           </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 pb-2">
        <h2 className="text-2xl font-serif font-bold mb-4">Messages</h2>
        <div className="relative mb-4">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search messages..." className="pl-9 bg-muted/30 border-none rounded-xl" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {CHATS.map((chat) => (
          <div 
            key={chat.id}
            onClick={() => setActiveChat(chat.id)}
            className="flex items-center gap-4 p-4 border-b border-border/40 hover:bg-muted/30 transition-colors cursor-pointer"
          >
            <div className="relative">
              <img 
                src={chat.avatar} 
                alt={chat.name} 
                className="w-12 h-12 rounded-full object-cover"
              />
              {chat.unread > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
                  {chat.unread}
                </span>
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-baseline mb-1">
                <h3 className="font-semibold text-sm truncate">{chat.name}</h3>
                <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">{chat.time}</span>
              </div>
              <p className="text-sm text-muted-foreground truncate font-medium">{chat.lastMessage}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
