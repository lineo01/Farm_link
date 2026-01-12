import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { auth, googleProvider, signInWithPopup, onAuthStateChanged, signOut, db } from "@/lib/firebase";
import { User } from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp, enableNetwork, disableNetwork } from "firebase/firestore";

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
    let unsubscribe: (() => void) | undefined;
    
    const initAuth = async () => {
      try {
        await enableNetwork(db);
      } catch (e) {
        console.error("Failed to enable network", e);
      }

      unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        try {
          if (firebaseUser) {
            // Update user presence/data immediately to establish "online" status
            try {
              await setDoc(doc(db, "users", firebaseUser.uid), {
                uid: firebaseUser.uid,
                email: firebaseUser.email,
                lastActive: serverTimestamp(),
                isOnline: true,
              }, { merge: true });
            } catch (e) {
              console.error("Failed to set online status", e);
            }

            // Get user data from Firestore to check setup status
            let userData;
            try {
              const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
              userData = userDoc.data();
            } catch (e) {
              console.error("Failed to get user data", e);
            }
            
            setUser({
              ...firebaseUser,
              displayName: userData?.displayName || firebaseUser.displayName,
              photoURL: userData?.photoURL || firebaseUser.photoURL,
              isSetupComplete: userData?.isSetupComplete || false
            } as any);
          } else {
            setUser(null);
          }
        } catch (error) {
          console.error("Auth state change error:", error);
        } finally {
          setIsLoading(false);
        }
      });
    };

    initAuth();
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const login = async () => {
    try {
      await enableNetwork(db);
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const logout = async () => {
    try {
      if (user) {
        await setDoc(doc(db, "users", user.uid), {
          isOnline: false,
          lastActive: serverTimestamp()
        }, { merge: true });
      }
      await signOut(auth);
    } catch (error) {
      console.error("Logout error:", error);
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
