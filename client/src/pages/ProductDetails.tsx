import { Link, useRoute } from "wouter";
import { ArrowLeft, MapPin, Share2, ShieldCheck, Sprout, Droplets, Sun, Thermometer, MessageCircle, HelpCircle, BadgeCheck, Send, Minus, Plus, CreditCard, CheckCircle2, ShoppingBag, HandCoins } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import soilImage from "@assets/generated_images/detailed_farm_soil_close_up.png";
import { db } from "@/lib/firebase";
import { doc, getDoc, collection, addDoc, onSnapshot, query, orderBy, serverTimestamp } from "firebase/firestore";
import { useState, useEffect } from "react";
import { cloudinary } from "@/lib/cloudinary";
import { useToast } from "@/hooks/use-toast";
import { AdvancedImage } from "@cloudinary/react";
import { fill } from "@cloudinary/url-gen/actions/resize";
import { useAuth } from "@/hooks/use-auth";

export default function ProductDetails() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [match, params] = useRoute("/product/:id");
  const id = params?.id;
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    async function fetchProduct() {
      if (!id) return;
      try {
        const docRef = doc(db, "products", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProduct({ id: docSnap.id, ...docSnap.data() });
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();

    if (id) {
      const q = query(
        collection(db, "products", id, "comments"),
        orderBy("createdAt", "desc")
      );
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const commentsList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setComments(commentsList);
      });
      return () => unsubscribe();
    }
  }, [id]);

  const handleSendComment = async () => {
    if (!newComment.trim() || !user || !id) return;

    try {
      await addDoc(collection(db, "products", id, "comments"), {
        text: newComment,
        userId: user.uid,
        userName: user.displayName || "Farmer",
        userPhoto: user.photoURL,
        createdAt: serverTimestamp(),
      });
      setNewComment("");
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const [quantity, setQuantity] = useState(1);
  const [paymentMode, setPaymentMode] = useState<'esewa' | 'cod'>('esewa');
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const getPriceValue = (priceString: string) => {
    if (!priceString) return 0;
    const numericPart = priceString.replace(/[^0-9.]/g, '');
    return parseFloat(numericPart) || 0;
  };

  const handleOrder = async () => {
    if (!user || !product) return;
    setIsPaymentModalOpen(true);
  };

  const confirmOrder = async () => {
    if (!user || !product) return;
    setIsProcessing(true);
    
    try {
      const unitPrice = getPriceValue(product.price);
      const totalPrice = unitPrice * quantity;
      
      await addDoc(collection(db, "orders"), {
        productId: product.id,
        productName: product.name,
        sellerId: product.userId,
        buyerId: user.uid,
        buyerName: user.displayName || "Buyer",
        buyerPhoto: user.photoURL,
        price: `Rs. ${totalPrice}`,
        quantity: quantity,
        paymentMode: paymentMode,
        status: "pending",
        createdAt: serverTimestamp(),
      });
      
      setIsSuccess(true);
      setTimeout(() => {
        setIsPaymentModalOpen(false);
        setIsProcessing(false);
        setIsSuccess(false);
        toast({
          title: "Order Placed!",
          description: paymentMode === 'esewa' 
            ? "Redirecting you to eSewa for payment..." 
            : "Order placed successfully with Cash on Delivery.",
        });
        
        if (paymentMode === 'esewa') {
          window.location.href = 'https://esewa.com.np';
        }
      }, 2000);
    } catch (error) {
      console.error("Error placing order:", error);
      setIsProcessing(false);
      toast({
        title: "Order Failed",
        description: "Could not process your order. Please try again.",
        variant: "destructive"
      });
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="animate-pulse text-primary font-bold">Loading harvest details...</div>
    </div>
  );

  if (!product) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white p-6 text-center">
      <h2 className="text-2xl font-serif font-bold text-foreground mb-2">Product Not Found</h2>
      <p className="text-muted-foreground mb-6">This harvest listing might have been removed or sold.</p>
      <Link href="/">
        <Button className="rounded-xl px-8">Back to Marketplace</Button>
      </Link>
    </div>
  );

  const sensorData = product.sensorData || {
    temperature: "24°C",
    soilMoisture: "65%",
    uvIndex: "High"
  };

  return (
    <div className="bg-white min-h-screen pb-60">
      {/* Header Image */}
      <div className="relative h-[40vh]">
        {product.image && (product.image.includes('res.cloudinary.com') || product.image.includes('cloudinary.com') || !product.image.startsWith('http')) ? (
          <AdvancedImage 
            cldImg={cloudinary.image(product.image.split('/').pop()?.split('.')[0] || product.image).resize(fill().width(800).height(600))} 
            className="w-full h-full object-cover"
          />
        ) : (
          <img src={product.image || "https://images.unsplash.com/photo-1566385278603-975bad627075?auto=format&fit=crop&q=80&w=800"} alt={product.name} className="w-full h-full object-cover" />
        )}
        <div className="absolute top-0 left-0 right-0 p-4 pt-8 bg-gradient-to-b from-black/60 to-transparent flex justify-between items-center">
          <Link href="/">
            <button className="bg-white/20 backdrop-blur-md p-2 rounded-full text-white hover:bg-white/30 transition-colors">
              <ArrowLeft className="w-6 h-6" />
            </button>
          </Link>
          <button className="bg-white/20 backdrop-blur-md p-2 rounded-full text-white hover:bg-white/30 transition-colors">
            <Share2 className="w-6 h-6" />
          </button>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-white to-transparent pt-20">
          <h1 className="text-3xl font-serif font-bold text-foreground mb-1">{product.name}</h1>
          <p className="text-xl font-bold text-primary">{product.price}</p>
        </div>
      </div>

      <div className="px-5 py-4 space-y-8">
        {/* Farmer Profile */}
        <div className="flex items-center justify-between">
           <div className="flex items-center gap-3">
              <img src={product.farmerImage} className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-md" />
              <div>
                <h3 className="font-bold text-foreground">{product.farmer}</h3>
                <div className="flex items-center text-xs text-muted-foreground gap-1">
                  <MapPin className="w-3 h-3" /> {product.location}
                </div>
              </div>
           </div>
           <div className="flex items-center gap-2">
             <Link href={`/chat?user=${product.userId}`}>
               <Button variant="outline" size="sm" className="rounded-full font-bold">Message</Button>
             </Link>
             <Button 
               size="sm" 
               className="rounded-full font-bold bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-500/20"
               onClick={handleOrder}
             >
               Order Now
             </Button>
           </div>
        </div>

        {/* Farming Methods */}
        <div>
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-green-600" />
            Farming Details
          </h3>
          <div className="bg-muted/10 border border-border rounded-2xl p-5 space-y-4">
             <div className="text-sm leading-relaxed text-muted-foreground">
               <p className="mb-3 font-medium text-foreground">Growing Methods:</p>
               <p>{product.description || "Grown using traditional methods with modern organic supplements. We prioritize soil health and strictly avoid chemical pesticides."}</p>
               {product.methods && (
                 <p className="mt-2 text-primary font-bold">{product.methods}</p>
               )}
             </div>
             
             <div className="grid grid-cols-2 gap-3">
               <div className="bg-white p-3 rounded-xl border border-border flex items-center gap-3">
                 <div className="bg-green-100 p-2 rounded-lg text-green-700">
                   <Sprout className="w-4 h-4" />
                 </div>
                 <div className="text-xs">
                   <p className="font-bold">Organic</p>
                   <p className="text-muted-foreground">Certified</p>
                 </div>
               </div>
               <div className="bg-white p-3 rounded-xl border border-border flex items-center gap-3">
                 <div className="bg-blue-100 p-2 rounded-lg text-blue-700">
                   <Droplets className="w-4 h-4" />
                 </div>
                 <div className="text-xs">
                   <p className="font-bold">Irrigation</p>
                   <p className="text-muted-foreground">Drip System</p>
                 </div>
               </div>
             </div>
          </div>
        </div>

        {/* Live Farm Data (Smart Sensors) */}
        <div>
           <h3 className="font-bold text-lg mb-4">Live Farm Conditions</h3>
           <div className="relative rounded-2xl overflow-hidden h-40 group">
             <img src={soilImage} className="absolute inset-0 w-full h-full object-cover brightness-[0.4]" />
             
             <div className="absolute inset-0 p-5 flex items-center justify-around text-white">
                <div className="text-center">
                  <div className="bg-white/20 backdrop-blur-md p-3 rounded-full mb-2 mx-auto w-fit">
                    <Thermometer className="w-6 h-6 text-orange-300" />
                  </div>
                  <p className="text-2xl font-bold">{sensorData.temperature}</p>
                  <p className="text-xs opacity-80">Soil Temp</p>
                </div>
                <div className="h-12 w-px bg-white/20"></div>
                <div className="text-center">
                  <div className="bg-white/20 backdrop-blur-md p-3 rounded-full mb-2 mx-auto w-fit">
                    <Droplets className="w-6 h-6 text-blue-300" />
                  </div>
                  <p className="text-2xl font-bold">{sensorData.soilMoisture || sensorData.humidity}</p>
                  <p className="text-xs opacity-80">Moisture</p>
                </div>
                <div className="h-12 w-px bg-white/20"></div>
                <div className="text-center">
                  <div className="bg-white/20 backdrop-blur-md p-3 rounded-full mb-2 mx-auto w-fit">
                    <Sun className="w-6 h-6 text-yellow-300" />
                  </div>
                  <p className="text-2xl font-bold">{sensorData.uvIndex || "High"}</p>
                  <p className="text-xs opacity-80">UV Index</p>
                </div>
             </div>
           </div>
           <p className="text-xs text-muted-foreground mt-2 text-center">Data auto-synced via FarmIoT™ Smart Sensors</p>
        </div>

        {/* Live Comments Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
             <h3 className="font-bold text-lg">Live Community Comments</h3>
             <span className="text-xs text-muted-foreground font-medium">{comments.length} comments</span>
          </div>
          
          <div className="space-y-4 mb-6">
            <div className="flex gap-3">
              <Input 
                placeholder="Ask a question about this harvest..." 
                className="rounded-xl bg-muted/30 border-none focus-visible:ring-primary/20"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendComment()}
              />
              <Button size="icon" className="rounded-xl shrink-0" onClick={handleSendComment}>
                <Send className="w-4 h-4" />
              </Button>
            </div>

            <AnimatePresence initial={false}>
              {comments.map((comment) => (
                <motion.div 
                  key={comment.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-muted/10 p-4 rounded-2xl border border-border/50"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <img src={comment.userPhoto || `https://api.dicebear.com/7.x/avataaars/svg?seed=${comment.userId}`} className="w-6 h-6 rounded-full" />
                    <span className="text-xs font-bold">{comment.userName}</span>
                    <span className="text-[10px] text-muted-foreground">
                      {comment.createdAt?.toDate ? comment.createdAt.toDate().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'Just now'}
                    </span>
                  </div>
                  <p className="text-sm text-foreground/80 leading-relaxed">{comment.text}</p>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <div className="flex items-center justify-between mb-4 mt-8">
             <h3 className="font-bold text-lg">Buyer Questions (3)</h3>
             <span className="text-xs text-muted-foreground font-medium">All answered</span>
          </div>
          
          <div className="space-y-4">
             {/* Questions logic remains similar but could be tied to DB later */}
             <div className="border-b border-border/50 pb-4">
                <div className="flex items-start gap-2 mb-2">
                   <HelpCircle className="w-4 h-4 text-muted-foreground mt-0.5" />
                   <p className="text-sm font-semibold text-foreground">Is this suitable for commercial salad usage?</p>
                </div>
                <div className="flex items-start gap-2 pl-6">
                   <div className="min-w-[16px] mt-0.5">
                     <BadgeCheck className="w-4 h-4 text-primary" />
                   </div>
                   <div>
                     <p className="text-sm text-muted-foreground leading-relaxed">
                       Yes, these are Grade A salad tomatoes. Ideal for restaurants and hotels.
                     </p>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-md border-t border-border z-30 w-full shadow-[0_-10px_40px_rgba(0,0,0,0.1)] pb-10">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          <div className="flex-1">
            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-tighter">Unit Price</p>
            <p className="text-xl font-black text-foreground">{product.price}</p>
          </div>
          <Button 
            size="lg" 
            className="flex-1 h-14 rounded-2xl font-black shadow-xl shadow-green-500/20 text-base active:scale-[0.98] transition-all bg-green-600 hover:bg-green-700"
            onClick={handleOrder}
          >
             Order Now
          </Button>
        </div>
      </div>

      <Dialog open={isPaymentModalOpen} onOpenChange={setIsPaymentModalOpen}>
        <DialogContent className="sm:max-w-md rounded-3xl mx-4 overflow-hidden p-0 border-none">
          <div className="bg-white p-6 space-y-6">
            <DialogHeader className="text-left">
              <DialogTitle className="text-2xl font-serif font-black">Complete Your Order</DialogTitle>
              <DialogDescription className="font-medium text-muted-foreground">
                Set quantity and confirm your purchase from <span className="text-primary font-bold">{product.farmer}</span>
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              {/* Refined Quantity Selector */}
              <div className="flex flex-col items-center justify-center py-4 bg-muted/30 rounded-3xl border border-border/50">
                <span className="text-[10px] text-muted-foreground font-black uppercase tracking-widest mb-4">Select Quantity (KG/Units)</span>
                <div className="flex items-center gap-8">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-14 h-14 flex items-center justify-center bg-white rounded-2xl text-primary shadow-md active:scale-90 transition-all hover:bg-primary hover:text-white"
                  >
                    <Minus className="w-6 h-6" strokeWidth={3} />
                  </button>
                  <div className="text-center min-w-[60px]">
                    <span className="text-5xl font-black text-foreground tabular-nums">{quantity}</span>
                  </div>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-14 h-14 flex items-center justify-center bg-white rounded-2xl text-primary shadow-md active:scale-90 transition-all hover:bg-primary hover:text-white"
                  >
                    <Plus className="w-6 h-6" strokeWidth={3} />
                  </button>
                </div>
              </div>

              {/* Enhanced Order Summary */}
              <div className="bg-white rounded-2xl p-4 border-2 border-primary/10 space-y-3 shadow-sm">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground text-sm font-bold">Unit Price</span>
                  <span className="font-bold">{product.price}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground text-sm font-bold">Total Quantity</span>
                  <span className="font-bold">{quantity} KG/Units</span>
                </div>
                <div className="pt-3 border-t border-dashed border-border flex justify-between items-end">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-muted-foreground font-black uppercase tracking-tighter">Total Amount</span>
                    <span className="text-3xl font-black text-primary">Rs. {(getPriceValue(product.price) * quantity).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <span className="text-[10px] text-muted-foreground font-black uppercase tracking-widest ml-1">Payment Method</span>
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => setPaymentMode('esewa')}
                    className={cn(
                      "flex flex-col items-center gap-1 p-3 rounded-2xl border-2 transition-all",
                      paymentMode === 'esewa' ? "bg-primary/5 border-primary" : "bg-white border-border/50 text-muted-foreground"
                    )}
                  >
                    <CreditCard className={cn("w-5 h-5", paymentMode === 'esewa' ? "text-primary" : "text-muted-foreground")} />
                    <span className="text-xs font-black">eSewa</span>
                  </button>
                  <button 
                    onClick={() => setPaymentMode('cod')}
                    className={cn(
                      "flex flex-col items-center gap-1 p-3 rounded-2xl border-2 transition-all",
                      paymentMode === 'cod' ? "bg-primary/5 border-primary" : "bg-white border-border/50 text-muted-foreground"
                    )}
                  >
                    <HandCoins className={cn("w-5 h-5", paymentMode === 'cod' ? "text-primary" : "text-muted-foreground")} />
                    <span className="text-xs font-black">Cash On Delivery</span>
                  </button>
                </div>
              </div>
            </div>

            <Button
              className="w-full h-16 rounded-2xl font-black text-xl shadow-xl shadow-primary/20 bg-primary hover:bg-primary/90 mt-4"
              onClick={confirmOrder}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Processing...</span>
                </div>
              ) : isSuccess ? (
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-6 h-6" />
                  <span>Success!</span>
                </div>
              ) : (
                <span>Confirm Order</span>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
