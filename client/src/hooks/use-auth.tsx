import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { auth, googleProvider, signInWithPopup, onAuthStateChanged, signOut, db } from "@/lib/firebase";
import { User } from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";

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
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          // Get user data from Firestore to check setup status
          const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
          const userData = userDoc.data();
          
          setUser({
            ...firebaseUser,
            displayName: userData?.displayName || firebaseUser.displayName,
            photoURL: userData?.photoURL || firebaseUser.photoURL,
            isSetupComplete: userData?.isSetupComplete || false
          } as any);

          // Update user presence/data
          await setDoc(doc(db, "users", firebaseUser.uid), {
            displayName: userData?.displayName || firebaseUser.displayName,
            photoURL: userData?.photoURL || firebaseUser.photoURL,
            email: firebaseUser.email,
            lastActive: serverTimestamp(),
            isOnline: true,
            isSetupComplete: userData?.isSetupComplete || false
          }, { merge: true });
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Auth state change error:", error);
        // Fallback for offline or restricted access
        if (firebaseUser) {
          setUser({
            ...firebaseUser,
            isSetupComplete: false // Assume incomplete if we can't check
          } as any);
        } else {
          setUser(null);
        }
      } finally {
        setIsLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const login = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const logout = async () => {
    if (user) {
      await setDoc(doc(db, "users", user.uid), {
        isOnline: false,
        lastActive: serverTimestamp()
      }, { merge: true });
    }
    await signOut(auth);
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
