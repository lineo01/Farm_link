import { NOTIFICATIONS } from "@/lib/mockData";
import { Truck, ShoppingBag, Info, ChevronRight, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import mapImage from "@assets/generated_images/clean_map_route_interface.png";
import { useState } from "react";

export default function Notifications() {
  const [openMap, setOpenMap] = useState(false);

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-2xl font-serif font-bold mb-4">Notifications</h2>

      <div className="space-y-3">
        {NOTIFICATIONS.map((notif) => (
          <div 
            key={notif.id}
            className={cn(
              "p-4 rounded-xl border flex gap-4 transition-all hover:bg-muted/50",
              notif.read ? "bg-white border-border" : "bg-blue-50/50 border-blue-100"
            )}
          >
            <div className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
              notif.type === 'truck' ? "bg-orange-100 text-orange-600" :
              notif.type === 'order' ? "bg-green-100 text-green-600" :
              "bg-gray-100 text-gray-600"
            )}>
              {notif.type === 'truck' && <Truck className="w-5 h-5" />}
              {notif.type === 'order' && <ShoppingBag className="w-5 h-5" />}
              {notif.type === 'system' && <Info className="w-5 h-5" />}
            </div>

            <div className="flex-1 space-y-1">
              <p className={cn("text-sm leading-snug", !notif.read && "font-medium")}>
                {notif.message}
              </p>
              <p className="text-xs text-muted-foreground">{notif.time}</p>

              {notif.type === 'truck' && (
                <Dialog open={openMap} onOpenChange={setOpenMap}>
                  <DialogTrigger asChild>
                    <button className="mt-2 text-xs font-semibold text-primary flex items-center gap-1 bg-primary/10 px-3 py-1.5 rounded-full w-fit hover:bg-primary/20 transition-colors">
                      <MapPin className="w-3 h-3" />
                      Track Truck Live
                    </button>
                  </DialogTrigger>
                  <DialogContent className="p-0 overflow-hidden max-w-sm border-none bg-transparent shadow-none">
                     <div className="bg-white rounded-2xl overflow-hidden shadow-2xl">
                        <div className="relative aspect-[4/5] w-full">
                          <img src={mapImage} alt="Map" className="w-full h-full object-cover" />
                          
                          {/* Mock UI overlay on map */}
                          <div className="absolute top-4 left-4 right-4 bg-white/90 backdrop-blur-md p-3 rounded-xl shadow-lg border border-border/50">
                            <div className="flex items-center gap-3">
                              <div className="bg-orange-100 p-2 rounded-lg">
                                <Truck className="w-5 h-5 text-orange-600" />
                              </div>
                              <div>
                                <h4 className="font-bold text-sm">Collection Truck #4455</h4>
                                <p className="text-xs text-muted-foreground">Arriving in 12 mins</p>
                              </div>
                            </div>
                          </div>

                          {/* Close button at bottom */}
                          <div className="absolute bottom-4 left-4 right-4">
                            <button 
                              onClick={() => setOpenMap(false)}
                              className="w-full bg-primary text-white py-3 rounded-xl font-bold shadow-lg shadow-primary/30"
                            >
                              Close Map
                            </button>
                          </div>
                        </div>
                     </div>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
