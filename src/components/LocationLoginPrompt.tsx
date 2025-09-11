import { useTranslation } from "react-i18next";
import { FiMapPin, FiX, FiLogIn, FiUserPlus } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

interface LocationLoginPromptProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LocationLoginPrompt({
  isOpen,
  onClose,
}: LocationLoginPromptProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleLogin = () => {
    onClose();
    navigate("/login");
  };

  const handleSignup = () => {
    onClose();
    navigate("/signup");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-200 rounded-t-xl px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-blue-500 text-white">
                <FiMapPin className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  {t("location.locationBasedFeatures")}
                </h3>
                <p className="text-sm text-gray-600">
                  {t("location.loginRequired")}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-gray-100"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="text-center">
            <div className="mb-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <FiMapPin className="w-8 h-8 text-blue-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                {t("location.getLocationBasedOffers")}
              </h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                {t("location.locationBenefits")}
              </p>
            </div>

            <div className="bg-blue-50 rounded-lg p-4 mb-6">
              <h5 className="font-semibold text-blue-900 mb-2">
                {t("location.whatYouGet")}
              </h5>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• {t("location.nearbyStores")}</li>
                <li>• {t("location.localDeals")}</li>
                <li>• {t("location.personalizedOffers")}</li>
                <li>• {t("location.locationBasedCoupons")}</li>
              </ul>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleLogin}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FiLogIn className="w-4 h-4" />
              {t("location.login")}
            </button>
            <button
              onClick={handleSignup}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
            >
              <FiUserPlus className="w-4 h-4" />
              {t("location.signup")}
            </button>
          </div>

          <div className="text-center">
            <button
              onClick={onClose}
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              {t("location.maybeLater")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
