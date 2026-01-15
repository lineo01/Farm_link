import farmerImage from "@assets/generated_images/friendly_nepali_farmer_portrait.png";
import supermarketImage from "@assets/generated_images/modern_supermarket_logo_on_glass_building.png";
import hotelImage from "@assets/generated_images/luxury_hotel_exterior.png";
import wholesaleImage from "@assets/generated_images/wholesale_market_warehouse.png";
import { Button } from "@/components/ui/button";
import { Settings, MapPin, Phone, Star, Package, TrendingUp, TrendingDown, Wallet, FileText, Users, Building2, ChevronRight, Plus, ExternalLink } from "lucide-react";
import { BALANCE_SHEET } from "@/lib/mockData";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, query, where, onSnapshot, orderBy } from "firebase/firestore";
import { Link } from "wouter";
import { ShoppingBag } from "lucide-react";

export default function Profile() {
  const { user } = useAuth();
  const [myListings, setMyListings] = useState<any[]>([]);
  const [myOrders, setMyOrders] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'listings' | 'orders'>('listings');

  useEffect(() => {
    if (!user) return;

    // Listen to listings
    const qListings = query(
      collection(db, "products"),
      where("userId", "==", user.uid)
    );

    const unsubscribeListings = onSnapshot(qListings, (snapshot) => {
      const listings = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMyListings(listings);
    });

    // Listen to incoming orders for the farmer
    const qOrders = query(
      collection(db, "orders"),
      where("sellerId", "==", user.uid),
      orderBy("createdAt", "desc")
    );

    const unsubscribeOrders = onSnapshot(qOrders, (snapshot) => {
      const orders = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMyOrders(orders);
    });

    return () => {
      unsubscribeListings();
      unsubscribeOrders();
    };
  }, [user]);
  const SUPPLY_NETWORK = [
    { id: 1, name: "Bhat Bhateni", type: "Retail", status: "Active", image: supermarketImage },
    { id: 2, name: "Hotel Annapurna", type: "Hospitality", status: "Active", image: hotelImage },
    { id: 3, name: "Kalimati Market", type: "Wholesale", status: "Active", image: wholesaleImage },
    { id: 4, name: "Big Mart", type: "Retail", status: "Pending", image: "https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&q=80&w=200" },
  ];

  return (
    <div className="bg-muted/10 min-h-full">
      {/* Cover */}
      <div className="h-32 bg-primary/20 relative">
        <div className="absolute top-4 right-4">
          <Button variant="ghost" size="icon" className="text-primary-foreground bg-black/10 hover:bg-black/20 backdrop-blur-sm rounded-full">
            <Settings className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <div className="px-4 pb-8">
        {/* Header Info */}
        <div className="relative -mt-12 mb-6 text-center">
          <div className="inline-block p-1 bg-white rounded-full shadow-md">
            <img 
              src={user?.photoURL || farmerImage} 
              alt={user?.displayName || "Farmer"} 
              className="w-24 h-24 rounded-full object-cover"
            />
          </div>
          <h2 className="text-xl font-serif font-bold mt-2">{user?.displayName || "Farmer"}</h2>
          <div className="flex items-center justify-center gap-1 text-muted-foreground text-sm">
            <MapPin className="w-3 h-3" />
            <span>{user?.isSetupComplete ? "Verified Location" : "Panchkhal, Kavre"}</span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-white p-3 rounded-xl text-center border border-border shadow-sm">
            <div className="text-xl font-bold text-primary">4.8</div>
            <div className="text-xs text-muted-foreground flex items-center justify-center gap-1">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" /> Rating
            </div>
          </div>
          <div className="bg-white p-3 rounded-xl text-center border border-border shadow-sm">
            <div className="text-xl font-bold text-primary">124</div>
            <div className="text-xs text-muted-foreground flex items-center justify-center gap-1">
              <Package className="w-3 h-3" /> Sold
            </div>
          </div>
          <div className="bg-white p-3 rounded-xl text-center border border-border shadow-sm">
            <div className="text-xl font-bold text-primary">2.5y</div>
            <div className="text-xs text-muted-foreground flex items-center justify-center gap-1">
              <TrendingUp className="w-3 h-3" /> Active
            </div>
          </div>
        </div>

        {/* Visual Supply Network */}
        <div className="mb-8">
           <div className="flex items-center justify-between mb-4 px-1">
             <h3 className="font-bold text-lg">My Network</h3>
             <span className="text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full">{SUPPLY_NETWORK.length} Partners</span>
           </div>
           
           <div className="grid grid-cols-2 gap-3">
              {SUPPLY_NETWORK.map((partner) => (
                <div key={partner.id} className="bg-white p-3 rounded-2xl border border-border shadow-sm relative overflow-hidden group">
                   <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                   <img src={partner.image} className="absolute inset-0 w-full h-full object-cover transition-transform group-hover:scale-110" />
                   
                   <div className="relative z-20 h-24 flex flex-col justify-end text-white">
                      <p className="font-bold text-sm leading-tight mb-0.5">{partner.name}</p>
                      <p className="text-[10px] opacity-80 mb-2">{partner.type}</p>
                      
                      <div className="flex items-center gap-1">
                         <div className={cn(
                           "w-2 h-2 rounded-full",
                           partner.status === 'Active' ? "bg-green-500" : "bg-orange-500"
                         )} />
                         <span className="text-[10px] font-medium">{partner.status}</span>
                      </div>
                   </div>
                </div>
              ))}
              
              {/* Add New Card */}
              <button className="bg-muted/30 border-2 border-dashed border-border rounded-2xl h-32 flex flex-col items-center justify-center gap-2 hover:bg-muted/50 transition-colors group">
                 <div className="w-10 h-10 rounded-full bg-white border border-border flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                   <Plus className="w-5 h-5 text-muted-foreground" />
                 </div>
                 <span className="text-xs font-bold text-muted-foreground">Add Partner</span>
              </button>
           </div>
        </div>

        {/* Balance Sheet Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-border overflow-hidden mb-6">
          <div className="p-4 border-b border-border bg-muted/20 flex items-center justify-between">
             <div className="flex items-center gap-2">
               <div className="bg-primary/10 p-2 rounded-lg">
                 <Wallet className="w-4 h-4 text-primary" />
               </div>
               <h3 className="font-bold text-sm">Farm Balance Sheet</h3>
             </div>
             <span className="text-xs text-muted-foreground bg-white px-2 py-1 rounded border border-border">March 2024</span>
          </div>
          
          <div className="p-4 grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Total Revenue</p>
              <p className="text-lg font-bold text-green-600">Rs. {BALANCE_SHEET.totalRevenue.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Total Expenses</p>
              <p className="text-lg font-bold text-red-500">Rs. {BALANCE_SHEET.totalExpense.toLocaleString()}</p>
            </div>
          </div>
          
          <div className="px-4 pb-4">
             <div className="bg-muted/30 rounded-xl p-3 flex justify-between items-center">
                <span className="text-sm font-medium">Net Profit</span>
                <span className="text-lg font-bold text-primary">Rs. {BALANCE_SHEET.netProfit.toLocaleString()}</span>
             </div>
          </div>

          <div className="border-t border-border">
            <div className="grid grid-cols-2 divide-x divide-border">
               <button className="p-3 text-xs font-medium text-center hover:bg-muted/50">View Report</button>
               <button className="p-3 text-xs font-medium text-center hover:bg-muted/50">Download PDF</button>
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="bg-primary/5 p-4 rounded-xl flex items-center justify-between mb-8 border border-primary/10">
          <div>
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1">Contact</p>
            <p className="font-mono text-sm font-semibold">+977 9841234567</p>
          </div>
          <Button size="sm" variant="outline" className="rounded-full h-8 w-8 p-0">
            <Phone className="w-4 h-4" />
          </Button>
        </div>

        {/* Tabs for Listings/Orders */}
        <div className="flex gap-4 mb-4 border-b border-border">
          <button 
            onClick={() => setActiveTab('listings')}
            className={cn(
              "pb-2 px-1 text-sm font-bold transition-colors relative",
              activeTab === 'listings' ? "text-primary" : "text-muted-foreground"
            )}
          >
            My Listings ({myListings.length})
            {activeTab === 'listings' && <motion.div layoutId="tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />}
          </button>
          <button 
            onClick={() => setActiveTab('orders')}
            className={cn(
              "pb-2 px-1 text-sm font-bold transition-colors relative",
              activeTab === 'orders' ? "text-primary" : "text-muted-foreground"
            )}
          >
            Incoming Orders ({myOrders.length})
            {activeTab === 'orders' && <motion.div layoutId="tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />}
          </button>
        </div>

        {/* Listings or Orders Content */}
        <div className="space-y-4">
          {activeTab === 'listings' ? (
            <div className="space-y-3">
              {myListings.map((listing) => (
                <Link key={listing.id} href={`/product/${listing.id}`}>
                  <div className="bg-white p-3 rounded-xl border border-border shadow-sm flex items-center gap-3 hover:bg-muted/30 transition-colors cursor-pointer group">
                    <img src={listing.image} className="w-12 h-12 rounded-lg object-cover" />
                    <div className="flex-1">
                      <h4 className="font-bold text-sm">{listing.name}</h4>
                      <p className="text-xs text-primary font-bold">{listing.price}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              ))}
              {myListings.length === 0 && (
                <div className="text-center py-10 bg-white rounded-2xl border border-dashed border-border">
                  <Package className="w-8 h-8 mx-auto mb-2 text-muted-foreground opacity-20" />
                  <p className="text-sm text-muted-foreground">No harvests listed yet.</p>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {myOrders.map((order) => (
                <div key={order.id} className="bg-white p-4 rounded-xl border border-border shadow-sm space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <img src={order.buyerPhoto || `https://api.dicebear.com/7.x/avataaars/svg?seed=${order.buyerId}`} className="w-8 h-8 rounded-full" />
                      <div>
                        <p className="text-xs font-bold">{order.buyerName}</p>
                        <p className="text-[10px] text-muted-foreground">ordered {order.productName}</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold bg-primary/10 text-primary px-2 py-1 rounded-full uppercase">
                      {order.status}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-border/50">
                    <p className="text-sm font-bold text-primary">{order.price}</p>
                    <p className="text-[10px] text-muted-foreground">
                      {order.createdAt?.toDate ? order.createdAt.toDate().toLocaleDateString() : 'Just now'}
                    </p>
                  </div>
                </div>
              ))}
              {myOrders.length === 0 && (
                <div className="text-center py-10 bg-white rounded-2xl border border-dashed border-border">
                  <ShoppingBag className="w-8 h-8 mx-auto mb-2 text-muted-foreground opacity-20" />
                  <p className="text-sm text-muted-foreground">No orders received yet.</p>
                </div>
              )}
            </div>
          )}

          <div className="pt-4 space-y-1">
            <div className="p-3 hover:bg-muted/30 rounded-lg cursor-pointer transition-colors text-sm font-medium bg-white border border-transparent hover:border-border flex justify-between items-center">
              Farm Details
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="p-3 hover:bg-muted/30 rounded-lg cursor-pointer transition-colors text-sm font-medium text-destructive bg-white border border-transparent hover:border-border">
              Log Out
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
