import { useEffect, useState } from "react";
import { FiCheckCircle, FiMail } from "react-icons/fi";
import { auth } from "@/context/firebaseProvider";
import { useNavigate } from "react-router-dom";
import { sendEmailVerification } from "firebase/auth";
import { toast } from "react-toastify";

export default function EmailVerification() {
  const navigate = useNavigate();
  const [isResending, setIsResending] = useState(false);
  const [pollingInterval, setPollingInterval] = useState<number | null>(null);

  useEffect(() => {
    // Start polling to check if email is verified
    const interval = setInterval(async () => {
      try {
        // Reload the user to get the latest email verification status
        await auth.currentUser?.reload();
        
        if (auth.currentUser?.emailVerified) {
          // Email is verified, stop polling and redirect to login
          clearInterval(interval);
          toast.success("Email verified successfully! Please login.");
          navigate("/login");
        }
      } catch (error) {
        console.error("Error checking email verification:", error);
      }
    }, 3000); // Check every 3 seconds

    setPollingInterval(interval);

    // Cleanup interval on component unmount
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [navigate]);

  const handleResendEmail = async () => {
    if (!auth.currentUser) {
      toast.error("No user found. Please sign up again.");
      navigate("/signup");
      return;
    }

    setIsResending(true);
    try {
      await sendEmailVerification(auth.currentUser);
      toast.success("Verification email sent successfully!");
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

  const handleBackToLogin = () => {
    auth.signOut();
    navigate("/login");
  };

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
            onClick={handleBackToLogin}
          >
            Back to Login
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
