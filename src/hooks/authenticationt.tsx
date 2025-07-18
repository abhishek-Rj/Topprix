import { onAuthStateChanged } from "firebase/auth";
import { useState, useEffect } from "react";
import { auth, db } from "../context/firebaseProvider";
import { getDoc, doc } from "firebase/firestore";

export default function useAuthenticate() {
  const [authenticated, setAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<any>(null);
  const [userRole, setUserRole] = useState<string | null>(() => {
    // Try to get cached user role from localStorage for instant access
    const cached = localStorage.getItem('userRole');
    return cached ? cached : null;
  });
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // User is authenticated, proceed without email verification check
        setAuthenticated(true);
        setUser(user);
        
        // Check if we have cached user data
        const cachedUserEmail = localStorage.getItem('userEmail');
        const cachedUserRole = localStorage.getItem('userRole');
        
        if (cachedUserEmail && cachedUserRole && user.email === cachedUserEmail) {
          // Use cached data for instant access
          setUserRole(cachedUserRole);
          setLoading(false);
        } else {
          // Fetch fresh data from Firestore
          try {
            const userDoc = await getDoc(doc(db, "users", user.uid));
            if (userDoc.exists()) {
              const userData = userDoc.data();
              setUserRole(userData.role);
              
              // Cache the user data for future instant access
              localStorage.setItem('userRole', userData.role);
              localStorage.setItem('userEmail', userData.email);
            } else {
              throw new Error("No user document found");
            }
          } catch (error) {
            console.error("Error fetching user data:", error);
            // Clear invalid cached data
            localStorage.removeItem('userRole');
            localStorage.removeItem('userEmail');
          }
          setLoading(false);
        }
      } else {
        setUser(null);
        setAuthenticated(false);
        setUserRole(null);
        // Clear cached data on logout
        localStorage.removeItem('userRole');
        localStorage.removeItem('userEmail');
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  return { authenticated, user, userRole, loading };
}
