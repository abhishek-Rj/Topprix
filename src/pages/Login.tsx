import React, { useState } from "react";
import { auth, useFirebase } from "../context/firebaseProvider";
import { useNavigate } from "react-router-dom";
import { FiMail, FiLock } from "react-icons/fi";
import { ReactTyped } from "react-typed";
import { useTranslation } from "react-i18next";
import GoogleAuthButton from "../components/googleAuthButton";
import FacebookAuthButton from "../components/facebookAuthButton";
import Input from "../components/Input";
import { getDoc, doc } from "firebase/firestore";
import { db } from "../context/firebaseProvider";
import { toast } from "react-toastify";
import baseUrl from "@/hooks/baseurl";

export default function Login() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [emailError, setEmailError] = useState<boolean>(false);
  const [passwordError, setPasswordError] = useState<boolean>(false);
  const { logInWithEmailandPassword } = useFirebase();
  const navigate = useNavigate();
  const { t } = useTranslation();

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
      setError(t("Enter a valid email address"));
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setPasswordError(true);
      setError(t("Enter a password with 6 or more characters"));
      setLoading(false);
      return;
    }

    try {
      // First, check if user exists in the database
      const checkForUser = await fetch(`${baseUrl}user/${email}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!checkForUser.ok) {
        setError("User not found. Please check your email or sign up.");
        setLoading(false);
        return;
      }

      const checkForUserResponse = await checkForUser.json();
      
      // Check if user exists
      if (!checkForUserResponse) {
        setError("User not found. Please check your email or sign up.");
        setLoading(false);
        return;
      }

      // Check if email is verified
      if (!checkForUserResponse.emailVerified) {
        setError("Please verify your email before logging in. Check your inbox for verification link.");
        setLoading(false);
        return;
      }

      // If user exists and is verified, proceed with login
      try {
        const userCredential = await logInWithEmailandPassword(email, password);
        const checkEmailVerification  = await fetch(`${baseUrl}user/${email}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!checkEmailVerification.ok) {
          setError("Something went wrong. Please try again.");
          setLoading(false);
          return;
        }
        const checkEmailVerificationResponse = await checkEmailVerification.json();
        if (!checkEmailVerificationResponse.emailVerified) {
          setError("Please verify your email before logging in. Check your inbox for verification link.");
          setLoading(false);
          return;
        }
        await userCredential.reload()
        if (userCredential) {
          // Double-check Firebase email verification
          if (userCredential.emailVerified) {
            toast.success("Login successful!");
            navigate("/");
          } else {
            // Firebase user exists but email not verified
            await auth.signOut();
            setError("Please verify your email before logging in. Check your inbox for verification link.");
            setLoading(false);
            return;
          }
        } else {
          setError("Invalid email or password. Please try again.");
          setLoading(false);
          return;
        }
      } catch (firebaseError: any) {
        console.error("Firebase login error:", firebaseError);
        
        // Handle specific Firebase auth errors
        if (firebaseError.code === 'auth/user-not-found') {
          setError("User not found. Please check your email or sign up.");
        } else if (firebaseError.code === 'auth/wrong-password') {
          setError("Incorrect password. Please try again.");
        } else if (firebaseError.code === 'auth/too-many-requests') {
          setError("Too many failed attempts. Please try again later.");
        } else if (firebaseError.code === 'auth/user-disabled') {
          setError("This account has been disabled. Please contact support.");
        } else if (firebaseError.code === 'auth/invalid-email') {
          setError("Invalid email format. Please check your email address.");
        } else {
          setError("Login failed. Please check your credentials and try again.");
        }
        setLoading(false);
        return;
      }

    } catch (error) {
      console.error("Error during login:", error);
      setError("Network error. Please check your connection and try again.");
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
              {t("allBest")}{" "}
              <span className="text-black">
                <ReactTyped
                  strings={[t("discount"), t("offer")]}
                  typeSpeed={100}
                  backSpeed={50}
                  backDelay={1000}
                  loop
                />
              </span>{" "}
              , {t("onePlace")}
            </h2>
          </div>

          <div className="hidden md:flex flex-col justify-center h-full mt-10">
            <h2 className="text-3xl font-bold text-white">
              {t("allBest")}{" "}
              <ReactTyped
                strings={[t("discount"), t("offer")]}
                typeSpeed={100}
                backSpeed={50}
                backDelay={1000}
                loop
                className="text-black"
              />
              , {t("onePlace")}
            </h2>
            <p className="mt-4 text-white text-lg">{t("shortDescription")}</p>
          </div>
        </div>

        <div className="w-full md:w-1/2 p-8 bg-white rounded-xl shadow-xl">
          <h2 className="text-2xl font-bold text-gray-800 text-center">
            {t("login")}
          </h2>
          <p className="text-center text-gray-600 hover:scale-105 transition-transform mt-2">
            {t("accountExist")}{" "}
            <a href="/signup" className="text-yellow-600 hover:underline">
              {t("signUp")}
            </a>
          </p>

          <form className="mt-6 space-y-4" onSubmit={handleSignUp}>
            {error && <p className="text-red-600 bg-red-200 p-2 rounded-md text-sm">{error}</p>}

            <div className="relative">
              <FiMail className="absolute hover:scale-110 transition-transform left-3 top-3 text-gray-400" />
              <Input
                value={email}
                setValue={setEmail}
                type="email"
                placeholder={t("email")}
                className={emailError ? "border-red-500" : ""}
              />
            </div>

            <div className="relative">
              <FiLock className="absolute hover:scale-110 transition-transform left-3 top-3 text-gray-400" />
              <Input
                value={password}
                setValue={setPassword}
                type="password"
                placeholder={t("password")}
                className={passwordError ? "border-red-500" : ""}
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
              {loading ? t("loggingIn") : t("login")}
            </button>
          </form>

          <div className="mt-6 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">
                {t("continueWith")}
              </span>
            </div>
          </div>

          <GoogleAuthButton />
          <FacebookAuthButton />
        </div>
      </div>
    </div>
  );
}
