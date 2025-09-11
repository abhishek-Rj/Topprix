import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "../../components/navigation";
import useAuthenticate from "../../hooks/authenticationt";
import Loader from "../../components/loading";
import baseUrl from "../../hooks/baseurl";
import { toast } from "react-toastify";
import {
  FiDollarSign,
  FiCheck,
  FiX,
  FiCalendar,
  FiCreditCard,
  FiShield,
  FiStar,
  FiZap,
  FiAward,
  FiArrowRight,
  FiExternalLink,
} from "react-icons/fi";
import { motion } from "framer-motion";
import Footer from "../../components/Footer";
import { useTranslation } from "react-i18next";

interface PricingPlan {
  id: string;
  name: string;
  description: string;
  amount: number;
  currency: string;
  interval: string;
  features: string[];
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface Subscription {
  id: string;
  userId: string;
  pricingPlanId: string;
  status: string;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
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

export default function Subscriptions() {
  const { t } = useTranslation();
  const [userData, setUserData] = useState<any>(null);
  const { user, userRole, loading: authLoading } = useAuthenticate();
  const navigate = useNavigate();
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [currentSubscription, setCurrentSubscription] =
    useState<UserSubscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [creatingSubscription, setCreatingSubscription] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<PricingPlan | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState<string>("");
  // Redirect non-retailer users
  if (userRole !== "RETAILER" && userRole !== "ADMIN") {
    navigate("/not-found");
    return null;
  }

  useEffect(() => {
    fetchPricingPlans();
    fetchCurrentSubscription();
  }, []);

  const fetchPricingPlans = async () => {
    try {
      const response = await fetch(`${baseUrl}api/pricing-plans`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "user-email": localStorage.getItem("userEmail") || "",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch pricing plans");
      }

      const data = await response.json();
      // Filter only active plans
      const activePlans = (data.pricingPlans || []).filter(
        (plan: PricingPlan) => plan.isActive
      );
      setPlans(activePlans);
    } catch (error) {
      console.error("Error fetching pricing plans:", error);
      toast.error(t("subscription.failedToLoadPricingPlans"));
    }
  };

  const fetchCurrentSubscription = async () => {
    try {
      // First get the user data using email
      const userResponse = await fetch(
        `${baseUrl}user/${localStorage.getItem("userEmail") || ""}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "user-email": localStorage.getItem("userEmail") || "",
          },
        }
      );

      if (!userResponse.ok) {
        throw new Error("Failed to fetch user data");
      }

      const userData = await userResponse.json();
      setUserData(userData.user);

      // Then fetch the subscription using the user ID
      const subscriptionResponse = await fetch(
        `${baseUrl}api/users/${userData.user.id}/subscription`,
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
        // Ensure the data structure matches the expected interface
        // The API might return the subscription directly or nested
        const formattedData = subscriptionData.subscription
          ? subscriptionData
          : { subscription: subscriptionData };
        setCurrentSubscription(formattedData);
      } else {
        // No subscription found or error
        setCurrentSubscription(null);
      }
    } catch (error) {
      console.error("Error fetching current subscription:", error);
      toast.error(t("subscription.failedToFetchCurrentSubscription"));
      setCurrentSubscription(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async (plan: PricingPlan) => {
    setSelectedPlan(plan);
    setCreatingSubscription(true);

    try {
      const response = await fetch(`${baseUrl}api/subscriptions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "user-email": localStorage.getItem("userEmail") || "",
        },
        body: JSON.stringify({
          userId: userData.id,
          pricingPlanId: plan.id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create subscription");
      }

      if (data.hostedInvoiceUrl) {
        setPaymentUrl(data.hostedInvoiceUrl);
        setShowPaymentModal(true);
        window.open(`${data.hostedInvoiceUrl}`, "_blank");
      } else {
        toast.success(
          data.message || t("subscription.subscriptionCreatedSuccess")
        );
        await fetchCurrentSubscription();
      }
    } catch (error) {
      console.error("Error creating subscription:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : t("subscription.failedToCreateSubscription")
      );
    } finally {
      setCreatingSubscription(false);
    }
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency.toUpperCase(),
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };

  const getPlanIcon = (planName: string) => {
    const name = planName.toLowerCase();
    if (name.includes("basic") || name.includes("starter"))
      return <FiStar className="w-5 h-5" />;
    if (name.includes("pro") || name.includes("premium"))
      return <FiZap className="w-5 h-5" />;
    if (name.includes("enterprise") || name.includes("business"))
      return <FiAward className="w-5 h-5" />;
    return <FiCreditCard className="w-5 h-5" />;
  };

  const getPlanColor = (planName: string) => {
    const name = planName.toLowerCase();
    if (name.includes("basic") || name.includes("starter"))
      return "from-blue-500 to-blue-600";
    if (name.includes("pro") || name.includes("premium"))
      return "from-purple-500 to-purple-600";
    if (name.includes("enterprise") || name.includes("business"))
      return "from-yellow-500 to-orange-600";
    return "from-gray-500 to-gray-600";
  };

  if (authLoading || loading) {
    return (
      <>
        <Navigation />
        <div className="flex items-center justify-center min-h-screen">
          <Loader />
        </div>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50">
      <Navigation />
      <main className="pt-20 pb-10 px-3 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8 sm:mb-12 bg-yellow-100 p-4 sm:p-6 rounded-2xl"
          >
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              <div className="bg-yellow-100 p-2 sm:p-3 rounded-full">
                <FiCreditCard className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-600" />
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
                {t("subscription.title")}
              </h1>
            </div>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-2">
              {t("subscription.description")}
            </p>
          </motion.div>

          {/* Current Subscription Status */}
          {currentSubscription && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mb-6 sm:mb-8"
            >
              <div className="bg-white rounded-2xl shadow-lg border border-yellow-100 p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1">
                      {t("subscription.currentSubscription")}
                    </h3>
                    <p className="text-gray-600 text-xs sm:text-sm">
                      {t("subscription.status")}:{" "}
                      <span
                        className={
                          currentSubscription.subscription?.status?.toLowerCase() ===
                          "active"
                            ? "text-green-600"
                            : "text-yellow-600"
                        }
                      >
                        {currentSubscription.subscription?.status
                          ? currentSubscription.subscription?.status
                              .charAt(0)
                              .toUpperCase() +
                            currentSubscription.subscription?.status
                              .slice(1)
                              .toLowerCase()
                          : "Unknown"}
                      </span>
                    </p>
                    {currentSubscription.subscription?.currentPeriodEnd && (
                      <p className="text-gray-600 text-xs sm:text-sm">
                        {t("subscription.renews")}:{" "}
                        {formatDate(
                          currentSubscription.subscription?.currentPeriodEnd
                        )}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <FiShield className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                    <span className="text-xs sm:text-sm text-gray-600">
                      {t("subscription.activePlan")}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Privacy Policy Notice */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-8"
          >
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 sm:p-6">
              <div className="flex items-start gap-3">
                <div className="text-blue-600 mt-1">
                  <svg
                    className="w-5 h-5"
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
                <div>
                  <h3 className="text-sm sm:text-base font-medium text-blue-900 mb-2">
                    Protection de vos données
                  </h3>
                  <p className="text-xs sm:text-sm text-blue-800 mb-3">
                    En souscrivant à un abonnement, vos données de paiement sont
                    traitées de manière sécurisée. Consultez notre{" "}
                    <a
                      href="/privacy"
                      className="text-blue-600 hover:underline font-medium"
                    >
                      Politique de Confidentialité
                    </a>{" "}
                    pour plus d'informations.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Pricing Plans Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8"
          >
            {plans.map((plan, index) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                className={`bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 ${
                  currentSubscription?.subscription?.pricingPlanId === plan.id
                    ? "ring-2 ring-yellow-500 ring-opacity-50"
                    : ""
                }`}
              >
                {/* Plan Header */}
                <div
                  className={`bg-gradient-to-r ${getPlanColor(
                    plan.name
                  )} p-4 sm:p-6 text-white`}
                >
                  <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                      {getPlanIcon(plan.name)}
                    </div>
                    {currentSubscription?.subscription?.pricingPlanId ===
                      plan.id && (
                      <span className="bg-white bg-opacity-20 px-2 py-1 rounded-full text-xs font-medium">
                        {t("subscription.currentPlan")}
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold mb-1">
                    {plan.name}
                  </h3>
                  <p className="text-white text-opacity-90 text-xs sm:text-sm">
                    {plan.description}
                  </p>
                </div>

                {/* Plan Pricing */}
                <div className="p-4 sm:p-6">
                  <div className="mb-4 sm:mb-6">
                    <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
                      {formatCurrency(plan.amount, plan.currency)}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-500 flex items-center gap-1">
                      <FiCalendar className="w-3 h-3 sm:w-4 sm:h-4" />
                      {t("subscription.per")} {plan.interval}
                    </div>
                  </div>

                  {/* Features */}
                  <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                    <h4 className="font-semibold text-gray-900 text-xs sm:text-sm">
                      {t("subscription.features")}:
                    </h4>
                    {plan.features.map((feature, featureIndex) => (
                      <div
                        key={featureIndex}
                        className="flex items-center gap-2"
                      >
                        <FiCheck className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 flex-shrink-0" />
                        <span className="text-xs sm:text-sm text-gray-600">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={() => handleSubscribe(plan)}
                    disabled={
                      creatingSubscription ||
                      currentSubscription?.subscription.pricingPlanId ===
                        plan.id
                    }
                    className={`w-full py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 text-sm sm:text-base ${
                      currentSubscription?.subscription.pricingPlanId ===
                      plan.id
                        ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                        : creatingSubscription
                        ? "bg-yellow-300 text-yellow-800 cursor-not-allowed"
                        : "bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white hover:shadow-lg"
                    }`}
                  >
                    {creatingSubscription ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        {t("subscription.subscribing")}
                      </>
                    ) : currentSubscription?.subscription.pricingPlanId ===
                      plan.id ? (
                      <>
                        <FiCheck className="w-4 h-4" />
                        {t("subscription.currentPlan")}
                      </>
                    ) : (
                      <>
                        <FiArrowRight className="w-4 h-4" />
                        {t("subscription.subscribe")}
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Empty State */}
          {plans.length === 0 && !loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-8 sm:py-12"
            >
              <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-lg border border-gray-100">
                <FiCreditCard className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                  {t("subscription.noPricingPlans")}
                </h3>
                <p className="text-sm sm:text-base text-gray-600">
                  {t("subscription.contactSupport")}
                </p>
              </div>
            </motion.div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
