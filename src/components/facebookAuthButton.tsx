import { useFirebase } from "../context/firebaseProvider";
import { useNavigate } from "react-router-dom";

export default function FacebookAuthButton() {
    const { signInWithFacebook } = useFirebase();
    const navigate = useNavigate();

    const handleClickwithFacebook = async () => {
        try {
            const user = await signInWithFacebook();
            if (user) {
                const userData = {
                    name: user.displayName,
                    email: user.email,
                };

                try {
                    const registerUser = await fetch(
                        `https://server.topprix.re/register`,
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
                            "User registration durind db save failed"
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
