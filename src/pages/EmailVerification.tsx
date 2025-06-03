import { useEffect } from "react";
import { FiCheckCircle } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export default function EmailVerification() {
  const navigate = useNavigate();
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/login");
    }, 7000);

    return () => clearTimeout(timer);
  }, []);
  return (
    <div className="flex items-center justify-center h-screen flex-col bg-yellow-50">
      <FiCheckCircle className="text-yellow-600 text-6xl mb-4" />
      <h1 className="text-2xl font-bold text-gray-900">Email Verification</h1>
      <p className="text-lg text-gray-600">
        Please check your email for the verification link.
      </p>
    </div>
  );
}
