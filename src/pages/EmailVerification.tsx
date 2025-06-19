import { FiCheckCircle } from "react-icons/fi";

export default function EmailVerification() {
  return (
    <div className="flex items-center justify-center min-h-screen flex-col bg-yellow-50 px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-md mx-auto">
        <FiCheckCircle className="text-yellow-600 text-4xl sm:text-6xl mb-4 mx-auto" />
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
          Email Verification
        </h1>
        <p className="text-sm sm:text-lg text-gray-600 mb-3 leading-relaxed">
          Please check your email for the verification link. You can quit this
          tab.
        </p>
        <p className="text-sm sm:text-lg text-gray-600 leading-relaxed">
          If you don't see the verification email,{" "}
          <span className="text-yellow-600 font-medium">
            please check your spam folder.
          </span>
        </p>
      </div>
    </div>
  );
}
