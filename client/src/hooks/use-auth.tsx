import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { auth, googleProvider, signInWithPopup, onAuthStateChanged, signOut, db } from "@/lib/firebase";
import { User } from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp, initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from "firebase/firestore";

interface AuthContextType {
  user: (User & { isSetupComplete?: boolean }) | null;
  isLoading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<(User & { isSetupComplete?: boolean }) | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        console.log("Auth State Changed: User Logged In", firebaseUser.uid);
        
        // Non-blocking Firestore sync
        const syncUser = async () => {
          try {
            const userDocRef = doc(db, "users", firebaseUser.uid);
            const userDoc = await getDoc(userDocRef);
            const userData = userDoc.exists() ? userDoc.data() : null;
            
            setUser({
              ...firebaseUser,
              displayName: userData?.displayName || firebaseUser.displayName,
              photoURL: userData?.photoURL || firebaseUser.photoURL,
              isSetupComplete: userData?.isSetupComplete || false
            } as any);

            // Update presence in background
            setDoc(userDocRef, {
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              isOnline: true,
              lastActive: serverTimestamp()
            }, { merge: true }).catch(err => console.error("Presence sync failed", err));
          } catch (error) {
            console.error("Firestore sync error:", error);
            setUser(firebaseUser as any);
          } finally {
            setIsLoading(false);
          }
        };

        syncUser();
      } else {
        console.log("Auth State Changed: No User");
        setUser(null);
        setIsLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const login = async () => {
    try {
      console.log("Starting Google Login...");
      const result = await signInWithPopup(auth, googleProvider);
      console.log("Login successful:", result.user.email);
    } catch (error: any) {
      console.error("Login failed:", error);
      alert(`Login failed: ${error.message}`);
    }
  };

  const logout = async () => {
    try {
      if (user) {
        await setDoc(doc(db, "users", user.uid), {
          isOnline: false,
          lastActive: serverTimestamp()
        }, { merge: true }).catch(() => {});
      }
      await signOut(auth);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
