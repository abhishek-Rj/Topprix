import { useEffect, useState } from "react";
import { getDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../context/firebaseProvider";
import Navigation from "../components/navigation";
import Loader from "../components/loading";
import { useTranslation } from "react-i18next";
import { TiDelete } from "react-icons/ti";
import { useFirebase } from "../context/firebaseProvider";
import { IoLocationOutline } from "react-icons/io5";
import {
  FiUser,
  FiMail,
  FiTag,
  FiEdit,
  FiSave,
  FiX,
  FiLogOut,
  FiClock,
  FiShield,
  FiCreditCard,
  FiCheckCircle,
  FiAlertCircle,
  FiCalendar,
  FiStar,
  FiZap,
  FiEye,
  FiSettings,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import userLogout from "@/hooks/userLogout";
import baseUrl from "@/hooks/baseurl";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import useAuthenticate from "@/hooks/authenticationt";

interface PricingPlan {
  id: string;
  name: string;
  description: string;
  stripePriceId: string;
  amount: number;
  currency: string;
  interval: string;
  features: string[];
  maxStores: number | null;
  maxFlyers: number | null;
  maxCoupons: number | null;
  createdAt: string;
  updatedAt: string;
}

interface Subscription {
  id: string;
  userId: string;
  pricingPlanId: string;
  stripeSubscriptionId: string;
  status: string;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  createdAt: string;
  updatedAt: string;
  pricingPlan: PricingPlan;
}

interface UserSubscription {
  subscription: Subscription;
  user: {
    id: string;
    email: string;
    name: string;
    hasActiveSubscription: boolean;
    subscriptionStatus: string;
    currentPeriodEnd: string;
  };
}

export default function Profile() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { deleteAccountwithCredentials, deleteAccountwithProviders } =
    useFirebase();
  const { user: authUser, userRole, loading } = useAuthenticate();
  const [user, setUser] = useState<any>(null);
  const [password, setPassword] = useState<string>("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);
  const [loader, setLoader] = useState<boolean>(true);
  const [editing, setEditing] = useState<boolean>(false);
  const [editingName, setEditingName] = useState<boolean>(false);
  const [editedName, setEditedName] = useState<string>("");
  const [editedLocation, setEditedLocation] = useState<string>("");
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [accountCreatedDate, setAccountCreatedDate] = useState<Date | null>(
    null
  );
  const [subscription, setSubscription] = useState<UserSubscription | null>(
    null
  );
  const [subscriptionLoading, setSubscriptionLoading] =
    useState<boolean>(false);
  const [showAuthPreview, setShowAuthPreview] = useState<boolean>(false);
  const [formattedLocation, setFormattedLocation] = useState<string>("");
  const [editingLocation, setEditingLocation] = useState<boolean>(false);
  const [zipCode, setZipCode] = useState<string>("");
  const [country, setCountry] = useState<string>("");
  const [deleting, setDeleting] = useState<boolean>(false);

  // Function to get coordinates from zip code and country (same as createNewStore)
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

  // Function to get formatted address from coordinates using OpenCage API
  const getFormattedAddress = async (coordinates: string) => {
    if (!coordinates) return "";

    try {
      const response = await fetch(
        `https://api.opencagedata.com/geocode/v1/json?q=${coordinates}&key=17632a4f83e446c79e94ce690a4551d4`
      );
      const data = await response.json();

      if (data.results && data.results.length > 0) {
        return data.results[0].formatted;
      }
    } catch (error) {
      console.error("Error fetching formatted address:", error);
    }

    return coordinates; // Fallback to original coordinates if API fails
  };

  useEffect(() => {
    if (loading) return;

    if (!authUser) {
      setShowAuthPreview(true);
      setLoader(false);
      return;
    }

    const fetchUserData = async () => {
      try {
        // Fetch user data from API
        const userResponse = await fetch(`${baseUrl}user/${authUser.email}`, {
          headers: {
            "user-email": authUser.email || "",
          },
        });
        if (userResponse.ok) {
          const userData = await userResponse.json();
          const apiUserData = userData.user;

          // Get Firestore data for additional fields
          const userDoc = await getDoc(doc(db, "users", authUser.uid));
          const firestoreData = userDoc.exists() ? userDoc.data() : {};

          // Combine API and Firestore data
          const combinedUserData = {
            ...firestoreData,
            ...apiUserData,
            location: apiUserData.location || firestoreData.location || "",
          };

          setUser(combinedUserData);
          setEditedLocation(combinedUserData.location || "");
          setEditedName(combinedUserData.name || "");

          // Get formatted address from coordinates
          if (combinedUserData.location) {
            const formattedAddress = await getFormattedAddress(
              combinedUserData.location
            );
            setFormattedLocation(formattedAddress);
          }

          if (combinedUserData.createdAt) {
            const createdAt = combinedUserData.createdAt.toDate
              ? combinedUserData.createdAt.toDate()
              : new Date(combinedUserData.createdAt);
            setAccountCreatedDate(createdAt);
          }

          // Fetch subscription data for retailers
          if (combinedUserData.role === "RETAILER" && authUser.email) {
            await fetchUserSubscription(authUser.email);
          }
        } else {
          // Fallback to Firestore if API fails
          const userDoc = await getDoc(doc(db, "users", authUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUser(userData);
            setEditedLocation(userData.location || "");
            setEditedName(userData.name || "");

            // Get formatted address from coordinates
            if (userData.location) {
              const formattedAddress = await getFormattedAddress(
                userData.location
              );
              setFormattedLocation(formattedAddress);
            }

            if (userData.createdAt) {
              const createdAt = userData.createdAt.toDate
                ? userData.createdAt.toDate()
                : new Date(userData.createdAt);
              setAccountCreatedDate(createdAt);
            }

            // Fetch subscription data for retailers
            if (userData.role === "RETAILER" && authUser.email) {
              await fetchUserSubscription(authUser.email);
            }
          } else {
            console.log("No user document found");
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoader(false);
      }
    };

    fetchUserData();
  }, [authUser, loading, navigate]);

  const fetchUserSubscription = async (email: string) => {
    setSubscriptionLoading(true);
    try {
      // Get the user ID from the backend using email
      const userResponse = await fetch(`${baseUrl}user/${email}`, {
        headers: {
          "user-email": email,
        },
      });
      if (!userResponse.ok) {
        throw new Error("Failed to fetch user data");
      }
      const userData = await userResponse.json();

      // Then fetch the subscription using the backend user ID
      const subscriptionResponse = await fetch(
        `${baseUrl}api/users/${userData.id}/subscription`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "user-email": localStorage.getItem("userEmail") || "",
          },
        }
      );
      if (subscriptionResponse.ok) {
        const subscriptionData = await subscriptionResponse.json();
        const formattedData = subscriptionData.subscription
          ? subscriptionData
          : { subscription: subscriptionData };
        setSubscription(formattedData);
      }
    } catch (error) {
      console.error("Error fetching subscription:", error);
    } finally {
      setSubscriptionLoading(false);
    }
  };

  const handleOnClickDelete = async () => {
    if (!authUser) return;

    try {
      setDeleting(true);
      const userEmailHeader = localStorage.getItem("userEmail") || authUser.email || "";
      
      // Delete user from local database using backend API
      const userDelete = await fetch(
        `${baseUrl}user/delete/${authUser.email}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "user-email": userEmailHeader,
            "Authorization": `Bearer ${await authUser.getIdToken()}`,
          },
        }
      );

      if (!userDelete.ok) {
        const errorData = await userDelete.json();
        throw new Error(errorData.message || "Failed to delete user from database");
      }

      // After successful database deletion, delete from Firebase
      try {
        let userDeleteFirebase: any = null;
        if (authUser.providerData[0].providerId === "password") {
          userDeleteFirebase = await deleteAccountwithCredentials(password);
        } else if (authUser.providerData[0].providerId === "google.com") {
          userDeleteFirebase = await deleteAccountwithProviders("google");
        } else {
          userDeleteFirebase = await deleteAccountwithProviders("facebook");
        }

        console.log("Firebase account deleted successfully:", userDeleteFirebase);
      } catch (firebaseError: any) {
        console.error("Failed to delete Firebase account:", firebaseError);
        // Still proceed since database deletion was successful
        alert(`Account deleted from database, but Firebase deletion failed: ${firebaseError?.message || "Unknown error"}`);
      }

      // Clear localStorage
      localStorage.removeItem("userEmail");
      
      // Navigate to signup page
      navigate("/signup");
    } catch (error: any) {
      console.error("Error deleting user account:", error);
      // Show error message to user
      alert(`Failed to delete account: ${error?.message || "Unknown error"}`);
    } finally {
      setDeleting(false);
    }
  };

  const handleSave = async () => {
    if (!authUser) return;

    setIsSaving(true);
    setError(null);

    try {
      const updateUser = await fetch(
        `${baseUrl}user/update/${authUser?.email}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: editedName,
            location: editedLocation,
          }),
        }
      );

      const data = await updateUser.json();
      if (!data.user) {
        throw new Error("Failed to update user data");
      }
      await updateDoc(doc(db, "users", authUser.uid), {
        name: editedName,
        location: editedLocation,
      });

      // Update formatted location if location was changed
      if (editedLocation) {
        const formattedAddress = await getFormattedAddress(editedLocation);
        setFormattedLocation(formattedAddress);
      }
    } catch (error: any) {
      console.error("Error updating profile:", error);
      setError(error.message || "Failed to update profile");
    } finally {
      setIsSaving(false);
    }
    setEditing(false);
    window.location.reload();
  };

  const handleNameSave = async () => {
    if (!authUser) return;

    setIsSaving(true);
    setError(null);

    try {
      const updateUser = await fetch(
        `${baseUrl}user/update/${authUser?.email}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: editedName,
          }),
        }
      );

      const data = await updateUser.json();
      if (!data.user) {
        throw new Error("Failed to update user name");
      }
      await updateDoc(doc(db, "users", authUser.uid), {
        name: editedName,
      });

      // Update user state
      setUser((prev: any) => ({
        ...prev,
        name: editedName,
      }));

      setEditingName(false);
    } catch (error: any) {
      console.error("Error updating name:", error);
      setError(error.message || "Failed to update name");
    } finally {
      setIsSaving(false);
    }
  };

  const handleLocationSave = async () => {
    if (!authUser || !zipCode || !country) {
      setError("Please fill in all required fields.");
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      // Get coordinates from zip code and country
      const coordinates = await getCoordinates(zipCode, country);

      // Update user location via API
      const updateUser = await fetch(
        `${baseUrl}user/update/${authUser?.email}`,
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

      const data = await updateUser.json();
      if (!data.user) {
        throw new Error("Failed to update user location");
      }

      // Update Firestore
      await updateDoc(doc(db, "users", authUser.uid), {
        location: `${coordinates.lat}, ${coordinates.lon}`,
      });

      // Get formatted address
      const formattedAddress = await getFormattedAddress(
        `${coordinates.lat}, ${coordinates.lon}`
      );
      setFormattedLocation(formattedAddress);
      setEditedLocation(`${coordinates.lat}, ${coordinates.lon}`);

      // Update user state
      setUser((prev: any) => ({
        ...prev,
        location: `${coordinates.lat}, ${coordinates.lon}`,
      }));

      setEditingLocation(false);
      setZipCode("");
      setCountry("");
    } catch (error: any) {
      console.error("Error updating location:", error);
      setError(error.message || "Failed to update location");
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await userLogout();
      window.location.reload();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };

  const formatSubscriptionDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };

  const getSubscriptionStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-100 text-green-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      case "EXPIRED":
        return "bg-yellow-100 text-yellow-800";
      case "INCOMPLETE":
        return "bg-orange-100 text-orange-800";
      case "INCOMPLETE_EXPIRED":
        return "bg-red-100 text-red-800";
      case "PAST_DUE":
        return "bg-yellow-100 text-yellow-800";
      case "TRIALING":
        return "bg-blue-100 text-blue-800";
      case "UNPAID":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getSubscriptionIcon = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return <FiCheckCircle className="w-4 h-4" />;
      case "CANCELLED":
        return <FiX className="w-4 h-4" />;
      case "EXPIRED":
        return <FiAlertCircle className="w-4 h-4" />;
      case "INCOMPLETE":
        return <FiClock className="w-4 h-4" />;
      case "INCOMPLETE_EXPIRED":
        return <FiX className="w-4 h-4" />;
      case "PAST_DUE":
        return <FiAlertCircle className="w-4 h-4" />;
      case "TRIALING":
        return <FiStar className="w-4 h-4" />;
      case "UNPAID":
        return <FiX className="w-4 h-4" />;
      default:
        return <FiClock className="w-4 h-4" />;
    }
  };

  // Authentication Preview Modal Component
  const AuthPreviewModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl w-full mx-2 sm:mx-4 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-3 sm:px-4 md:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FiUser className="text-white text-lg sm:text-xl md:text-2xl mr-2 sm:mr-3" />
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white">
                {t("navigation.profile")}
              </h2>
            </div>
            <button
              onClick={() => setShowAuthPreview(false)}
              className="text-white hover:text-gray-200 transition-colors p-1"
            >
              <FiX size={20} className="sm:w-6 sm:h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-3 sm:p-4 md:p-6">
          <div className="text-center mb-4 sm:mb-6">
            <FiSettings className="mx-auto text-4xl sm:text-5xl md:text-6xl text-gray-300 mb-3 sm:mb-4" />
            <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800 mb-2">
              {t("profile.loginRequired")}
            </h3>
            <p className="text-xs sm:text-sm md:text-base text-gray-600 leading-relaxed px-2 sm:px-0">
              {t("profile.loginRequiredMessage")}
            </p>
          </div>

          {/* Features Preview */}
          <div className="bg-blue-50 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
            <h4 className="font-semibold text-gray-800 mb-2 sm:mb-3 flex items-center text-sm sm:text-base">
              <FiEye className="mr-2 text-blue-600" />
              {t("profile.profileFeatures")}
            </h4>
            <ul className="text-xs sm:text-sm text-gray-600 space-y-1 sm:space-y-2">
              <li className="flex items-center">
                <FiUser className="mr-2 text-blue-500 text-xs" />
                {t("profile.featureManagePersonalInfo")}
              </li>
              <li className="flex items-center">
                <FiShield className="mr-2 text-green-500 text-xs" />
                {t("profile.featureSecuritySettings")}
              </li>
              <li className="flex items-center">
                <FiCreditCard className="mr-2 text-purple-500 text-xs" />
                {t("profile.featureTrackSubscriptions")}
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 sm:space-y-3">
            <button
              onClick={() => navigate("/login")}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 sm:py-3 px-3 sm:px-4 rounded-lg transition-colors flex items-center justify-center text-sm sm:text-base"
            >
              <FiUser className="mr-2 w-4 h-4 sm:w-5 sm:h-5" />
              {t("login")}
            </button>

            <button
              onClick={() => navigate("/signup")}
              className="w-full bg-white hover:bg-gray-50 text-gray-700 font-medium py-2 sm:py-3 px-3 sm:px-4 rounded-lg border border-gray-300 transition-colors text-sm sm:text-base"
            >
              {t("signUp")}
            </button>

            <button
              onClick={() => {
                setShowAuthPreview(false);
                navigate("/");
              }}
              className="w-full text-gray-500 hover:text-gray-700 font-medium py-1.5 sm:py-2 px-3 sm:px-4 transition-colors text-xs sm:text-sm"
            >
              {t("back")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  if (loader) {
    return (
      <div
        className={`min-h-screen w-full ${
          user?.role === "ADMIN"
            ? "bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50"
            : "bg-yellow-50"
        }`}
      >
        <Navigation />
        <Loader />
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen ${
        user?.role === "ADMIN"
          ? "bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50"
          : "bg-yellow-50"
      }`}
    >
      <Navigation />
      {showAuthPreview && <AuthPreviewModal />}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        {/* Profile Header */}
        <div
          className={`rounded-t-xl py-8 px-6 sm:px-10 text-white shadow-md ${
            user?.role === "ADMIN"
              ? "bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600"
              : "bg-gradient-to-r from-yellow-600 to-amber-500"
          }`}
        >
          <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg">
              <span
                className={`text-4xl font-bold ${
                  user?.role === "ADMIN" ? "text-blue-600" : "text-yellow-600"
                }`}
              >
                {user?.name?.charAt(0).toUpperCase() ||
                  user?.email?.charAt(0).toUpperCase() ||
                  "?"}
              </span>
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-3xl font-bold">
                {user?.name || t("profile.user")}
              </h1>
              <p
                className={`mt-1 ${
                  user?.role === "ADMIN" ? "text-blue-100" : "text-yellow-100"
                }`}
              >
                {user?.email}
              </p>
              <div className="mt-3">
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium text-white ${
                    user?.role === "ADMIN" ? "bg-blue-800" : "bg-yellow-800"
                  }`}
                >
                  <FiTag className="mr-1" />
                  {user?.role === "ADMIN"
                    ? t("profile.admin")
                    : user?.role === "RETAILER"
                    ? t("profile.retailer")
                    : t("profile.customer")}
                </span>
                {accountCreatedDate && (
                  <span
                    className={`ml-2 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium text-white ${
                      user?.role === "ADMIN" ? "bg-blue-800" : "bg-yellow-800"
                    }`}
                  >
                    <FiClock className="mr-1" />
                    {t("profile.memberSince")}: {formatDate(accountCreatedDate)}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Profile Content */}
        <div className="bg-white rounded-b-xl shadow-md">
          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
              <div className="flex">
                <div className="flex-1">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
                <button onClick={() => setError(null)} className="text-red-500">
                  <FiX />
                </button>
              </div>
            </div>
          )}

          {/* Subscription Section */}
          {subscription && subscription.subscription?.pricingPlan && (
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">
                  {t("profile.currentSubscription")}
                </h2>
                <Badge
                  className={`${getSubscriptionStatusColor(
                    subscription.user?.subscriptionStatus
                  )} flex items-center gap-1`}
                >
                  {getSubscriptionIcon(subscription.user?.subscriptionStatus)}
                  {subscription.user?.subscriptionStatus}
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Plan Details */}
                <Card className="bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <FiCreditCard className="mr-2 text-purple-600" />
                      {subscription.subscription?.pricingPlan?.name} - €
                      {subscription.subscription?.pricingPlan?.amount}/
                      {subscription.subscription?.pricingPlan?.interval}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">
                          {subscription.subscription?.pricingPlan?.amount}€
                        </div>
                        <div className="text-sm text-gray-600">
                          {t("profile.monthlyCost")}
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                          {subscription.subscription?.pricingPlan?.features
                            ?.length || 0}
                        </div>
                        <div className="text-sm text-gray-600">
                          {t("profile.features")}
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">
                          {subscription.user?.currentPeriodEnd
                            ? Math.ceil(
                                (new Date(
                                  subscription.user?.currentPeriodEnd
                                ).getTime() -
                                  new Date().getTime()) /
                                  (1000 * 60 * 60 * 24)
                              )
                            : 0}
                        </div>
                        <div className="text-sm text-gray-600">
                          {t("profile.daysRemaining")}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Subscription Details */}
                <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <FiCalendar className="mr-2 text-blue-600" />
                      {t("profile.subscriptionDetails")}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">
                          {t("profile.price")}:
                        </span>
                        <span className="font-semibold">
                          €{subscription.subscription?.pricingPlan?.amount}/
                          {subscription.subscription?.pricingPlan?.interval}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">
                          {t("profile.currency")}:
                        </span>
                        <span className="font-semibold">
                          {subscription.subscription?.pricingPlan?.currency?.toUpperCase()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">
                          {t("profile.autoRenew")}:
                        </span>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            subscription.subscription?.cancelAtPeriodEnd
                              ? "bg-red-100 text-red-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {subscription.subscription?.cancelAtPeriodEnd
                            ? t("profile.willCancel")
                            : t("profile.active")}
                        </span>
                      </div>
                      {subscription.subscription?.currentPeriodStart && (
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">
                            {t("profile.currentPeriodStart")}:
                          </span>
                          <span className="font-semibold">
                            {formatSubscriptionDate(
                              subscription.subscription?.currentPeriodStart
                            )}
                          </span>
                        </div>
                      )}
                      {subscription.subscription?.currentPeriodEnd && (
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">
                            {t("profile.currentPeriodEnd")}:
                          </span>
                          <span className="font-semibold">
                            {formatSubscriptionDate(
                              subscription.subscription?.currentPeriodEnd
                            )}
                          </span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Plan Features */}
              <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 mt-6">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <FiZap className="mr-2 text-green-600" />
                    {t("profile.planFeatures")}
                  </CardTitle>
                  <CardDescription>
                    {t("profile.whatsIncluded")}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {subscription.subscription?.pricingPlan?.features?.map(
                      (feature: string, index: number) => (
                        <div key={index} className="flex items-center">
                          <FiCheckCircle className="w-4 h-4 text-green-500 mr-2" />
                          <span className="text-sm">{feature}</span>
                        </div>
                      )
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Personal Information */}
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">
                {t("profile.personalInfo")}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-10">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("profile.name")}
                </label>
                {editingName ? (
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiUser className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={editedName}
                      onChange={(e) => setEditedName(e.target.value)}
                      className={`focus:ring-2 focus:ring-offset-2 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2 px-3 border ${
                        user?.role === "ADMIN"
                          ? "focus:ring-blue-500 focus:border-blue-500"
                          : "focus:ring-yellow-500 focus:border-yellow-500"
                      }`}
                    />
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <FiUser className="text-gray-400 mr-2" />
                      <span className="text-gray-800">{user?.name || "—"}</span>
                    </div>
                    <button
                      onClick={() => setEditingName(true)}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <FiEdit className="w-4 h-4" />
                    </button>
                  </div>
                )}
                {editingName && (
                  <div className="mt-2 flex gap-2">
                    <button
                      onClick={handleNameSave}
                      disabled={isSaving}
                      className={`flex items-center px-3 py-1 rounded-md text-white text-sm font-medium ${
                        isSaving
                          ? "bg-gray-400 cursor-not-allowed"
                          : user?.role === "ADMIN"
                          ? "bg-blue-600 hover:bg-blue-700"
                          : "bg-yellow-600 hover:bg-yellow-700"
                      }`}
                    >
                      {isSaving ? (
                        <>
                          <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-1"></div>
                          {t("profile.saving")}
                        </>
                      ) : (
                        <>
                          <FiSave className="mr-1" />
                          {t("profile.save")}
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => {
                        setEditingName(false);
                        setEditedName(user?.name || "");
                      }}
                      className="flex items-center px-3 py-1 rounded-md text-gray-600 bg-gray-100 hover:bg-gray-200 text-sm font-medium"
                    >
                      <FiX className="mr-1" />
                      {t("profile.cancel")}
                    </button>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("profile.email")}
                </label>
                <div className="flex items-center">
                  <FiMail className="text-gray-400 mr-2" />
                  <span className="text-gray-800">{user?.email || "—"}</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("profile.location")}
                </label>
                {editingLocation ? (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          {t("profile.zipCode")}
                        </label>
                        <input
                          type="text"
                          value={zipCode}
                          onChange={(e) => setZipCode(e.target.value)}
                          placeholder={t("profile.enterZipCode")}
                          className={`focus:ring-2 focus:ring-offset-2 block w-full sm:text-sm border-gray-300 rounded-md py-2 px-3 border ${
                            user?.role === "ADMIN"
                              ? "focus:ring-blue-500 focus:border-blue-500"
                              : "focus:ring-yellow-500 focus:border-yellow-500"
                          }`}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          {t("profile.country")}
                        </label>
                        <select
                          value={country}
                          onChange={(e) => setCountry(e.target.value)}
                          className={`focus:ring-2 focus:ring-offset-2 block w-full sm:text-sm border-gray-300 rounded-md py-2 px-3 border ${
                            user?.role === "ADMIN"
                              ? "focus:ring-blue-500 focus:border-blue-500"
                              : "focus:ring-yellow-500 focus:border-yellow-500"
                          }`}
                        >
                          <option value="">{t("profile.selectCountry")}</option>
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
                    <div className="flex gap-2">
                      <button
                        onClick={handleLocationSave}
                        disabled={isSaving}
                        className={`flex items-center px-3 py-1 rounded-md text-white text-sm font-medium ${
                          isSaving
                            ? "bg-gray-400 cursor-not-allowed"
                            : user?.role === "ADMIN"
                            ? "bg-blue-600 hover:bg-blue-700"
                            : "bg-yellow-600 hover:bg-yellow-700"
                        }`}
                      >
                        {isSaving ? (
                          <>
                            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-1"></div>
                            {t("profile.saving")}
                          </>
                        ) : (
                          <>
                            <FiSave className="mr-1" />
                            {t("profile.saveLocation")}
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => {
                          setEditingLocation(false);
                          setZipCode("");
                          setCountry("");
                        }}
                        className="flex items-center px-3 py-1 rounded-md text-gray-600 bg-gray-100 hover:bg-gray-200 text-sm font-medium"
                      >
                        <FiX className="mr-1" />
                        {t("profile.cancel")}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <IoLocationOutline className="text-gray-400 mr-2" />
                      <span className="text-gray-800">
                        {formattedLocation || user?.location || "—"}
                      </span>
                    </div>
                    <button
                      onClick={() => setEditingLocation(true)}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <FiEdit className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("profile.role")}
                </label>
                <div className="flex items-center">
                  <FiTag className="text-gray-400 mr-2" />
                  <span className="text-gray-800">
                    {user?.role === "ADMIN"
                      ? t("profile.admin")
                      : user?.role === "RETAILER"
                      ? t("profile.retailer")
                      : t("profile.customer")}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Account Actions */}
          <div className="p-6 border-t border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              {t("profile.accountActions")}
            </h2>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleLogout}
                className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <FiLogOut className="mr-2" />
                {t("signOut")}
              </button>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="flex items-center justify-center px-4 py-2 border border-red-300 rounded-md text-red-700 hover:bg-red-50 transition-colors"
              >
                <TiDelete className="mr-2" />
                {t("profile.deleteAccount")}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Account Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {t("profile.confirmDeleteTitle")}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {t("profile.confirmDeleteText")}
              </p>
              <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-700 text-xs">
                  <strong>Warning:</strong> This will permanently delete your account from both the local database and Firebase console. This action cannot be undone.
                </p>
              </div>
            </div>

            {authUser?.providerData?.[0]?.providerId === "password" && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("password")}
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  placeholder={t("password")}
                />
              </div>
            )}

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
                disabled={deleting}
              >
                {t("profile.cancel")}
              </button>
              <button
                onClick={handleOnClickDelete}
                className={`px-4 py-2 rounded-md text-white ${deleting ? "bg-red-300" : "bg-red-600 hover:bg-red-700"}`}
                disabled={deleting}
              >
                {deleting ? t("updating") : t("profile.confirmDeleteButton")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
