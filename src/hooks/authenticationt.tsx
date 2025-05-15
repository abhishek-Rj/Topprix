import { onAuthStateChanged } from "firebase/auth";
import { useState, useEffect } from "react";
import { auth, db } from "../context/firebaseProvider";
import { useNavigate } from "react-router-dom";
import { getDoc, doc } from "firebase/firestore";

export default function useAuthenticate() {
  const [authenticated, setAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<any>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUserRole(userData.role);
          } else {
            throw new Error("No user document found");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
        setAuthenticated(true);
        setUser(user);
      } else {
        navigate("/login");
        setUser(null);
        setAuthenticated(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { authenticated, user, userRole, loading };
}
