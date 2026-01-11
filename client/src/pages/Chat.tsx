import { Search, Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/firebase";
import { collection, query, onSnapshot, orderBy, addDoc, serverTimestamp } from "firebase/firestore";
import { cn } from "@/lib/utils";

export default function Chat() {
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [chats, setChats] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Listen for all chats
    const q = query(collection(db, "chats"), orderBy("lastUpdated", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const chatList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setChats(chatList);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!activeChat) return;

    // Listen for messages in active chat
    const q = query(
      collection(db, "chats", activeChat, "messages"),
      orderBy("createdAt", "asc")
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMessages(msgList);
      setTimeout(() => {
        if (scrollRef.current) {
          scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
      }, 100);
    });
    return () => unsubscribe();
  }, [activeChat]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeChat) return;

    const msg = newMessage;
    setNewMessage("");

    try {
      await addDoc(collection(db, "chats", activeChat, "messages"), {
        text: msg,
        sender: "Ram Bahadur", // Default for now
        createdAt: serverTimestamp()
      });
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  if (activeChat) {
    const chat = chats.find(c => c.id === activeChat);
    return (
      <div className="flex flex-col h-full bg-white">
        <div className="p-3 border-b border-border flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-md z-10">
           <div className="flex items-center gap-3">
             <button onClick={() => setActiveChat(null)} className="text-muted-foreground hover:text-foreground">
               ←
             </button>
             <div className="relative">
                <img src={chat?.avatar || "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=200"} className="w-8 h-8 rounded-full" />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></span>
             </div>
             <div>
               <h3 className="font-bold text-sm">{chat?.name}</h3>
               <p className="text-[10px] text-green-600 font-medium">Online</p>
             </div>
           </div>
        </div>

        <div ref={scrollRef} className="flex-1 p-4 space-y-4 overflow-y-auto bg-muted/10">
          {messages.map((msg) => (
            <div key={msg.id} className={cn("flex", msg.sender === "Ram Bahadur" ? "justify-end" : "justify-start")}>
              <div className={cn(
                "p-3 rounded-2xl max-w-[80%] text-sm shadow-sm",
                msg.sender === "Ram Bahadur" 
                  ? "bg-primary text-white rounded-tr-none" 
                  : "bg-white border border-border text-foreground rounded-tl-none"
              )}>
                {msg.text}
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={handleSendMessage} className="p-3 border-t border-border bg-white flex items-center gap-2">
           <Input 
             placeholder="Type a message..." 
             className="rounded-full bg-muted/30 border-none" 
             value={newMessage}
             onChange={(e) => setNewMessage(e.target.value)}
           />
           <button type="submit" className="p-2 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors shadow-sm">
             <Send className="w-4 h-4" />
           </button>
        </form>
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
        {chats.map((chat) => (
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
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-baseline mb-1">
                <h3 className="font-semibold text-sm truncate">{chat.name}</h3>
              </div>
              <p className="text-sm text-muted-foreground truncate font-medium">{chat.lastMessage}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
