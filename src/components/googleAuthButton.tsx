import { useNavigate } from "react-router-dom";
import { useFirebase } from "../context/firebaseProvider";

export default function GoogleAuthButton() {
    const { signInWithGoogle } = useFirebase();
    const navigate = useNavigate();

    const handleGoogleSignIn = async () => {
        try {
            const user = await signInWithGoogle();
            if (user) {
                const userData = {
                    name: user.displayName,
                    email: user.email,
                };

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
                        throw new Error(
                            "User registration during db save failed"
                        );
                    }
                } catch (error) {
                    console.error("Error sending user data to server:", error);
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
                <img
                    src="/google.svg"
                    alt="Google Logo"
                    className="w-5 h-5 mr-2"
                />
                Google
            </button>
        </div>
    );
}
