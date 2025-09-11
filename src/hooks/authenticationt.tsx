import { onAuthStateChanged } from "firebase/auth";
import { useState, useEffect } from "react";
import { auth, db } from "../context/firebaseProvider";
import { getDoc, doc } from "firebase/firestore";
import baseUrl from "./baseurl";

export default function useAuthenticate() {
  const [authenticated, setAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<any>(null);
  const [userRole, setUserRole] = useState<string | null>(() => {
    // Try to get cached user role from localStorage for instant access
    const cached = localStorage.getItem("userRole");
    return cached ? cached : null;
  });
  const [userLatitude, setUserLatitude] = useState<any>(null);
  const [userLongitude, setUserLongitude] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // User is authenticated, proceed without email verification check
        setAuthenticated(true);
        setUser(user);

        // Check if we have cached user data
        const cachedUserEmail = localStorage.getItem("userEmail");
        const cachedUserRole = localStorage.getItem("userRole");
        const cachedLatitude = localStorage.getItem("userLatitude");
        const cachedLongitude = localStorage.getItem("userLongitude");

        if (
          cachedUserEmail &&
          cachedUserRole &&
          user.email === cachedUserEmail &&
          cachedLatitude &&
          cachedLongitude
        ) {
          // Use cached data for instant access
          setUserRole(cachedUserRole);
          // Check for cached location data
          setUserLatitude(cachedLatitude);
          setUserLongitude(cachedLongitude);

          setLoading(false);
        } else {
          // Fetch fresh data from Firestore and API
          try {
            const userDoc = await getDoc(doc(db, "users", user.uid));
            if (userDoc.exists()) {
              const userData = userDoc.data();
              setUserRole(userData.role);

              // Cache the user data for future instant access
              localStorage.setItem("userRole", userData.role);
              localStorage.setItem("userEmail", userData.email);

              // Fetch user location from API
              try {
                const locationResponse = await fetch(
                  `${baseUrl}user/${user.email}`
                );
                if (locationResponse.ok) {
                  const locationData = await locationResponse.json();
                  const location = locationData.user.location as string;
                  if (location) {
                    const [lat, lon] = location
                      .split(",")
                      .map((coord) => coord.trim());
                    setUserLatitude(lat);
                    setUserLongitude(lon);
                    localStorage.setItem("userLatitude", lat);
                    localStorage.setItem("userLongitude", lon);
                    localStorage.setItem("userLocation", location);
                  }
                }
              } catch (locationError) {
                console.error("Error fetching user location:", locationError);
              }
            } else {
              throw new Error("No user document found");
            }
          } catch (error) {
            console.error("Error fetching user data:", error);
            // Clear invalid cached data
            localStorage.removeItem("userRole");
            localStorage.removeItem("userEmail");
            localStorage.removeItem("userLatitude");
            localStorage.removeItem("userLongitude");
            localStorage.removeItem("locationDialogShown");
          }
          setLoading(false);
        }
      } else {
        setUser(null);
        setAuthenticated(false);
        setUserRole(null);
        setUserLatitude(null);
        setUserLongitude(null);
        // Clear cached data on logout
        localStorage.removeItem("userRole");
        localStorage.removeItem("userEmail");
        localStorage.removeItem("userLatitude");
        localStorage.removeItem("userLongitude");
        localStorage.removeItem("userLocation");
        localStorage.removeItem("userSkippedLocation");
        localStorage.removeItem("locationDialogShown");
        localStorage.removeItem("locationLoginPromptShown");
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  return {
    authenticated,
    user,
    userRole,
    userLatitude,
    userLongitude,
    loading,
  };
}
