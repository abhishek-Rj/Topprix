import { useFirebase } from "../context/firebaseProvider";
import { useNavigate } from "react-router-dom";
import baseUrl from "@/hooks/baseurl";

export default function FacebookAuthButton() {
    const { signInWithFacebook } = useFirebase();
    const navigate = useNavigate();

    const handleClickwithFacebook = async () => {
        try {
            const user = await signInWithFacebook();
            if (user) {
                // Store user email in localStorage for API requests
                if (user.email) {
                    localStorage.setItem("userEmail", user.email);
                }

                try {
                    const registerUser = await fetch(
                        `${baseUrl}register`,
                        {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                "user-email": user.email || "",
                            },
                            body: JSON.stringify({
                                username: user.displayName,
                                email: user.email,
                                phone: "", // Facebook auth doesn't provide phone, so we'll leave it empty
                                role: "USER",
                            }),
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
            console.error("Error while signing in with Facebook:", error);
        }
    };
    return (
        <div className="mt-6 flex justify-center">
            <button
                onClick={handleClickwithFacebook}
                type="button"
                className="flex hover:scale-105 transition-transform  items-center justify-center w-full py-1 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-100"
            >
                <img
                    src="/facebook.svg"
                    alt="Facebook Logo"
                    className="w-5 h-5 mr-2"
                />
                Facebook
            </button>
        </div>
    );
}
