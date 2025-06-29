import React, { useState, useRef, useEffect } from "react";
import { useFirebase } from "../context/firebaseProvider";
import { useNavigate } from "react-router-dom";
import { FiMail, FiPhone, FiLock, FiCheckCircle } from "react-icons/fi";
import { ReactTyped } from "react-typed";
import { MdOutlinePerson } from "react-icons/md";
import { useTranslation } from "react-i18next";
import GoogleAuthButton from "../components/googleAuthButton";
import FacebookAuthButton from "../components/facebookAuthButton";
import Input from "../components/Input";
import { auth } from "../context/firebaseProvider";
import { toast } from "react-toastify";
import { sendEmailVerification } from "firebase/auth";
import baseUrl from "@/hooks/baseurl";

export default function Signup() {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [emailError, setEmailError] = useState<boolean>(false);
  const [phoneError, setPhoneError] = useState<boolean>(false);
  const [passwordError, setPasswordError] = useState<boolean>(false);
  const [roleError, setRoleError] = useState<boolean>(false);
  const [showVerification, setShowVerification] = useState<boolean>(false);
  const [isResending, setIsResending] = useState<boolean>(false);
  const [pollingInterval, setPollingInterval] = useState<number | null>(null);

  const roleRef = useRef<HTMLSelectElement>(null);
  const { signUpUserWithEmailAndPassword } = useFirebase();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const validateEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    return /^[0-9]{10}$/.test(phone);
  };

  // Start polling for email verification when verification view is shown
  useEffect(() => {
    if (showVerification) {
      const interval = setInterval(async () => {
        try {
          let isVerified = false;
          
          if (auth.currentUser) {
            // Handle Firebase user
            await auth.currentUser.reload();
            isVerified = auth.currentUser.emailVerified;
          } else {
            // Handle existing unverified user from database
            const statusResponse = await fetch(
              `${baseUrl}user/${email}`,
              {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                },
              }
            );
            
            if (statusResponse.ok) {
              const userData = await statusResponse.json();
              isVerified = userData.emailVerified;
            }
          }
          
          if (isVerified) {
            clearInterval(interval);
            
            // Update email verification status in database
            const updateEmailVerification = await fetch(`${baseUrl}user/${email}`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ emailVerified: true }),
            });

            if (updateEmailVerification.ok) {
              toast.success("Email verified successfully! Please login.");
              if (auth.currentUser) {
                await auth.signOut();
              }
              navigate("/login");
            } else {
              throw new Error("Failed to update email verification");
            }
          }
        } catch (error) {
          console.error("Error checking email verification:", error);
        }
      }, 3000);

      setPollingInterval(interval);

      return () => {
        if (interval) {
          clearInterval(interval);
        }
      };
    }
  }, [showVerification, navigate, email]);

  const handleResendEmail = async () => {
    setIsResending(true);
    try {
      // Check if we have a Firebase user or need to handle existing unverified user
      if (auth.currentUser) {
        await sendEmailVerification(auth.currentUser);
        toast.success("Verification email sent successfully!");
      } else {
        // Handle existing unverified user from database
        const resendResponse = await fetch(
          `${baseUrl}resend-verification`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: email,
            }),
          }
        );
        
        if (resendResponse.ok) {
          toast.success("Verification email sent successfully!");
        } else {
          throw new Error("Failed to send verification email");
        }
      }
    } catch (error: any) {
      console.error("Error sending verification email:", error);
      if (error.code === 'auth/too-many-requests') {
        toast.error("Too many requests. Please wait a few minutes before trying again.");
      } else {
        toast.error("Failed to send verification email. Please try again.");
      }
    } finally {
      setIsResending(false);
    }
  };

  const handleBackToSignup = () => {
    auth.signOut();
    setShowVerification(false);
    // Reset form fields
    setName("");
    setEmail("");
    setPhone("");
    setPassword("");
    if (roleRef.current) {
      roleRef.current.value = "";
    }
  };

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setEmailError(false);
    setPasswordError(false);
    setRoleError(false);

    if (!validateEmail(email)) {
      setEmailError(true);
      setError("Please enter a valid email.");
      setLoading(false);
      return;
    }

    if (!validatePhone(phone)) {
      setPhoneError(true);
      setError("Please enter a valid phone number.");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setPasswordError(true);
      setError("Password must be at least 6 characters long.");
      setLoading(false);
      return;
    }

    if (!roleRef.current?.value) {
      setRoleError(true);
      setError("Please select a role.");
      setLoading(false);
      return;
    }

    try {
      // First, check if user already exists in the database
      const checkUserResponse = await fetch(
        `${baseUrl}user/${email}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (checkUserResponse.ok) {
        const existingUser = await checkUserResponse.json();
        
        // If user exists, show error message
        if (existingUser) {
          setError("An account with this email already exists. Please login instead.");
          setLoading(false);
          return;
        }
      }

      // If user doesn't exist or other conditions, proceed with normal signup
      const registerUserResponse = await fetch(
        `${baseUrl}register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: name,
            email,
            phone,
            role: roleRef.current.value,
          }),
        }
      );

      const data = await registerUserResponse.json();
      if (!data.user) {
        throw new Error("Failed to register user");
      }

      const userCredential = await signUpUserWithEmailAndPassword(
        name,
        email,
        phone,
        password,
        roleRef.current.value
      );
      if (!userCredential || !userCredential.user) {
        throw new Error("Failed to create user");
      }

      try {
        await sendEmailVerification(userCredential.user);
        toast.success("Verification email sent! Please check your inbox.");
        setShowVerification(true);
      } catch (err) {
        console.error("Error sending verification email:", err);
        try {
          await userCredential.user.delete();
        } catch (deleteErr) {
          console.error(
            "Error deleting user after failed verification:",
            deleteErr
          );
        }
        throw new Error("Failed to send verification email. Please try again.");
      }

    } catch (error) {
      console.error("Error during sign-up:", error);
      setError("Failed to create account");
    } finally {
      setLoading(false);
    }
  };

  // Show verification view
  if (showVerification) {
    return (
      <div className="flex items-center justify-center min-h-screen flex-col bg-yellow-50 px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-md mx-auto">
          <FiMail className="text-yellow-600 text-4xl sm:text-6xl mb-4 mx-auto" />
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
            Email Verification Required
          </h1>
          <p className="text-sm sm:text-lg text-gray-600 mb-6 leading-relaxed">
            Please check your email for the verification link. You must verify your email before you can access the application.
          </p>
          
          <div className="space-y-4">
            <button 
              className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleResendEmail}
              disabled={isResending}
            >
              {isResending ? "Sending..." : "Resend Verification Email"}
            </button>
            
            <button 
              className="w-full bg-gray-600 hover:bg-gray-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
              onClick={handleBackToSignup}
            >
              Back to Signup
            </button>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> We're automatically checking for verification. Once verified, you'll be redirected to login.
            </p>
          </div>

          <p className="text-sm text-gray-600 mt-4">
            If you don't see the verification email,{" "}
            <span className="text-yellow-600 font-medium">
              please check your spam folder.
            </span>
          </p>
        </div>
      </div>
    );
  }

  // Show signup form
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
              <span className="text-black min-w-[100px] inline-block text-center whitespace-nowrap">
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
            {t("createAccount")}
          </h2>
          <p className="text-center hover:scale-105 transition-transform  text-gray-600 mt-2">
            {t("accountExist")}{" "}
            <a href="/login" className="text-yellow-600  hover:underline">
              {t("signIn")}
            </a>
          </p>

          <form className="mt-6 space-y-4" onSubmit={handleSignUp}>
            {error && <p className="text-red-600 bg-red-300 rounded-md text-sm p-2">{error}</p>}

            <div className="relative">
              <MdOutlinePerson className="absolute hover:scale-110 transition-transform left-3 top-3 text-gray-400" />
              <Input value={name} setValue={setName} placeholder={t("name")} />
            </div>

            <div className="relative">
              <FiMail className="absolute hover:scale-110 transition-transform left-3 top-3 text-gray-400" />
              <Input
                value={email}
                setValue={setEmail}
                className={emailError ? "border-red-500" : ""}
                type="email"
                placeholder={t("email")}
              />
            </div>

            <div className="relative">
              <FiPhone className="absolute hover:scale-110 transition-transform left-3 top-3 text-gray-400" />
              <Input
                value={phone}
                setValue={setPhone}
                className={phoneError ? "border-red-500" : ""}
                type="tel"
                placeholder={t("phone")}
              />
            </div>

            <div className="relative">
              <FiLock className="absolute hover:scale-110 transition-transform  left-3 top-3 text-gray-400" />
              <Input
                value={password}
                setValue={setPassword}
                className={passwordError ? "border-red-500 border-2" : ""}
                type="password"
                placeholder={t("password")}
              />
            </div>

            <div className="relative">
              <select
                ref={roleRef}
                className={`w-full hover:scale-105 transition-transform pl-10 p-2 border rounded-md focus:ring-yellow-500 focus:border-yellow-500 
                                    ${roleError ? "border-red-500" : ""}`}
                required
              >
                <option value="">{t("selectRole")}</option>
                <option value="USER">{t("customer")}</option>
                <option value="RETAILER">{t("retailer")}</option>
              </select>
            </div>

            <button
              type="submit"
              className={`w-full hover:scale-105 transition-transform  py-2 text-white font-semibold rounded-md 
                                ${
                                  loading
                                    ? "bg-yellow-300"
                                    : "bg-yellow-600 hover:bg-yellow-700"
                                }`}
              disabled={loading}
            >
              {loading ? t("creatingAccount") : t("signUp")}
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
      <div id="recaptcha-container"></div>
    </div>
  );
}
