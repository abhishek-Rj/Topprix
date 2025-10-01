import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "../../components/navigation";
import useAuthenticate from "../../hooks/authenticationt";
import Loader from "../../components/loading";
import baseUrl from "../../hooks/baseurl";
import { toast } from "react-toastify";
import AdminFloatingSidebar from "../../components/AdminFloatingSidebar";
import {
  AdminSidebarProvider,
  useAdminSidebar,
} from "../../contexts/AdminSidebarContext";
import {
  FiDollarSign,
  FiEdit,
  FiTrash2,
  FiPlus,
  FiCheck,
  FiX,
  FiCalendar,
  FiGlobe,
  FiSettings,
  FiActivity,
  FiStar,
} from "react-icons/fi";
import { motion } from "framer-motion";
import Footer from "../../components/Footer";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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

function PricingPlansContent() {
  const { user, userRole, loading: authLoading } = useAuthenticate();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { isOpen } = useAdminSidebar();
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingPlan, setEditingPlan] = useState<PricingPlan | null>(null);
  const [deletingPlanId, setDeletingPlanId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [planToDelete, setPlanToDelete] = useState<PricingPlan | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    amount: "",
    currency: "eur",
    interval: "month",
    features: [""],
  });

  if (userRole !== "ADMIN") {
    navigate("/not-found");
    return null;
  }

  const fetchPricingPlans = async () => {
    try {
      setLoading(true);
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
      setPlans(data.pricingPlans || []);
    } catch (error) {
      console.error("Error fetching pricing plans:", error);
      toast.error("Failed to load pricing plans");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPricingPlans();
  }, []);

  // Show loading while auth is being determined
  if (authLoading) {
    return (
      <>
        <Navigation />
        <div className="flex items-center justify-center min-h-screen">
          <Loader />
        </div>
      </>
    );
  }

  // Redirect non-admin users after auth is loaded

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      amount: "",
      currency: "eur",
      interval: "month",
      features: [""],
    });
    setEditingPlan(null);
    setShowForm(false);
  };

  const handleEdit = (plan: PricingPlan) => {
    setEditingPlan(plan);
    setFormData({
      name: plan.name,
      description: plan.description,
      amount: plan.amount.toString(),
      currency: plan.currency,
      interval: plan.interval,
      features: plan.features.length > 0 ? plan.features : [""],
    });
    setShowForm(true);
  };

  const handleDelete = (plan: PricingPlan) => {
    setPlanToDelete(plan);
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (!planToDelete) return;

    try {
      setDeletingPlanId(planToDelete.id);
      const response = await fetch(
        `${baseUrl}api/pricing-plans/${planToDelete.id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "user-email": localStorage.getItem("userEmail") || "",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete pricing plan");
      }

      toast.success("Pricing plan deleted successfully");
      fetchPricingPlans();
    } catch (error) {
      console.error("Error deleting pricing plan:", error);
      toast.error("Failed to delete pricing plan");
    } finally {
      setDeletingPlanId(null);
      setShowDeleteDialog(false);
      setPlanToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteDialog(false);
    setPlanToDelete(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);

    try {
      // Validate form
      if (!formData.name || !formData.description || !formData.amount) {
        toast.error("Please fill in all required fields");
        return;
      }

      const planData = {
        name: formData.name,
        description: formData.description,
        amount: parseFloat(formData.amount),
        currency: formData.currency,
        interval: formData.interval,
        features: formData.features.filter((feature) => feature.trim() !== ""),
      };

      const url = editingPlan
        ? `${baseUrl}api/pricing-plans/${editingPlan.id}`
        : `${baseUrl}api/pricing-plans`;

      const method = editingPlan ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "user-email": user?.email || "",
        },
        body: JSON.stringify(planData),
      });

      if (!response.ok) {
        throw new Error("Failed to save pricing plan");
      }

      await response.json();

      if (editingPlan) {
        toast.success("Pricing plan updated successfully");
      } else {
        toast.success("Pricing plan created successfully");
      }

      resetForm();
      fetchPricingPlans();
    } catch (error) {
      console.error("Error saving pricing plan:", error);
      toast.error("Failed to save pricing plan");
    } finally {
      setIsCreating(false);
    }
  };

  const addFeature = () => {
    setFormData((prev) => ({
      ...prev,
      features: [...prev.features, ""],
    }));
  };

  const removeFeature = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
  };

  const updateFeature = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.map((feature, i) =>
        i === index ? value : feature
      ),
    }));
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency.toUpperCase(),
    }).format(amount);
  };

  if (loading) {
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
    <>
      <Navigation />
      <AdminFloatingSidebar />
      <main
        className={`pt-20 pb-10 px-4 sm:px-6 lg:px-8 bg-gray-50 min-h-screen transition-all duration-300 ease-in-out ${
          isOpen ? "lg:ml-80" : "lg:ml-0"
        }`}
      >
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <div className="p-6 bg-white border border-blue-500 shadow-sm rounded-none">
              <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                <FiDollarSign className="h-8 w-8 text-blue-600" />
                {t("pricingPlans.title")}
              </h1>
              <p className="text-gray-600">{t("pricingPlans.subtitle")}</p>
              <div className="mt-4 text-sm text-gray-500">
                {t("pricingPlans.lastUpdated")}: {new Date().toLocaleString()}
              </div>
            </div>
          </motion.div>

          {/* Action Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-8"
          >
            <Card className="bg-white border border-green-500 shadow-sm rounded-none">
              <CardContent className="p-6">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <FiActivity className="h-5 w-5 text-green-500" />
                      <span className="text-sm font-medium text-gray-600">
                        {t("pricingPlans.totalPlans")}
                      </span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">
                      {plans.length}
                    </div>
                    <div className="text-sm text-gray-500">
                      {plans.length !== 1
                        ? t("pricingPlans.plans")
                        : t("pricingPlans.plan")}{" "}
                      {t("pricingPlans.available")}
                    </div>
                  </div>
                  <button
                    onClick={() => setShowForm(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-none hover:bg-blue-700 transition-colors shadow-sm hover:shadow-md border border-blue-600"
                  >
                    <FiPlus className="w-5 h-5" />
                    {t("pricingPlans.createNewPlan")}
                  </button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Pricing Plans Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
          >
            {plans.map((plan, index) => {
              const borderColors = [
                "border-blue-500",
                "border-green-500",
                "border-purple-500",
                "border-orange-500",
                "border-teal-500",
                "border-pink-500",
              ];
              const borderColor = borderColors[index % borderColors.length];

              return (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                >
                  <Card
                    className={`bg-white ${borderColor} shadow-sm rounded-none hover:shadow-md transition-shadow`}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg font-bold text-gray-900 mb-1">
                            {plan.name}
                          </CardTitle>
                          <p className="text-sm text-gray-600">
                            {plan.description}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(plan)}
                            className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                            title="Edit plan"
                          >
                            <FiEdit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(plan)}
                            disabled={deletingPlanId === plan.id}
                            className="p-2 text-gray-400 hover:text-red-600 transition-colors disabled:opacity-50"
                            title="Delete plan"
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent>
                      <div className="mb-6">
                        <div className="text-3xl font-bold text-gray-900 mb-1">
                          {formatCurrency(plan.amount, plan.currency)}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center gap-1">
                          <FiCalendar className="w-4 h-4" />
                          {t("pricingPlans.per")} {plan.interval}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h4 className="font-semibold text-gray-900 text-sm mb-3 flex items-center gap-2">
                          <FiStar className="w-4 h-4 text-yellow-500" />
                          {t("pricingPlans.features")}:
                        </h4>
                        {plan.features.map((feature, featureIndex) => (
                          <div
                            key={featureIndex}
                            className="flex items-center gap-2"
                          >
                            <FiCheck className="w-4 h-4 text-green-500 flex-shrink-0" />
                            <span className="text-sm text-gray-600">
                              {feature}
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className="mt-6 pt-4 border-t border-gray-100">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500 flex items-center gap-2">
                            <FiActivity className="w-4 h-4" />
                            {t("pricingPlans.status")}:
                          </span>
                          <span
                            className={`px-2 py-1 text-xs font-medium ${
                              plan.isActive
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {plan.isActive
                              ? t("pricingPlans.active")
                              : t("pricingPlans.inactive")}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Empty State */}
          {plans.length === 0 && !loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <Card className="bg-white border border-orange-500 shadow-sm rounded-none">
                <CardContent className="p-8">
                  <FiDollarSign className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {t("pricingPlans.noPlansYet")}
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {t("pricingPlans.noPlansDescription")}
                  </p>
                  <button
                    onClick={() => setShowForm(true)}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-none hover:bg-blue-700 transition-colors border border-blue-600"
                  >
                    <FiPlus className="w-5 h-5" />
                    {t("pricingPlans.createFirstPlan")}
                  </button>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </main>

      {/* Create/Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white border border-blue-500 shadow-sm rounded-none max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">
                  {editingPlan
                    ? "Edit Pricing Plan"
                    : "Create New Pricing Plan"}
                </h2>
                <button
                  onClick={resetForm}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Plan Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, name: e.target.value }))
                    }
                    placeholder="e.g., Premium Retailer"
                    className="w-full px-4 py-3 border border-gray-300 rounded-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    placeholder="Describe what this plan offers"
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    required
                  />
                </div>
              </div>

              {/* Pricing Information */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Amount <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                      <FiDollarSign />
                    </span>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.amount}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          amount: e.target.value,
                        }))
                      }
                      placeholder="29.99"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Currency
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                      <FiGlobe />
                    </span>
                    <select
                      value={formData.currency}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          currency: e.target.value,
                        }))
                      }
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors appearance-none"
                    >
                      <option value="eur">EUR (€)</option>
                      <option value="usd">USD ($)</option>
                      <option value="gbp">GBP (£)</option>
                      <option value="cad">CAD (C$)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Billing Interval
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                      <FiCalendar />
                    </span>
                    <select
                      value={formData.interval}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          interval: e.target.value,
                        }))
                      }
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors appearance-none"
                    >
                      <option value="month">Monthly</option>
                      <option value="year">Yearly</option>
                      <option value="week">Weekly</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Features */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Features
                </label>
                <div className="space-y-3">
                  {formData.features.map((feature, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={feature}
                        onChange={(e) => updateFeature(index, e.target.value)}
                        placeholder="e.g., Unlimited flyers"
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      />
                      {formData.features.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeFeature(index)}
                          className="p-3 text-red-500 hover:text-red-700 transition-colors"
                        >
                          <FiX className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addFeature}
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    <FiPlus className="w-4 h-4" />
                    Add Feature
                  </button>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-3 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating}
                  className="px-6 py-3 bg-blue-600 text-white rounded-none hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isCreating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <FiSettings className="w-4 h-4" />
                      {editingPlan ? "Update Plan" : "Create Plan"}
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {showDeleteDialog && planToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white border border-red-500 shadow-sm rounded-none max-w-md w-full mx-4"
          >
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <FiTrash2 className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    {t("subscription.deletePlanTitle")}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {t("subscription.deletePlanSubtitle")}
                  </p>
                </div>
              </div>

              <div className="mb-6">
                <p className="text-gray-700 mb-3">
                  {t("subscription.deletePlanConfirm")}
                </p>
                <div className="bg-gray-50 rounded-none p-4 border border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-1">
                    {planToDelete.name}
                  </h4>
                  <p className="text-sm text-gray-600 mb-2">
                    {planToDelete.description}
                  </p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-gray-900">
                      {formatCurrency(
                        planToDelete.amount,
                        planToDelete.currency
                      )}
                    </span>
                    <span className="text-gray-500">
                      {t("subscription.per")} {planToDelete.interval}
                    </span>
                  </div>
                </div>

                {/* Warning Message */}
                <div className="mt-4 bg-amber-50 border border-amber-200 rounded-none p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg
                        className="w-3 h-3 text-amber-600"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div>
                      <h5 className="font-medium text-amber-800 mb-1">
                        {t("subscription.deletePlanWarning")}
                      </h5>
                      <p className="text-sm text-amber-700">
                        {t("subscription.deletePlanMessage")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={cancelDelete}
                  disabled={deletingPlanId === planToDelete.id}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors disabled:opacity-50"
                >
                  {t("subscription.deletePlanCancel")}
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={deletingPlanId === planToDelete.id}
                  className="px-4 py-2 bg-red-600 text-white rounded-none hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {deletingPlanId === planToDelete.id ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      {t("subscription.deletePlanDeleting")}
                    </>
                  ) : (
                    <>
                      <FiTrash2 className="w-4 h-4" />
                      {t("subscription.deletePlanDelete")}
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
      <Footer />
    </>
  );
}

export default function PricingPlans() {
  return <PricingPlansContent />;
}
