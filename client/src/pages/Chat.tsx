import { Search, Send, Users, MessageCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/firebase";
import { collection, query, onSnapshot, orderBy, addDoc, serverTimestamp, where } from "firebase/firestore";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";

export default function Chat() {
  const { user } = useAuth();
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [chats, setChats] = useState<any[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [showUsersList, setShowUsersList] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Listen for online users
    const q = query(collection(db, "users"), where("isOnline", "==", true));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const userList = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(u => u.id !== user?.uid);
      setOnlineUsers(userList);
    });
    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    if (!user) return;
    // Listen for all chats involving the user
    const q = query(collection(db, "chats"), orderBy("lastUpdated", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const chatList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setChats(chatList);
    });
    return () => unsubscribe();
  }, [user]);

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
    if (!newMessage.trim() || !activeChat || !user) return;

    const msg = newMessage;
    setNewMessage("");

    try {
      await addDoc(collection(db, "chats", activeChat, "messages"), {
        text: msg,
        sender: user.displayName || "Farmer",
        senderId: user.uid,
        createdAt: serverTimestamp()
      });
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const startChat = async (targetUser: any) => {
    // Simple chat starter logic
    setActiveChat("main_community_chat"); // Simplified for now
    setShowUsersList(false);
  };

  return (
    <div className="flex h-full bg-muted/10 overflow-hidden">
      {/* Users Sidebar */}
      <div className={cn(
        "w-full md:w-80 bg-white border-r border-border flex flex-col transition-all",
        activeChat ? "hidden md:flex" : "flex"
      )}>
        <div className="p-4 border-b border-border flex justify-between items-center bg-white sticky top-0 z-10">
          <h2 className="text-xl font-serif font-bold">Active Farmers</h2>
          <Users className="w-5 h-5 text-primary" />
        </div>
        
        <div className="flex-1 overflow-y-auto p-2 space-y-2">
          {onlineUsers.length === 0 ? (
            <div className="p-8 text-center space-y-2">
              <div className="bg-muted w-12 h-12 rounded-full flex items-center justify-center mx-auto">
                <Users className="w-6 h-6 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">No other farmers online right now</p>
            </div>
          ) : (
            onlineUsers.map((u) => (
              <div 
                key={u.id}
                onClick={() => startChat(u)}
                className="flex items-center gap-3 p-3 rounded-2xl hover:bg-muted cursor-pointer transition-colors border border-transparent hover:border-border"
              >
                <div className="relative">
                  <img src={u.photoURL || "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=200"} className="w-10 h-10 rounded-full object-cover" />
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm truncate">{u.displayName}</p>
                  <p className="text-[10px] text-green-600 font-medium uppercase tracking-wider">Online Now</p>
                </div>
              </div>
            ))
          )}
          
          <div className="mt-8 px-4">
            <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-4">Recent Conversations</h3>
            <div className="bg-primary/5 rounded-2xl p-4 border border-primary/10 text-center cursor-pointer hover:bg-primary/10 transition-all" onClick={() => setActiveChat("main_community_chat")}>
              <p className="font-bold text-primary text-sm">Main Community Chat</p>
              <p className="text-[10px] text-primary/60 mt-1">Talk to all farmers</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className={cn(
        "flex-1 flex flex-col bg-white transition-all",
        !activeChat ? "hidden md:flex" : "flex"
      )}>
        {activeChat ? (
          <>
            <div className="p-3 border-b border-border flex items-center gap-3 sticky top-0 bg-white/80 backdrop-blur-md z-10">
              <button onClick={() => setActiveChat(null)} className="md:hidden text-muted-foreground hover:text-foreground p-2">
                ←
              </button>
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Users className="w-4 h-4 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-sm">Community Chat</h3>
                <p className="text-[10px] text-muted-foreground">Global channel for all farmers</p>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 bg-green-50 rounded-full border border-green-100">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-[10px] font-bold text-green-700">{onlineUsers.length + (user ? 1 : 0)} Online</span>
              </div>
            </div>

            <div ref={scrollRef} className="flex-1 p-4 space-y-4 overflow-y-auto bg-muted/10 no-scrollbar">
              {messages.map((msg) => (
                <div key={msg.id} className={cn("flex flex-col", msg.senderId === user?.uid ? "items-end" : "items-start")}>
                  {msg.senderId !== user?.uid && (
                    <span className="text-[10px] text-muted-foreground font-bold mb-1 ml-1">{msg.sender}</span>
                  )}
                  <div className={cn(
                    "p-3 rounded-2xl max-w-[80%] text-sm shadow-sm",
                    msg.senderId === user?.uid 
                      ? "bg-primary text-white rounded-tr-none" 
                      : "bg-white border border-border text-foreground rounded-tl-none"
                  )}>
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={handleSendMessage} className="p-4 border-t border-border bg-white flex items-center gap-2">
              <Input 
                placeholder="Message the community..." 
                className="rounded-xl bg-muted/30 border-none h-12" 
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
              <button type="submit" className="p-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20">
                <Send className="w-5 h-5" />
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4">
            <div className="bg-primary/10 w-24 h-24 rounded-3xl flex items-center justify-center animate-pulse">
              <MessageCircle className="w-12 h-12 text-primary" />
            </div>
            <div className="max-w-xs">
              <h3 className="text-xl font-serif font-bold">Your Conversations</h3>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">Select a farmer from the list or join the community chat to start trading and sharing tips.</p>
            </div>
            <Button onClick={() => setActiveChat("main_community_chat")} variant="outline" className="rounded-xl border-primary text-primary font-bold">
              Join Community Chat
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
