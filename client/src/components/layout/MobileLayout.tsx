import { Link, useLocation } from "wouter";
import { Home, Plus, MessageSquare, User, Sprout, Bot, Bell } from "lucide-react";
import { cn } from "@/lib/utils";

interface MobileLayoutProps {
  children: React.ReactNode;
}

export function MobileLayout({ children }: MobileLayoutProps) {
  const [location] = useLocation();

  const navItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: Bot, label: "Assistant", path: "/assistant" },
    { icon: MessageSquare, label: "Chat", path: "/chat" },
    { icon: User, label: "Profile", path: "/profile" },
  ];

  return (
    <div className="min-h-screen bg-muted/20 flex justify-center">
      <div className="w-full md:max-w-4xl lg:max-w-6xl bg-white min-h-screen relative shadow-2xl flex flex-col md:rounded-3xl md:my-8 md:min-h-[90vh] overflow-hidden">
        {/* Header */}
        <header className="px-4 md:px-8 py-3 md:py-5 border-b border-border bg-white/80 backdrop-blur-md sticky top-0 z-20 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-primary/10 p-2 rounded-lg">
              <Sprout className="w-6 h-6 md:w-8 md:h-8 text-primary" />
            </div>
            <h1 className="text-xl md:text-2xl font-serif font-bold text-foreground">Krishi Bajar</h1>
          </div>
          
          <div className="hidden md:flex items-center gap-6 mr-6">
            {navItems.map((item) => (
              <Link key={item.path} href={item.path}>
                <div className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-lg transition-all cursor-pointer font-medium",
                  location === item.path ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted"
                )}>
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </div>
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <Link href="/notifications">
              <div className="relative p-2 hover:bg-muted rounded-full transition-colors cursor-pointer">
                <Bell className="w-5 h-5 text-foreground" />
                <span className="absolute top-1.5 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
              </div>
            </Link>
            <Link href="/post" className="hidden md:block">
              <button className="bg-primary text-white px-4 py-2 rounded-xl shadow-lg hover:bg-primary/90 transition-all font-bold text-sm">
                Sell Produce
              </button>
            </Link>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto pb-24 md:pb-8 no-scrollbar md:px-4">
          {children}
        </main>

        {/* Floating Post Button - Mobile Only */}
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 md:hidden">
          <Link href="/post">
            <button className="bg-black text-white p-4 rounded-full shadow-xl shadow-black/20 hover:scale-105 active:scale-95 transition-all border-4 border-white flex items-center justify-center">
              <Plus className="w-6 h-6" strokeWidth={3} />
            </button>
          </Link>
        </div>

        {/* Bottom Navigation - Mobile Only */}
        <nav className="fixed bottom-0 w-full max-w-md bg-white border-t border-border px-6 py-2 pb-safe z-30 md:hidden">
          <ul className="flex justify-between items-center">
            {navItems.map((item, index) => {
              const isActive = location === item.path;
              const isMiddle = index === 1;
              
              return (
                <li key={item.path} className={cn(isMiddle && "mr-12")}>
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
