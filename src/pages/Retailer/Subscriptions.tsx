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
  createdAt: string;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
}

export default function Subscriptions() {
  const [userData, setUserData] = useState<any>(null);
  const { user, userRole, loading: authLoading } = useAuthenticate();
  const navigate = useNavigate();
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [currentSubscription, setCurrentSubscription] = useState<Subscription | null>(null);
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
    fetchUser();
    fetchPricingPlans();
    fetchCurrentSubscription();
  }, []);

  const fetchUser = async () => {
    const response = await fetch(`${baseUrl}user/${localStorage.getItem('userEmail') || ""}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "user-email": localStorage.getItem('userEmail') || "",
      },
    });
    const userData = await response.json();
    setUserData(userData);
  };

  const fetchPricingPlans = async () => {
    try {
      const response = await fetch(`${baseUrl}api/pricing-plans`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "user-email": localStorage.getItem('userEmail') || "",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch pricing plans");
      }

      const data = await response.json();
      // Filter only active plans
      const activePlans = (data.pricingPlans || []).filter((plan: PricingPlan) => plan.isActive);
      setPlans(activePlans);
    } catch (error) {
      console.error("Error fetching pricing plans:", error);
      toast.error("Failed to load pricing plans");
    }
  };

  const fetchCurrentSubscription = async () => {
    try {
      const fetchCurrentUser = await fetch(`${baseUrl}user/${userData.id}/subscription`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "user-email": localStorage.getItem('userEmail') || "",
        },
      });
      const userResponse = await fetchCurrentUser.json();
      const userId = userResponse.id;
      const response = await fetch(`${baseUrl}api/${userId}/current`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "user-email": localStorage.getItem('userEmail') || "",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setCurrentSubscription(data.subscription);
      }
    } catch (error) {
      console.error("Error fetching current subscription:", error);
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
          "user-email": localStorage.getItem('userEmail') || "",
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
      
      // Handle successful subscription creation
      if (data.hostedInvoiceUrl) {
        setPaymentUrl(data.hostedInvoiceUrl);
        setShowPaymentModal(true);
        toast.success(data.message || "Subscription created! Please complete payment to activate.");
      } else {
        toast.success(data.message || "Subscription created successfully!");
        // Refresh current subscription data
        await fetchCurrentSubscription();
      }
    } catch (error) {
      console.error("Error creating subscription:", error);
      toast.error(error instanceof Error ? error.message : "Failed to create subscription");
    } finally {
      setCreatingSubscription(false);
    }
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getPlanIcon = (planName: string) => {
    const name = planName.toLowerCase();
    if (name.includes('basic') || name.includes('starter')) return <FiStar className="w-6 h-6" />;
    if (name.includes('pro') || name.includes('premium')) return <FiZap className="w-6 h-6" />;
    if (name.includes('enterprise') || name.includes('business')) return <FiAward className="w-6 h-6" />;
    return <FiDollarSign className="w-6 h-6" />;
  };

  const getPlanColor = (planName: string) => {
    const name = planName.toLowerCase();
    if (name.includes('basic') || name.includes('starter')) return 'from-blue-500 to-blue-600';
    if (name.includes('pro') || name.includes('premium')) return 'from-purple-500 to-purple-600';
    if (name.includes('enterprise') || name.includes('business')) return 'from-yellow-500 to-orange-600';
    return 'from-gray-500 to-gray-600';
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
                Subscription Plans
              </h1>
            </div>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-2">
              Choose the perfect plan to grow your business and unlock powerful features
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
                      Current Subscription
                    </h3>
                    <p className="text-gray-600 text-xs sm:text-sm">
                      Status: <span className={`font-medium ${
                        currentSubscription.status === 'active' 
                          ? 'text-green-600' 
                          : 'text-yellow-600'
                      }`}>
                        {currentSubscription.status.charAt(0).toUpperCase() + currentSubscription.status.slice(1)}
                      </span>
                    </p>
                    {currentSubscription.currentPeriodEnd && (
                      <p className="text-gray-600 text-xs sm:text-sm">
                        Renews: {formatDate(currentSubscription.currentPeriodEnd)}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <FiShield className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                    <span className="text-xs sm:text-sm text-gray-600">Active Plan</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

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
                  currentSubscription?.pricingPlanId === plan.id 
                    ? 'ring-2 ring-yellow-500 ring-opacity-50' 
                    : ''
                }`}
              >
                {/* Plan Header */}
                <div className={`bg-gradient-to-r ${getPlanColor(plan.name)} p-4 sm:p-6 text-white`}>
                  <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                      {getPlanIcon(plan.name)}
                    </div>
                    {currentSubscription?.pricingPlanId === plan.id && (
                      <span className="px-2 sm:px-3 py-1 bg-white bg-opacity-20 rounded-full text-xs font-medium">
                        Current Plan
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold mb-1">{plan.name}</h3>
                  <p className="text-white text-opacity-90 text-xs sm:text-sm">{plan.description}</p>
                </div>

                {/* Plan Pricing */}
                <div className="p-4 sm:p-6">
                  <div className="mb-4 sm:mb-6">
                    <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
                      {formatCurrency(plan.amount, plan.currency)}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-500 flex items-center gap-1">
                      <FiCalendar className="w-3 h-3 sm:w-4 sm:h-4" />
                      per {plan.interval}
                    </div>
                  </div>

                  {/* Features */}
                  <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                    <h4 className="font-semibold text-gray-900 text-xs sm:text-sm">Features:</h4>
                    {plan.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center gap-2">
                        <FiCheck className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 flex-shrink-0" />
                        <span className="text-xs sm:text-sm text-gray-600">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={() => handleSubscribe(plan)}
                    disabled={creatingSubscription || currentSubscription?.pricingPlanId === plan.id}
                    className={`w-full py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 text-sm sm:text-base ${
                      currentSubscription?.pricingPlanId === plan.id
                        ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                        : creatingSubscription
                        ? 'bg-yellow-300 text-yellow-800 cursor-not-allowed'
                        : 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white hover:from-yellow-600 hover:to-orange-600'
                    }`}
                  >
                    {creatingSubscription ? (
                      <>
                        <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Creating...
                      </>
                    ) : currentSubscription?.pricingPlanId === plan.id ? (
                      <>
                        <FiCheck className="w-3 h-3 sm:w-4 sm:h-4" />
                        Current Plan
                      </>
                    ) : (
                      <>
                        <FiArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
                        Subscribe Now
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
                  No Pricing Plans Available
                </h3>
                <p className="text-sm sm:text-base text-gray-600">
                  Please contact support to set up pricing plans for your account.
                </p>
              </div>
            </motion.div>
          )}
        </div>
      </main>

      {/* Payment Modal */}
      {showPaymentModal && paymentUrl && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-3 sm:p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-2 sm:mx-4"
          >
            <div className="p-4 sm:p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <FiCreditCard className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900">
                    Complete Payment
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600">
                    Secure payment processing
                  </p>
                </div>
              </div>

              <div className="mb-4 sm:mb-6">
                <p className="text-sm sm:text-base text-gray-700 mb-3">
                  You'll be redirected to our secure payment processor to complete your subscription.
                </p>
                {selectedPlan && (
                  <div className="bg-gray-50 rounded-lg p-3 sm:p-4 border border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-1 text-sm sm:text-base">
                      {selectedPlan.name}
                    </h4>
                    <p className="text-xs sm:text-sm text-gray-600 mb-2">
                      {selectedPlan.description}
                    </p>
                    <div className="flex items-center justify-between text-xs sm:text-sm">
                      <span className="font-medium text-gray-900">
                        {formatCurrency(selectedPlan.amount, selectedPlan.currency)}
                      </span>
                      <span className="text-gray-500">
                        per {selectedPlan.interval}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3">
                <button
                  onClick={() => {
                    setShowPaymentModal(false);
                    setPaymentUrl("");
                    setSelectedPlan(null);
                  }}
                  className="px-3 sm:px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors text-sm sm:text-base"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    window.open(paymentUrl, '_blank');
                    setShowPaymentModal(false);
                    setPaymentUrl("");
                    setSelectedPlan(null);
                  }}
                  className="px-3 sm:px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
                >
                  <FiExternalLink className="w-3 h-3 sm:w-4 sm:h-4" />
                  Proceed to Payment
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
      <Footer />
    </div>
  );
} 