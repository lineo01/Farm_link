import { Link, useLocation } from "wouter";
import { Home, PlusCircle, Bell, MessageSquare, User, Sprout } from "lucide-react";
import { cn } from "@/lib/utils";

interface MobileLayoutProps {
  children: React.ReactNode;
}

export function MobileLayout({ children }: MobileLayoutProps) {
  const [location] = useLocation();

  const navItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: PlusCircle, label: "Post", path: "/post" },
    { icon: Bell, label: "Alerts", path: "/notifications" },
    { icon: MessageSquare, label: "Chat", path: "/chat" },
    { icon: User, label: "Profile", path: "/profile" },
  ];

  return (
    <div className="min-h-screen bg-background flex justify-center">
      <div className="w-full max-w-md bg-white min-h-screen relative shadow-2xl flex flex-col">
        {/* Header */}
        <header className="px-4 py-3 border-b border-border bg-white/80 backdrop-blur-md sticky top-0 z-20 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-primary/10 p-2 rounded-lg">
              <Sprout className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-xl font-serif font-bold text-foreground">Krishi Bajar</h1>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto pb-20 no-scrollbar">
          {children}
        </main>

        {/* Bottom Navigation */}
        <nav className="fixed bottom-0 w-full max-w-md bg-white border-t border-border px-2 py-2 pb-safe z-30">
          <ul className="flex justify-around items-center">
            {navItems.map((item) => {
              const isActive = location === item.path;
              return (
                <li key={item.path}>
                  <Link href={item.path} className={cn(
                      "flex flex-col items-center p-2 rounded-xl transition-all duration-300 cursor-pointer",
                      isActive 
                        ? "text-primary scale-110" 
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    )}>
                      <item.icon 
                        className={cn("w-6 h-6 mb-1", isActive && "fill-current")} 
                        strokeWidth={isActive ? 2.5 : 2}
                      />
                      <span className="text-[10px] font-medium">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </div>
  );
}
