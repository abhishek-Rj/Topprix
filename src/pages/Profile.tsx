import { useEffect, useState } from "react";
import { getDoc, doc, updateDoc } from "firebase/firestore";
import { db, auth } from "../context/firebaseProvider";
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
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import userLogout from "@/hooks/userLogout";
import baseUrl from "@/hooks/baseurl";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface PricingPlan {
  id: string;
  name: string;
  description: string;
  stripePriceId: string;
  amount: number;
  currency: string;
  interval: string;
  isActive: boolean;
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
  const [user, setUser] = useState<any>(null);
  const [password, setPassword] = useState<string>("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);
  const [loader, setLoader] = useState<boolean>(true);
  const [editing, setEditing] = useState<boolean>(false);
  const [editedName, setEditedName] = useState<string>("");
  const [editedLocation, setEditedLocation] = useState<string>("");
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [accountCreatedDate, setAccountCreatedDate] = useState<Date | null>(
    null
  );
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [subscriptionLoading, setSubscriptionLoading] = useState<boolean>(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      if (!currentUser) {
        navigate("/login");
        return;
      }

      try {
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUser(userData);
          setEditedLocation(userData.location || "");
          setEditedName(userData.name || "");

          if (userData.createdAt) {
            const createdAt = userData.createdAt.toDate
              ? userData.createdAt.toDate()
              : new Date(userData.createdAt);
            setAccountCreatedDate(createdAt);
          }

          // Fetch subscription data for retailers
          if (userData.role === "RETAILER" && currentUser.email) {
            await fetchUserSubscription(currentUser.email);
          }
        } else {
          console.log("No user document found");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoader(false);
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const fetchUserSubscription = async (email: string) => {
    setSubscriptionLoading(true);
    try {
      // Get the user ID from the backend using email
      const userResponse = await fetch(`${baseUrl}user/${email}`);
      if (!userResponse.ok) {
        throw new Error("Failed to fetch user data");
      }
      const userData = await userResponse.json();
      
      // Then fetch the subscription using the backend user ID
      const subscriptionResponse = await fetch(`${baseUrl}api/users/${userData.id}/subscription`, {
        method: 'GET', 
        headers: {
          "Content-Type" : "application/json", 
          "user-email" : localStorage.getItem("userEmail") || ""
        }
      });
      if (subscriptionResponse.ok) {
        const subscriptionData = await subscriptionResponse.json();
        setSubscription(subscriptionData);
      }
    } catch (error) {
      console.error("Error fetching subscription:", error);
    } finally {
      setSubscriptionLoading(false);
    }
  };

  const handleOnClickDelete = async () => {
    const currentUser = auth.currentUser;
    if (!currentUser) return;

    try {
      const userDelete = await fetch(
        `${baseUrl}user/delete/${currentUser.email}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      let userDeleteFirebase: any = null;
      if (currentUser.providerData[0].providerId === "password") {
        userDeleteFirebase = await deleteAccountwithCredentials(password);
      } else if (currentUser.providerData[0].providerId === "google.com") {
        userDeleteFirebase = await deleteAccountwithProviders("google");
      } else {
        userDeleteFirebase = await deleteAccountwithProviders("facebook");
      }

      if (!userDelete.ok || !userDeleteFirebase) {
        throw new Error("Failed to delete user account");
      }
      navigate("/signup");
    } catch (error) {
      console.error("Error deleting user account:", error);
    }
  };

  const handleSave = async () => {
    const currentUser = auth.currentUser;
    if (!currentUser) return;

    setIsSaving(true);
    setError(null);

    try {
      const updateUser = await fetch(
        `${baseUrl}user/update/${currentUser?.email}`,
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
      await updateDoc(doc(db, "users", currentUser.uid), {
        name: editedName,
        location: editedLocation,
      });
    } catch (error: any) {
      console.error("Error updating profile:", error);
      setError(error.message || "Failed to update profile");
    } finally {
      setIsSaving(false);
    }
    setEditing(false);
    window.location.reload();
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

  const handlePricingPlans = () => {
    navigate("/admin/pricing-plans");
  };

  if (loader) {
    return (
      <div className={`min-h-screen w-full ${user?.role === "ADMIN" ? "bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50" : "bg-yellow-50"}`}>
        <Navigation />
        <Loader />
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${user?.role === "ADMIN" ? "bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50" : "bg-yellow-50"}`}>
      <Navigation />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        {/* Profile Header */}
        <div className={`rounded-t-xl py-8 px-6 sm:px-10 text-white shadow-md ${
          user?.role === "ADMIN" 
            ? "bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600" 
            : "bg-gradient-to-r from-yellow-600 to-amber-500"
        }`}>
          <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg">
              <span className={`text-4xl font-bold ${
                user?.role === "ADMIN" ? "text-blue-600" : "text-yellow-600"
              }`}>
                {user?.name?.charAt(0).toUpperCase() ||
                  user?.email?.charAt(0).toUpperCase() ||
                  "?"}
              </span>
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-3xl font-bold">{user?.name || "User"}</h1>
              <p className={`mt-1 ${
                user?.role === "ADMIN" ? "text-blue-100" : "text-yellow-100"
              }`}>{user?.email}</p>
              <div className="mt-3">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium text-white ${
                  user?.role === "ADMIN" ? "bg-blue-800" : "bg-yellow-800"
                }`}>
                  <FiTag className="mr-1" />
                  {user?.role === "ADMIN"
                    ? "Admin"
                    : user?.role === "RETAILER"
                    ? "Retailer"
                    : "Customer"}
                </span>
                {accountCreatedDate && (
                  <span className={`ml-2 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium text-white ${
                    user?.role === "ADMIN" ? "bg-blue-800" : "bg-yellow-800"
                  }`}>
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

          <div className="p-6 sm:p-10">
            {/* Subscription Section for Retailers */}
            {user?.role === "RETAILER" && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <FiCreditCard className="mr-2 text-yellow-600" />
                  Subscription Details
                </h2>
                {subscriptionLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader />
                  </div>
                ) : subscription ? (
                  <div className="space-y-6">
                    {/* Summary Card */}
                    <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          <span className="flex items-center">
                            <FiCreditCard className="mr-2 text-purple-600" />
                            Subscription Summary
                          </span>
                          <Badge 
                            variant={subscription.user.subscriptionStatus === "ACTIVE" ? "default" : "secondary"}
                            className={getSubscriptionStatusColor(subscription.user.subscriptionStatus)}
                          >
                            <span className="flex items-center">
                              {getSubscriptionIcon(subscription.user.subscriptionStatus)}
                              <span className="ml-1">{subscription.user.subscriptionStatus}</span>
                            </span>
                          </Badge>
                        </CardTitle>
                        <CardDescription>
                          {subscription.subscription.pricingPlan.name} - €{subscription.subscription.pricingPlan.amount}/{subscription.subscription.pricingPlan.interval}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-purple-600">{subscription.subscription.pricingPlan.amount}€</div>
                            <div className="text-sm text-gray-600">Monthly Cost</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-green-600">{subscription.subscription.pricingPlan.features.length}</div>
                            <div className="text-sm text-gray-600">Features</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-blue-600">
                              {subscription.user.currentPeriodEnd ? 
                                Math.ceil((new Date(subscription.user.currentPeriodEnd).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
                                : 0
                              }
                            </div>
                            <div className="text-sm text-gray-600">Days Remaining</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    {/* Main Details Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      {/* Current Plan */}
                      <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
                        <CardHeader>
                          <CardTitle className="flex items-center justify-between">
                            <span className="flex items-center">
                              <FiStar className="mr-2 text-yellow-600" />
                              Current Plan
                            </span>
                            <Badge 
                              variant={subscription.subscription.status === "ACTIVE" ? "default" : "secondary"}
                              className={getSubscriptionStatusColor(subscription.subscription.status)}
                            >
                              <span className="flex items-center">
                                {getSubscriptionIcon(subscription.subscription.status)}
                                <span className="ml-1">{subscription.subscription.status}</span>
                              </span>
                            </Badge>
                          </CardTitle>
                          <CardDescription>
                            {subscription.subscription.pricingPlan.name} - €{subscription.subscription.pricingPlan.amount}/{subscription.subscription.pricingPlan.interval}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-600">Plan Name:</span>
                              <span className="font-semibold">{subscription.subscription.pricingPlan.name}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-600">Price:</span>
                              <span className="font-semibold">€{subscription.subscription.pricingPlan.amount}/{subscription.subscription.pricingPlan.interval}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-600">Currency:</span>
                              <span className="font-semibold">{subscription.subscription.pricingPlan.currency.toUpperCase()}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-600">Auto-Renew:</span>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                subscription.subscription.cancelAtPeriodEnd ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
                              }`}>
                                {subscription.subscription.cancelAtPeriodEnd ? "Will Cancel" : "Active"}
                              </span>
                            </div>
                            {subscription.subscription.currentPeriodStart && (
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">Current Period Start:</span>
                                <span className="font-semibold">{formatSubscriptionDate(subscription.subscription.currentPeriodStart)}</span>
                              </div>
                            )}
                            {subscription.subscription.currentPeriodEnd && (
                              <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">Current Period End:</span>
                                <span className="font-semibold">{formatSubscriptionDate(subscription.subscription.currentPeriodEnd)}</span>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                      {/* Plan Features */}
                      <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
                        <CardHeader>
                          <CardTitle className="flex items-center">
                            <FiZap className="mr-2 text-green-600" />
                            Plan Features
                          </CardTitle>
                          <CardDescription>
                            What's included in your current plan
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            {subscription.subscription.pricingPlan.features?.map((feature: string, index: number) => (
                              <div key={index} className="flex items-center">
                                <FiCheckCircle className="w-4 h-4 text-green-500 mr-2" />
                                <span className="text-sm">{feature}</span>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                      {/* Subscription Details */}
                      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
                        <CardHeader>
                          <CardTitle className="flex items-center">
                            <FiCalendar className="mr-2 text-blue-600" />
                            Subscription IDs & Dates
                          </CardTitle>
                          <CardDescription>
                            Important subscription information
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-600">Subscription ID:</span>
                              <span className="font-mono text-xs text-gray-600">{subscription.subscription.id.slice(0, 8)}...</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-600">Stripe ID:</span>
                              <span className="font-mono text-xs text-gray-600">{subscription.subscription.stripeSubscriptionId.slice(0, 8)}...</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-600">Created:</span>
                              <span className="font-semibold">{formatSubscriptionDate(subscription.subscription.createdAt)}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                ) : (
                  <Card className="bg-gray-50 border-gray-200">
                    <CardContent className="p-6">
                      <div className="text-center">
                        <FiAlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Active Subscription</h3>
                        <p className="text-gray-600 mb-4">
                          You don't have an active subscription. Choose a plan to get started.
                        </p>
                        <button onClick={handlePricingPlans} className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg transition-colors">
                          Pricing Plans
                        </button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">
                {t("profile.personalInfo")}
              </h2>
              <button
                onClick={() => setEditing(!editing)}
                className={`flex items-center text-sm font-medium ${
                  editing ? "text-red-500" : user?.role === "ADMIN" ? "text-blue-600" : "text-yellow-600"
                }`}
              >
                {editing ? (
                  <>
                    <FiX className="mr-1" />
                    {t("profile.cancel")}
                  </>
                ) : (
                  <>
                    <FiEdit className="mr-1" />
                    {t("profile.edit")}
                  </>
                )}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-10">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("profile.name")}
                </label>
                {editing ? (
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
                  <div className="flex items-center">
                    <FiUser className="text-gray-400 mr-2" />
                    <span className="text-gray-800">{user?.name || "—"}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("profile.email")}
                </label>
                <div className="flex items-center">
                  <FiMail className="text-gray-400 mr-2" />
                  <span className="text-gray-800">{user?.email}</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("profile.role")}
                </label>
                <div className="flex items-center">
                  <FiShield className="text-gray-400 mr-2" />
                  <span className="text-gray-800">
                    <span className="text-gray-800">
                      {user?.role === "ADMIN"
                        ? t("admin")
                        : user?.role === "RETAILER"
                        ? t("retailer")
                        : t("customer")}
                    </span>
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("profile.location")}
                </label>
                {editing ? (
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <IoLocationOutline className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={editedLocation}
                      onChange={(e) => setEditedLocation(e.target.value)}
                      className={`focus:ring-2 focus:ring-offset-2 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2 px-3 border ${
                        user?.role === "ADMIN" 
                          ? "focus:ring-blue-500 focus:border-blue-500" 
                          : "focus:ring-yellow-500 focus:border-yellow-500"
                      }`}
                    />
                  </div>
                ) : (
                  <div className="flex items-center">
                    <IoLocationOutline className="text-gray-400 mr-2" />
                    <span className="text-gray-800">
                      {user?.location || "—"}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {editing && (
              <div className="mt-6 flex justify-end">
                <button
                  onClick={handleSave}
                  disabled={isSaving || !editedName.trim()}
                  className={`flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                    isSaving || !editedName.trim()
                      ? user?.role === "ADMIN" ? "bg-blue-300" : "bg-yellow-300"
                      : user?.role === "ADMIN"
                        ? "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        : "bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                  }`}
                >
                  <FiSave className="mr-2" />
                  {isSaving ? t("profile.saving") : t("profile.saveChanges")}
                </button>
              </div>
            )}
          </div>

          {/* Account Actions */}
          <div className="border-t space-y-4 border-gray-200 p-6 sm:p-10">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">
              {t("profile.accountActions")}
            </h2>

            <div className="space-y-4">
              <button
                onClick={handleLogout}
                className={`flex items-center bg-slate-100 rounded-lg p-2 hover:scale-105 transition duration-200 ${
                  user?.role === "ADMIN" 
                    ? "text-blue-600 hover:text-blue-800" 
                    : "text-yellow-600 hover:text-yellow-800"
                }`}
              >
                <FiLogOut className="mr-2" />
                {t("logout")}
              </button>
            </div>
            <div className="space-y-4">
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="flex items-center hover:scale-105 bg-gray-100 rounded-lg p-2 text-red-600 hover:text-red-800 transition duration-200"
              >
                <TiDelete className="mr-2" />
                {t("profile.deleteAccount")}
              </button>

              {showDeleteConfirm && (
                <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/30 backdrop-blur-sm">
                  <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4 shadow-xl">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">
                      {t("profile.confirmDeleteTitle") ||
                        "Confirm Account Deletion"}
                    </h3>
                    <p className="text-sm text-gray-700 mb-4">
                      {t("profile.confirmDeleteText") ||
                        "Please enter your password to confirm account deletion. This action cannot be undone."}
                    </p>
                    <input
                      type="password"
                      placeholder={t("password") || "Enter your password"}
                      className="w-full px-3 py-2 mb-4 border rounded-md focus:outline-none focus:ring focus:ring-red-300"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <div className="flex justify-end gap-3">
                      <button
                        onClick={() => setShowDeleteConfirm(false)}
                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                      >
                        {t("cancel") || "Cancel"}
                      </button>
                      <button
                        onClick={handleOnClickDelete}
                        disabled={!password}
                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
                      >
                        {t("profile.confirmDeleteButton") || "Delete"}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
