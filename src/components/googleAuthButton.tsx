import { useNavigate } from "react-router-dom";
import { useFirebase } from "../context/firebaseProvider";
import { db } from "../context/firebaseProvider";
import { getDoc, doc, setDoc } from "firebase/firestore";

export default function GoogleAuthButton() {
  const { signInWithGoogle } = useFirebase();
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    try {
      const user = await signInWithGoogle();
      if (user) {
        // Check if email is verified (Google accounts are typically pre-verified)
        if (!user.emailVerified) {
          // For Google auth, this is unusual but handle it gracefully
          console.warn("Google account email not verified");
        }

        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);

        let userData;
        let isNewUser = false;
        
        if (docSnap.exists()) {
          // User exists - preserve their current role, update name and email
          const existingData = docSnap.data();
          userData = {
            name: user.displayName,
            email: user.email,
            role: existingData.role || "USER", // Keep existing role, default to USER if not found
          };
        } else {
          // New user - set default role as USER
          isNewUser = true;
          userData = {
            name: user.displayName,
            email: user.email,
            role: "USER",
          };
        }

        // Always update/overwrite user data
        await setDoc(docRef, userData);

        // Only register with backend for new users
        if (isNewUser) {
        try {
          const registerUser = await fetch(
            `${import.meta.env.VITE_APP_BASE_URL}register`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(userData),
            }
          );

          const data = await registerUser.json();
          if (data.user) {
            navigate("/");
          } else {
            throw new Error("User registration during db save failed");
          }
        } catch (error) {
          console.error("Error sending user data to server:", error);
          }
        } else {
          // Existing user - directly navigate to home
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
