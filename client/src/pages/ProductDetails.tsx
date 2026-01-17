import { Link, useRoute } from "wouter";
import { ArrowLeft, MapPin, Share2, ShieldCheck, Sprout, Droplets, Sun, Thermometer, MessageCircle, HelpCircle, BadgeCheck, Send, Minus, Plus, CreditCard, CheckCircle2 } from "lucide-react";
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

  const handleOrder = async () => {
    if (!user || !product) return;
    setIsPaymentModalOpen(true);
  };

  const confirmOrder = async () => {
    if (!user || !product) return;
    setIsProcessing(true);
    
    try {
      const totalPrice = parseFloat(product.price.replace(/[^0-9.]/g, '')) * quantity;
      
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
    <div className="bg-white min-h-screen pb-24">
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
           <Link href="/chat">
             <Button variant="outline" size="sm" className="rounded-full font-bold">Message</Button>
           </Link>
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

      {/* Professional Billing Section */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/95 backdrop-blur-md border-t border-border z-30 max-w-md mx-auto shadow-[0_-10px_40px_rgba(0,0,0,0.1)] md:rounded-t-3xl md:static md:shadow-none md:border-none md:px-0 md:bg-transparent">
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex flex-col flex-1">
              <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider mb-1.5">Quantity</span>
              <div className="flex items-center justify-between bg-muted/50 rounded-xl p-1 border border-border/50">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 flex items-center justify-center bg-white rounded-lg text-primary shadow-sm active:scale-90 transition-transform"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="font-bold text-lg">{quantity}</span>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 flex items-center justify-center bg-white rounded-lg text-primary shadow-sm active:scale-90 transition-transform"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex flex-col flex-1">
              <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider mb-1.5 text-right">Method</span>
              <div className="flex gap-1 bg-muted/50 rounded-xl p-1 border border-border/50">
                <button 
                  onClick={() => setPaymentMode('esewa')}
                  className={cn(
                    "flex-1 py-2 rounded-lg text-xs font-bold transition-all",
                    paymentMode === 'esewa' ? "bg-white text-primary shadow-sm" : "text-muted-foreground"
                  )}
                >eSewa</button>
                <button 
                  onClick={() => setPaymentMode('cod')}
                  className={cn(
                    "flex-1 py-2 rounded-lg text-xs font-bold transition-all",
                    paymentMode === 'cod' ? "bg-white text-primary shadow-sm" : "text-muted-foreground"
                  )}
                >COD</button>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between gap-4 pt-4 border-t border-border/50">
            <div className="flex-1">
              <p className="text-[10px] text-muted-foreground font-bold uppercase">Total</p>
              <p className="text-2xl font-black text-foreground">Rs. {(parseFloat(product.price.replace(/[^0-9.]/g, '')) * quantity).toLocaleString()}</p>
            </div>
            <Button 
              size="lg" 
              className="flex-[1.5] h-14 rounded-2xl font-bold shadow-xl shadow-primary/20 text-base active:scale-[0.98] transition-all bg-primary"
              onClick={handleOrder}
            >
               {paymentMode === 'esewa' ? 'Checkout' : 'Confirm Order'}
            </Button>
          </div>
        </div>
      </div>

      <Dialog open={isPaymentModalOpen} onOpenChange={setIsPaymentModalOpen}>
        <DialogContent className="sm:max-w-md rounded-3xl mx-4">
          <DialogHeader>
            <DialogTitle className="text-2xl font-serif">Complete Order</DialogTitle>
            <DialogDescription>
              Please review your order details before confirming.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="bg-muted/30 rounded-2xl p-4 border border-border/50 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground font-medium">Product</span>
                <span className="font-bold">{product.name}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground font-medium">Quantity</span>
                <span className="font-bold">{quantity} kg/units</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground font-medium">Payment Mode</span>
                <span className="font-bold uppercase text-primary">{paymentMode}</span>
              </div>
              <div className="pt-3 border-t border-border/50 flex justify-between items-end">
                <span className="text-xs text-muted-foreground font-bold uppercase">Total Amount</span>
                <span className="text-2xl font-black text-primary">Rs. {(parseFloat(product.price.replace(/[^0-9.]/g, '')) * quantity).toLocaleString()}</span>
              </div>
            </div>

            {paymentMode === 'esewa' && (
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-xl border border-green-100">
                <div className="bg-green-100 p-2 rounded-full">
                  <CreditCard className="w-5 h-5 text-green-600" />
                </div>
                <p className="text-xs text-green-700 font-medium">
                  You will be redirected to the secure eSewa payment gateway.
                </p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              className="w-full h-14 rounded-2xl font-bold text-lg shadow-xl shadow-primary/20"
              onClick={confirmOrder}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Processing...
                </div>
              ) : isSuccess ? (
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5" />
                  Order Success!
                </div>
              ) : (
                paymentMode === 'esewa' ? 'Pay Now via eSewa' : 'Place Order Now'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
