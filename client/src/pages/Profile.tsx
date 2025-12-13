import farmerImage from "@assets/generated_images/friendly_nepali_farmer_portrait.png";
import { Button } from "@/components/ui/button";
import { Settings, MapPin, Phone, Star, Package, TrendingUp, TrendingDown, Wallet, FileText } from "lucide-react";
import { BALANCE_SHEET } from "@/lib/mockData";
import { cn } from "@/lib/utils";

export default function Profile() {
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
              src={farmerImage} 
              alt="Ram Bahadur" 
              className="w-24 h-24 rounded-full object-cover"
            />
          </div>
          <h2 className="text-xl font-serif font-bold mt-2">Ram Bahadur</h2>
          <div className="flex items-center justify-center gap-1 text-muted-foreground text-sm">
            <MapPin className="w-3 h-3" />
            <span>Panchkhal, Kavre</span>
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

        {/* Menu */}
        <div className="space-y-1">
          <div className="p-3 hover:bg-muted/30 rounded-lg cursor-pointer transition-colors text-sm font-medium bg-white border border-transparent hover:border-border">
            My Listings
          </div>
          <div className="p-3 hover:bg-muted/30 rounded-lg cursor-pointer transition-colors text-sm font-medium bg-white border border-transparent hover:border-border">
            Order History
          </div>
          <div className="p-3 hover:bg-muted/30 rounded-lg cursor-pointer transition-colors text-sm font-medium bg-white border border-transparent hover:border-border">
            Farm Details
          </div>
          <div className="p-3 hover:bg-muted/30 rounded-lg cursor-pointer transition-colors text-sm font-medium text-destructive bg-white border border-transparent hover:border-border">
            Log Out
          </div>
        </div>
      </div>
    </div>
  );
}
