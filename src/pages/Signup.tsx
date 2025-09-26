import { useState, useRef } from "react";
import { useFirebase } from "../context/firebaseProvider";
import { useNavigate } from "react-router-dom";
import { FiMail, FiPhone, FiLock } from "react-icons/fi";
import { ReactTyped } from "react-typed";
import { MdOutlinePerson } from "react-icons/md";
import { useTranslation } from "react-i18next";
import GoogleAuthButton from "../components/googleAuthButton";
import FacebookAuthButton from "../components/facebookAuthButton";
import Input from "../components/Input";
import { toast } from "react-toastify";
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
      const checkUserResponse = await fetch(`${baseUrl}user/${email}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (checkUserResponse.ok) {
        const existingUser = await checkUserResponse.json();

        // If user exists, show error message
        if (existingUser) {
          setError(
            "An account with this email already exists. Please login instead."
          );
          setLoading(false);
          return;
        }
      }

      // Create user in Firebase first
      const userCredential = await signUpUserWithEmailAndPassword(
        name,
        email,
        phone,
        password,
        roleRef.current.value
      );

      if (!userCredential || !userCredential.user) {
        throw new Error("Failed to create Firebase user");
      }

      // Create user in the database
      const registerUserResponse = await fetch(`${baseUrl}register`, {
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
      });

      const data = await registerUserResponse.json();
      if (!data.user) {
        // If database registration fails, delete the Firebase user
        try {
          await userCredential.user.delete();
        } catch (deleteErr) {
          console.error(
            "Error deleting Firebase user after database failure:",
            deleteErr
          );
        }
        throw new Error("Failed to register user in database");
      }

      toast.success("Account created successfully! Please login.");
      navigate("/login");
    } catch (error: any) {
      console.error("Error during sign-up:", error);

      // Handle specific Firebase errors
      if (error.code === "auth/email-already-in-use") {
        setError(
          "An account with this email already exists. Please login instead."
        );
      } else if (error.code === "auth/weak-password") {
        setPasswordError(true);
        setError("Password is too weak. Please choose a stronger password.");
      } else if (error.code === "auth/invalid-email") {
        setEmailError(true);
        setError("Please enter a valid email address.");
      } else {
        setError("Failed to create account. Please try again.");
      }
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
              Topprix.mu
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
            {error && (
              <p className="text-red-600 bg-red-300 rounded-md text-sm p-2">
                {error}
              </p>
            )}

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
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("selectRole")}
              </label>
              <select
                ref={roleRef}
                className={`w-full hover:scale-105 transition-transform pl-10 p-2 border rounded-md focus:ring-yellow-500 focus:border-yellow-500 
                                    ${roleError ? "border-red-500" : ""}`}
                required
              >
                <option value="">{t("rolePlaceholder")}</option>
                <option value="USER">{t("customer")}</option>
                <option value="RETAILER">{t("retailer")}</option>
              </select>
            </div>

            {/* Privacy Policy Checkbox */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="privacy-policy"
                required
                className="w-4 h-4 text-yellow-600 border-gray-300 rounded focus:ring-yellow-500"
              />
              <label htmlFor="privacy-policy" className="text-xs text-gray-600">
                {t("privacyAccept")}{" "}
                <a
                  href="/privacy"
                  className="text-yellow-600 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t("privacyPolicy")}
                </a>
              </label>
            </div>

            {/* Terms and Conditions Checkbox */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="terms-conditions"
                required
                className="w-4 h-4 text-yellow-600 border-gray-300 rounded focus:ring-yellow-500"
              />
              <label
                htmlFor="terms-conditions"
                className="text-xs text-gray-600"
              >
                {t("termsAccept")}{" "}
                <a
                  href="/terms"
                  className="text-yellow-600 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t("termsOfUse")}
                </a>
              </label>
            </div>

            {/* General Conditions Checkbox */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="general-conditions"
                required
                className="w-4 h-4 text-yellow-600 border-gray-300 rounded focus:ring-yellow-500"
              />
              <label
                htmlFor="general-conditions"
                className="text-xs text-gray-600"
              >
                {t("generalConditionsAccept")}{" "}
                <a
                  href="/general-conditions"
                  className="text-yellow-600 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t("generalConditions")}
                </a>
              </label>
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

          {/* Privacy Policy Link */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              {t("accountCreationNote")}{" "}
              <a
                href="/privacy"
                className="text-yellow-600 hover:underline hover:text-yellow-700 transition-colors"
              >
                {t("privacyPolicy")}
              </a>
            </p>
          </div>
        </div>
      </div>
      <div id="recaptcha-container"></div>
    </div>
  );
}
