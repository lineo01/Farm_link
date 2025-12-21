import { Search, Send, Loader2, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useRef } from "react";

interface Conversation {
  id: number;
  title: string;
  createdAt: string;
}

interface Message {
  id: number;
  conversationId: number;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
}

export default function Chat() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<number | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isStreamingResponse, setIsStreamingResponse] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Fetch conversations on mount
  useEffect(() => {
    fetchConversations();
  }, []);

  // Fetch messages when conversation changes
  useEffect(() => {
    if (activeConversationId) {
      fetchMessages(activeConversationId);
    }
  }, [activeConversationId]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isStreamingResponse]);

  const fetchConversations = async () => {
    try {
      const res = await fetch("/api/conversations");
      const data = await res.json();
      setConversations(data);
      if (data.length > 0 && !activeConversationId) {
        setActiveConversationId(data[0].id);
      }
    } catch (error) {
      console.error("Error fetching conversations:", error);
    }
  };

  const fetchMessages = async (conversationId: number) => {
    try {
      const res = await fetch(`/api/conversations/${conversationId}`);
      const data = await res.json();
      setMessages(data.messages || []);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const createConversation = async () => {
    try {
      const res = await fetch("/api/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: "New Chat" }),
      });
      const conversation = await res.json();
      setConversations([conversation, ...conversations]);
      setActiveConversationId(conversation.id);
    } catch (error) {
      console.error("Error creating conversation:", error);
    }
  };

  const sendMessage = async () => {
    if (!inputValue.trim() || !activeConversationId) return;

    const userMessage = inputValue;
    setInputValue("");
    setIsLoading(true);

    // Add user message to UI immediately
    setMessages((prev) => [
      ...prev,
      {
        id: -1,
        conversationId: activeConversationId,
        role: "user",
        content: userMessage,
        createdAt: new Date().toISOString(),
      },
    ]);

    try {
      setIsStreamingResponse(true);
      let assistantContent = "";

      const res = await fetch(`/api/conversations/${activeConversationId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: userMessage }),
      });

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();

      if (reader) {
        let tempMessage: Message | null = null;

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split("\n");

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              try {
                const data = JSON.parse(line.slice(6));
                if (data.content) {
                  assistantContent += data.content;

                  if (!tempMessage) {
                    tempMessage = {
                      id: -2,
                      conversationId: activeConversationId,
                      role: "assistant",
                      content: assistantContent,
                      createdAt: new Date().toISOString(),
                    };
                    setMessages((prev) => [...prev, tempMessage!]);
                  } else {
                    setMessages((prev) => [
                      ...prev.slice(0, -1),
                      {
                        ...tempMessage,
                        content: assistantContent,
                      } as Message,
                    ]);
                  }
                }
              } catch {}
            }
          }
        }
      }
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Failed to send message");
    } finally {
      setIsLoading(false);
      setIsStreamingResponse(false);
      await fetchMessages(activeConversationId);
    }
  };

  // Chat view
  if (activeConversationId) {
    return (
      <div className="flex flex-col h-full bg-white">
        {/* Header */}
        <div className="p-4 border-b border-border flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-md z-10">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveConversationId(null)}
              className="text-muted-foreground hover:text-foreground text-lg"
              data-testid="button-back"
            >
              ←
            </button>
            <div>
              <h3 className="font-bold text-sm" data-testid="text-conversation-title">
                {conversations.find((c) => c.id === activeConversationId)?.title}
              </h3>
              <p className="text-[10px] text-green-600 font-medium">Farm AI Assistant</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={createConversation}
            data-testid="button-new-chat"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        {/* Messages */}
        <div
          ref={scrollRef}
          className="flex-1 p-4 space-y-4 overflow-y-auto bg-muted/10"
          data-testid="messages-container"
        >
          {messages.length === 0 && !isStreamingResponse && (
            <div className="flex justify-center items-center h-full">
              <p className="text-muted-foreground text-sm" data-testid="text-empty-state">
                Start a conversation with the Farm AI Assistant
              </p>
            </div>
          )}

          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`p-3 rounded-2xl max-w-[80%] text-sm shadow-sm ${
                  msg.role === "user"
                    ? "bg-primary text-white rounded-tr-none"
                    : "bg-white border border-border text-foreground rounded-tl-none"
                }`}
                data-testid={`message-${msg.role}-${msg.id}`}
              >
                {msg.content}
              </div>
            </div>
          ))}

          {isStreamingResponse && (
            <div className="flex justify-start">
              <div className="bg-white border border-border text-foreground p-3 rounded-2xl rounded-tl-none max-w-[80%] text-sm shadow-sm flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span data-testid="text-typing">Typing...</span>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="p-4 border-t border-border bg-white flex items-center gap-2">
          <Input
            placeholder="Ask about crops, farming tips, prices..."
            className="rounded-full bg-muted/30 border-none"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
            disabled={isLoading || isStreamingResponse}
            data-testid="input-message"
          />
          <button
            onClick={sendMessage}
            disabled={isLoading || isStreamingResponse || !inputValue.trim()}
            className="p-2 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            data-testid="button-send"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  // Conversations list view
  return (
    <div className="flex flex-col h-full">
      <div className="p-4 pb-2">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-serif font-bold" data-testid="text-messages-title">
            Messages
          </h2>
          <Button
            onClick={createConversation}
            className="gap-2"
            size="sm"
            data-testid="button-new-conversation"
          >
            <Plus className="w-4 h-4" />
            New
          </Button>
        </div>
        <div className="relative mb-4">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search conversations..."
            className="pl-9 bg-muted/30 border-none rounded-xl"
            data-testid="input-search"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {conversations.length === 0 ? (
          <div className="flex justify-center items-center h-full p-4">
            <p className="text-muted-foreground text-sm text-center" data-testid="text-no-conversations">
              No conversations yet. Start a new chat with the Farm AI Assistant!
            </p>
          </div>
        ) : (
          conversations.map((conv) => (
            <div
              key={conv.id}
              onClick={() => setActiveConversationId(conv.id)}
              className="flex items-center gap-4 p-4 border-b border-border/40 hover:bg-muted/30 transition-colors cursor-pointer"
              data-testid={`conversation-${conv.id}`}
            >
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                <span className="text-primary font-semibold text-sm" data-testid={`avatar-${conv.id}`}>
                  {conv.title[0]?.toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm truncate" data-testid={`title-${conv.id}`}>
                  {conv.title}
                </h3>
                <p className="text-xs text-muted-foreground truncate">
                  {new Date(conv.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
