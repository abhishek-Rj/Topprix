import React, { useState } from "react";
import { useFirebase } from "../context/firebaseProvider";
import { useNavigate } from "react-router-dom";
import { FiMail, FiLock } from "react-icons/fi";
import { ReactTyped } from "react-typed";

export default function Login() {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [emailError, setEmailError] = useState<boolean>(false);
    const [passwordError, setPasswordError] = useState<boolean>(false);
    const { logInWithEmailandPassword, signInWithGoogle } = useFirebase();
    const navigate = useNavigate();

    const validateEmail = (email: string): boolean => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setEmailError(false);
        setPasswordError(false);

        if (!validateEmail(email)) {
            setEmailError(true);
            setError("Please enter a valid email.");
            setLoading(false);
            return;
        }

        if (password.length < 6) {
            setPasswordError(true);
            setError("Password must be at least 6 characters long.");
            setLoading(false);
            return;
        }

        try {
            const user = await logInWithEmailandPassword(email, password);
            if (user) {
                navigate("/");
            } else {
                setError("User not created");
            }
        } catch (error) {
            console.error(error);
            setError("Failed to create account");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-yellow-50 p-4">
            <div className="max-w-5xl w-full flex flex-col md:flex-row gap-6">
                {/* Left Side */}
                <div className="flex flex-col p-6 md:p-10 bg-yellow-600 rounded-xl shadow-xl w-full md:w-1/2 relative">
                    <div className="flex items-center space-x-2 md:absolute top-5 left-5">
                        <img
                            src="./logowb.png"
                            width={50}
                            height={50}
                            alt="Company Logo"
                            className="rounded-lg hover:scale-105 transition-transform"
                        />
                        <div className="font-sans text-2xl md:text-3xl font-bold text-white hover:scale-105 transition-transform">
                            Topprix
                        </div>
                    </div>

                    <div className="flex md:hidden justify-center items-center mt-6">
                        <h2 className="text-lg font-bold text-white text-center">
                            All Best{" "}
                            <span className="text-black">
                                <ReactTyped
                                    strings={["Deals", "Offers", "Discounts"]}
                                    typeSpeed={100}
                                    backSpeed={50}
                                    backDelay={1000}
                                    loop
                                />
                            </span>{" "}
                            , One Place
                        </h2>
                    </div>

                    <div className="hidden md:flex flex-col justify-center h-full mt-10">
                        <h2 className="text-3xl font-bold text-white">
                            All Best{" "}
                            <ReactTyped
                                strings={["Deals", "Offers", "Discounts"]}
                                typeSpeed={100}
                                backSpeed={50}
                                backDelay={1000}
                                loop
                                className="text-black"
                            />
                            , One Place
                        </h2>
                        <p className="mt-4 text-white text-lg">
                            Save big with exclusive offers and discounts from
                            your favorite brands.
                        </p>
                    </div>
                </div>

                {/* Right Side - Signup Form */}
                <div className="w-full md:w-1/2 p-8 bg-white rounded-xl shadow-xl">
                    <h2 className="text-2xl font-bold text-gray-800 text-center">
                        Login your Account
                    </h2>
                    <p className="text-center text-gray-600 hover:scale-105 transition-transform  mt-2">
                        Don't have an account?{" "}
                        <a
                            href="/signup"
                            className="text-yellow-600 hover:underline"
                        >
                            Sign Up
                        </a>
                    </p>

                    <form className="mt-6 space-y-4" onSubmit={handleSignUp}>
                        {error && (
                            <p className="text-red-600 text-sm">{error}</p>
                        )}

                        <div className="relative">
                            <FiMail className="absolute hover:scale-110 transition-transform left-3 top-3 text-gray-400" />
                            <input
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className={`w-full hover:scale-105 transition-transform pl-10 p-2 border rounded-md focus:ring-yellow-500 focus:border-yellow-500 
                                    ${emailError ? "border-red-500" : ""}`}
                                required
                            />
                        </div>

                        <div className="relative">
                            <FiLock className="absolute hover:scale-110 transition-transform left-3 top-3 text-gray-400" />
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className={`w-full hover:scale-105 transition-transform pl-10 p-2 border rounded-md focus:ring-yellow-500 focus:border-yellow-500 
                                    ${passwordError ? "border-red-500" : ""}`}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className={`w-full hover:scale-105 transition-transform py-2 text-white font-semibold rounded-md 
                                ${
                                    loading
                                        ? "bg-orange-400"
                                        : "bg-yellow-600 hover:bg-yellow-700"
                                }`}
                            disabled={loading}
                        >
                            {loading
                                ? "Logging into your account..."
                                : "Sign Up"}
                        </button>
                    </form>

                    <div className="mt-6 flex justify-center">
                        <button
                            onClick={() => {
                                signInWithGoogle().then((user) => {
                                    if (user) {
                                        navigate("/");
                                    }
                                });
                            }}
                            type="button"
                            className="flex hover:scale-105 transition-transform items-center justify-center w-full py-2 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-100"
                        >
                            <img
                                src="/google.svg"
                                alt="Google Logo"
                                className="w-5 h-5 mr-2"
                            />
                            Continue with Google
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
