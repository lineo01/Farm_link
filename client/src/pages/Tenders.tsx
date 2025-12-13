import { ArrowLeft, Clock, MapPin, Building2, ChevronRight, FileText } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

const TENDERS = [
  {
    id: 1,
    buyer: "Hotel Annapurna",
    item: "Organic Red Tomatoes",
    quantity: "500 kg",
    priceRange: "Rs. 60-65/kg",
    deadline: "2 days left",
    location: "Kathmandu",
    description: "Looking for high-quality organic tomatoes for our weekly kitchen supply. Must be firm and ripe.",
    status: "Open"
  },
  {
    id: 2,
    buyer: "Bhat Bhateni Supermarket",
    item: "Fresh Spinach (Saag)",
    quantity: "200 bundles",
    priceRange: "Rs. 40-45/bundle",
    deadline: "5 hours left",
    location: "Kavre Collection Center",
    description: "Morning harvest preferred. Delivery required by 6 AM tomorrow.",
    status: "Urgent"
  },
  {
    id: 3,
    buyer: "Big Mart",
    item: "Cauliflower",
    quantity: "1000 kg",
    priceRange: "Rs. 45-50/kg",
    deadline: "1 week left",
    location: "Kalimati",
    description: "Bulk procurement for weekend sale. Grade A quality only.",
    status: "Open"
  }
];

export default function Tenders() {
  return (
    <div className="bg-muted/10 min-h-screen pb-20">
      {/* Header */}
      <div className="bg-white p-4 sticky top-0 z-10 shadow-sm border-b border-border flex items-center gap-3">
        <Link href="/">
          <button className="p-2 -ml-2 hover:bg-muted rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
        </Link>
        <h1 className="text-xl font-serif font-bold">Market Tenders</h1>
      </div>

      <div className="p-4 space-y-4">
        <div className="bg-blue-600 rounded-2xl p-6 text-white shadow-lg shadow-blue-200">
           <h2 className="text-lg font-bold mb-2">Sell in Bulk</h2>
           <p className="text-blue-100 text-sm mb-4">Direct contracts with hotels, supermarkets, and wholesalers. Better rates for bulk quantities.</p>
           <div className="flex gap-2">
             <div className="bg-white/20 px-3 py-1 rounded-lg text-xs font-bold backdrop-blur-md">3 Active</div>
             <div className="bg-white/20 px-3 py-1 rounded-lg text-xs font-bold backdrop-blur-md">High Demand</div>
           </div>
        </div>

        <h3 className="font-bold text-lg px-1">Open Requests</h3>
        
        <div className="space-y-4">
          {TENDERS.map((tender) => (
            <div key={tender.id} className="bg-white rounded-2xl p-5 border border-border shadow-sm relative overflow-hidden group">
               {tender.status === 'Urgent' && (
                 <div className="absolute top-0 right-0 bg-red-100 text-red-600 text-[10px] font-bold px-3 py-1 rounded-bl-xl">
                   URGENT
                 </div>
               )}
               
               <div className="flex items-start justify-between mb-4">
                  <div className="flex gap-3">
                     <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-muted-foreground">
                        <Building2 className="w-6 h-6" />
                     </div>
                     <div>
                        <h4 className="font-bold text-base">{tender.buyer}</h4>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                          <MapPin className="w-3 h-3" /> {tender.location}
                        </div>
                     </div>
                  </div>
               </div>

               <div className="bg-muted/20 rounded-xl p-3 mb-4 space-y-2">
                  <div className="flex justify-between items-center">
                     <span className="text-sm text-muted-foreground font-medium">Looking for</span>
                     <span className="text-sm font-bold text-foreground">{tender.item}</span>
                  </div>
                  <div className="flex justify-between items-center">
                     <span className="text-sm text-muted-foreground font-medium">Quantity</span>
                     <span className="text-sm font-bold text-foreground">{tender.quantity}</span>
                  </div>
                  <div className="flex justify-between items-center">
                     <span className="text-sm text-muted-foreground font-medium">Rate Offer</span>
                     <span className="text-sm font-bold text-primary">{tender.priceRange}</span>
                  </div>
               </div>

               <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground font-medium">
                     <Clock className="w-3.5 h-3.5" />
                     {tender.deadline}
                  </div>
                  <Button className="rounded-full h-9 px-4 text-xs font-bold shadow-lg shadow-primary/10">
                     Apply Now <ChevronRight className="w-3 h-3 ml-1" />
                  </Button>
               </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
