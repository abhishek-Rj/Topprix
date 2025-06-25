import { useState, useEffect } from "react";
import { useNavigate, useRouteLoaderData } from "react-router-dom";
import Navigation from "../../components/navigation";
import useAuthenticate from "../../hooks/authenticationt";
import Loader from "../../components/loading";
import baseUrl from "../../hooks/baseurl";
import { toast } from "react-toastify";
import {
  FiDollarSign,
  FiEdit,
  FiTrash2,
  FiPlus,
  FiCheck,
  FiX,
  FiCalendar,
  FiTag,
  FiGlobe,
  FiSettings,
} from "react-icons/fi";
import { motion } from "framer-motion";

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

export default function PricingPlans() {
  const { user, userRole, loading: authLoading } = useAuthenticate();
  const navigate = useNavigate();
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
          "user-email": localStorage.getItem('userEmail') || "",
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
      const response = await fetch(`${baseUrl}api/pricing-plans/${planToDelete.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "user-email": localStorage.getItem('userEmail') || "",
        },
      });

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
        features: formData.features.filter(feature => feature.trim() !== ""),
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

      const data = await response.json();
      
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
    setFormData(prev => ({
      ...prev,
      features: [...prev.features, ""],
    }));
  };

  const removeFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
  };

  const updateFeature = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.map((feature, i) => 
        i === index ? value : feature
      ),
    }));
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Navigation />
      <main className="pt-20 pb-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="bg-blue-100 p-3 rounded-full">
                <FiDollarSign className="w-8 h-8 text-blue-600" />
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
                Pricing Plans
              </h1>
            </div>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Manage subscription plans and pricing tiers for retailers
            </p>
          </motion.div>

          {/* Action Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex justify-between items-center mb-8"
          >
            <div className="text-sm text-gray-600">
              {plans.length} plan{plans.length !== 1 ? 's' : ''} available
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
            >
              <FiPlus className="w-5 h-5" />
              Create New Plan
            </button>
          </motion.div>

          {/* Pricing Plans Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
          >
            {plans.map((plan, index) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-1">
                        {plan.name}
                      </h3>
                      <p className="text-gray-600 text-sm">
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

                  <div className="mb-6">
                    <div className="text-3xl font-bold text-gray-900 mb-1">
                      {formatCurrency(plan.amount, plan.currency)}
                    </div>
                    <div className="text-sm text-gray-500 flex items-center gap-1">
                      <FiCalendar className="w-4 h-4" />
                      per {plan.interval}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-semibold text-gray-900 text-sm mb-3">
                      Features:
                    </h4>
                    {plan.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center gap-2">
                        <FiCheck className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span className="text-sm text-gray-600">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="px-6 py-3 bg-gray-50 border-t border-gray-100">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Status:</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      plan.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {plan.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Empty State */}
          {plans.length === 0 && !loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                <FiDollarSign className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No Pricing Plans Yet
                </h3>
                <p className="text-gray-600 mb-6">
                  Create your first pricing plan to start offering subscription options to retailers.
                </p>
                <button
                  onClick={() => setShowForm(true)}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <FiPlus className="w-5 h-5" />
                  Create First Plan
                </button>
              </div>
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
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">
                  {editingPlan ? 'Edit Pricing Plan' : 'Create New Pricing Plan'}
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
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Premium Retailer"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe what this plan offers"
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
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
                      onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                      placeholder="29.99"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
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
                      onChange={(e) => setFormData(prev => ({ ...prev, currency: e.target.value }))}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors appearance-none"
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
                      onChange={(e) => setFormData(prev => ({ ...prev, interval: e.target.value }))}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors appearance-none"
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
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
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
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isCreating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <FiSettings className="w-4 h-4" />
                      {editingPlan ? 'Update Plan' : 'Create Plan'}
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
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4"
          >
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <FiTrash2 className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    Delete Pricing Plan
                  </h3>
                  <p className="text-sm text-gray-600">
                    This action cannot be undone
                  </p>
                </div>
              </div>

              <div className="mb-6">
                <p className="text-gray-700 mb-3">
                  Are you sure you want to delete the pricing plan:
                </p>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-1">
                    {planToDelete.name}
                  </h4>
                  <p className="text-sm text-gray-600 mb-2">
                    {planToDelete.description}
                  </p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-gray-900">
                      {formatCurrency(planToDelete.amount, planToDelete.currency)}
                    </span>
                    <span className="text-gray-500">
                      per {planToDelete.interval}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={cancelDelete}
                  disabled={deletingPlanId === planToDelete.id}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={deletingPlanId === planToDelete.id}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {deletingPlanId === planToDelete.id ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <FiTrash2 className="w-4 h-4" />
                      Delete Plan
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
} 