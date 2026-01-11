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

        if (!userData) {
          await setDoc(doc(db, "users", firebaseUser.uid), {
            displayName: firebaseUser.displayName,
            photoURL: firebaseUser.photoURL,
            email: firebaseUser.email,
            lastActive: serverTimestamp(),
            isOnline: true,
            isSetupComplete: false
          }, { merge: true });
        } else {
          await setDoc(doc(db, "users", firebaseUser.uid), {
            isOnline: true,
            lastActive: serverTimestamp()
          }, { merge: true });
        }
      } else {
        setUser(null);
      }
      setIsLoading(false);
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
