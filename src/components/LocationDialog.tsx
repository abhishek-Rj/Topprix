import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { FiMapPin, FiHash, FiGlobe, FiX } from "react-icons/fi";
import { toast } from "react-toastify";
import baseUrl from "../hooks/baseurl";
import useAuthenticate from "../hooks/authenticationt";

interface LocationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onLocationSet: () => void;
}

export default function LocationDialog({
  isOpen,
  onClose,
  onLocationSet,
}: LocationDialogProps) {
  const { t } = useTranslation();
  const { user, userRole } = useAuthenticate();
  const [zipCode, setZipCode] = useState("");
  const [country, setCountry] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Get coordinates from zip code and country
  const getCoordinates = async (zip: string, countryCode: string) => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/geo/1.0/zip?zip=${zip},${countryCode}&appid=663dbc9ffe2e08f3f82073649c5a6373`
      );
      const data = await response.json();
      if (data.cod === "404") {
        throw new Error("Location not found");
      }
      return {
        lat: data.lat,
        lon: data.lon,
      };
    } catch (error) {
      throw new Error("Error getting coordinates");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!zipCode || !country) {
      toast.error("Please fill in all required fields.");
      setIsLoading(false);
      return;
    }

    try {
      const coordinates = await getCoordinates(zipCode, country);

      if (user && userRole === "USER") {
        // Update user profile via API
        const updateResponse = await fetch(
          `${baseUrl}user/update/${user.email}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              location: `${coordinates.lat}, ${coordinates.lon}`,
            }),
          }
        );

        if (!updateResponse.ok) {
          throw new Error("Failed to update user location");
        }

        toast.success("Location updated successfully!");
        // Clear skip flag since user has now provided location
        localStorage.removeItem("userSkippedLocation");
        // Clear dialog shown flag to allow dialog to appear again if needed
        localStorage.removeItem("locationDialogShown");
        onLocationSet();
        onClose();
      } else {
        // Store in localStorage for non-logged in users
        localStorage.setItem(
          "userLocation",
          `${coordinates.lat}, ${coordinates.lon}`
        );
        localStorage.setItem("userLatitude", coordinates.lat.toString());
        localStorage.setItem("userLongitude", coordinates.lon.toString());

        toast.success("Location saved!");
        // Clear skip flag since user has now provided location
        localStorage.removeItem("userSkippedLocation");
        // Clear dialog shown flag to allow dialog to appear again if needed
        localStorage.removeItem("locationDialogShown");
        onLocationSet();
        onClose();
      }
    } catch (error: any) {
      toast.error("Could not save location. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = () => {
    // Store skip flag to prevent dialog from showing again
    localStorage.setItem("userSkippedLocation", "true");
    // Clear dialog shown flag to allow dialog to appear again if needed
    localStorage.removeItem("locationDialogShown");

    if (user && userRole === "USER") {
      // For logged in users, we'll skip for now
      onLocationSet();
      onClose();
    } else {
      // For non-logged in users, store empty values in localStorage
      localStorage.setItem("userLocation", "");
      localStorage.setItem("userLatitude", "");
      localStorage.setItem("userLongitude", "");
      onLocationSet();
      onClose();
    }
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
                  {t("location.setYourLocation")}
                </h3>
                <p className="text-sm text-gray-600">
                  {t("location.helpUsPersonalize")}
                </p>
              </div>
            </div>
            <button
              onClick={handleSkip}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-gray-100"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-4">
            <div className="group relative">
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                {t("location.zipCode")} <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <FiHash />
                </span>
                <input
                  type="text"
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                  placeholder={t("location.enterZipCode")}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all group-hover:shadow-md"
                  required
                />
              </div>
            </div>

            <div className="group relative">
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                {t("location.country")} <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <FiGlobe />
                </span>
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all group-hover:shadow-md appearance-none"
                  required
                >
                  <option value="">{t("location.selectCountry")}</option>
                  <optgroup label="North America">
                    <option value="US">🇺🇸 United States</option>
                    <option value="CA">🇨🇦 Canada</option>
                  </optgroup>
                  <optgroup label="Europe">
                    <option value="GB">🇬🇧 United Kingdom</option>
                    <option value="FR">🇫🇷 France</option>
                    <option value="DE">🇩🇪 Germany</option>
                    <option value="IT">🇮🇹 Italy</option>
                    <option value="ES">🇪🇸 Spain</option>
                    <option value="PT">🇵🇹 Portugal</option>
                    <option value="NL">🇳🇱 Netherlands</option>
                    <option value="BE">🇧🇪 Belgium</option>
                    <option value="SE">🇸🇪 Sweden</option>
                    <option value="NO">🇳🇴 Norway</option>
                    <option value="DK">🇩🇰 Denmark</option>
                    <option value="IE">🇮🇪 Ireland</option>
                    <option value="PL">🇵🇱 Poland</option>
                    <option value="RO">🇷🇴 Romania</option>
                    <option value="BG">🇧🇬 Bulgaria</option>
                    <option value="GR">🇬🇷 Greece</option>
                    <option value="CZ">🇨🇿 Czech Republic</option>
                    <option value="SK">🇸🇰 Slovakia</option>
                    <option value="HU">🇭🇺 Hungary</option>
                    <option value="RU">🇷🇺 Russia</option>
                    <option value="TR">🇹🇷 Turkey</option>
                  </optgroup>
                  <optgroup label="Middle East">
                    <option value="SA">🇸🇦 Saudi Arabia</option>
                    <option value="AE">🇦🇪 United Arab Emirates</option>
                    <option value="QA">🇶🇦 Qatar</option>
                    <option value="KW">🇰🇼 Kuwait</option>
                    <option value="OM">🇴🇲 Oman</option>
                    <option value="BH">🇧🇭 Bahrain</option>
                  </optgroup>
                  <optgroup label="Asia Pacific">
                    <option value="IN">🇮🇳 India</option>
                    <option value="AU">🇦🇺 Australia</option>
                    <option value="NZ">🇳🇿 New Zealand</option>
                  </optgroup>
                </select>
              </div>
            </div>
          </div>

          {/* Privacy Notice */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <div className="text-blue-600 mt-0.5">
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <p className="text-xs text-blue-800">
                {t("location.privacyNotice")}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button
              type="button"
              onClick={handleSkip}
              className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              {t("location.skipForNow")}
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-lg transition-all hover:scale-105 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? t("location.saving") : t("location.saveLocation")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
