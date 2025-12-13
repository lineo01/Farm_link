import { CHATS } from "@/lib/mockData";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function Chat() {
  return (
    <div className="flex flex-col h-full">
      <div className="p-4 pb-2">
        <h2 className="text-2xl font-serif font-bold mb-4">Messages</h2>
        <div className="relative mb-4">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search messages..." className="pl-9 bg-muted/30 border-none" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {CHATS.map((chat) => (
          <div 
            key={chat.id}
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
              <p className="text-sm text-muted-foreground truncate">{chat.lastMessage}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
