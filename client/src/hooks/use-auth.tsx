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
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log("Auth State Changed:", firebaseUser ? "User Logged In" : "No User");
      
      if (firebaseUser) {
        // Step 1: Immediately set the basic user object to unlock the UI
        setUser(firebaseUser as any);
        setIsLoading(false);

        // Step 2: Try to get profile data from Firestore
        try {
          const userDocRef = doc(db, "users", firebaseUser.uid);
          const userDoc = await getDoc(userDocRef);
          
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUser(prev => prev ? ({
              ...prev,
              displayName: userData.displayName || prev.displayName,
              photoURL: userData.photoURL || prev.photoURL,
              isSetupComplete: userData.isSetupComplete || false
            }) : null as any);
          }

          // Step 3: Update online status (don't wait for it)
          setDoc(userDocRef, {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            isOnline: true,
            lastActive: serverTimestamp()
          }, { merge: true }).catch(err => console.warn("Status update failed", err));

        } catch (error) {
          console.error("Firestore sync error:", error);
          // UI is already unlocked by Step 1, so the user can still use the app
        }
      } else {
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
      
      // Step: Ensure user document exists in Firestore
      const userDocRef = doc(db, "users", result.user.uid);
      const userDoc = await getDoc(userDocRef);
      if (!userDoc.exists()) {
        await setDoc(userDocRef, {
          uid: result.user.uid,
          email: result.user.email,
          displayName: result.user.displayName,
          photoURL: result.user.photoURL,
          isOnline: true,
          isSetupComplete: false,
          lastActive: serverTimestamp()
        });
      }
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
