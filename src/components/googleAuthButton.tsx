import { useNavigate } from "react-router-dom";
import { useFirebase } from "../context/firebaseProvider";
import { db } from "../context/firebaseProvider";
import { getDoc, doc, setDoc } from "firebase/firestore";
import baseUrl from "@/hooks/baseurl";

export default function GoogleAuthButton() {
  const { signInWithGoogle } = useFirebase();
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    try {
      const user = await signInWithGoogle();
      if (user) {
        console.log("Google user signed in:", user.email);
        
        // Store user email in localStorage for API requests
        if (user.email) {
          localStorage.setItem("userEmail", user.email);
        }

        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);

        let userData;
        let isNewUser = false;

        if (docSnap.exists()) {
          console.log("User exists in Firestore");
          // User exists - preserve their current role, update name and email
          const existingData = docSnap.data();
          userData = {
            name: user.displayName,
            email: user.email,
            role: existingData.role || "USER", // Keep existing role, default to USER if not found
          };
        } else {
          console.log("New user detected - registering with backend");
          isNewUser = true;
          userData = {
            name: user.displayName,
            email: user.email,
            role: "USER",
          };
        }

        // Only register with backend for new users
        if (isNewUser) {
          try {
            console.log("Registering new user with backend:", user.email);
            const registerUser = await fetch(`${baseUrl}register`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "user-email": user.email || "",
              },
              body: JSON.stringify({
                username: user.displayName,
                email: user.email,
                phone: "", // Google auth doesn't provide phone, so we'll leave it empty
                role: "USER",
              }),
            });

            const data = await registerUser.json();
            console.log("Backend registration response:", data);
            
            if (data.user) {
              console.log("User successfully registered with backend");
              // Create/update user in Firestore after successful backend registration
              await setDoc(docRef, userData);
              navigate("/");
            } else {
              throw new Error("User registration during db save failed");
            }
          } catch (error) {
            console.error("Error sending user data to server:", error);
            // Still create user in Firestore even if backend fails
            await setDoc(docRef, userData);
            navigate("/");
          }
        } else {
          console.log("Existing user - updating Firestore and navigating");
          // Existing user - update Firestore and navigate
          await setDoc(docRef, userData);
          navigate("/");
        }
      }
    } catch (error) {
      console.error("Error while signing in with Google:", error);
    }
  };
  return (
    <div className="mt-6 flex justify-center">
      <button
        onClick={handleGoogleSignIn}
        type="button"
        className="flex hover:scale-105 transition-transform  items-center justify-center w-full py-1 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-100"
      >
        <img src="/google.svg" alt="Google Logo" className="w-5 h-5 mr-2" />
        Google
      </button>
    </div>
  );
}
