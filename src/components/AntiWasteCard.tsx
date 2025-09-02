import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import {
  HiX,
  HiPencil,
  HiTrash,
  HiEye,
  HiTag,
  HiCalendar,
  HiExternalLink,
  HiLocationMarker,
  HiRefresh,
  HiClock,
  HiCurrencyDollar,
  HiShoppingBag,
} from "react-icons/hi";
import clsx from "clsx";
import baseUrl from "@/hooks/baseurl";
import { toast } from "react-toastify";
import useAuthenticate from "@/hooks/authenticationt";
import ConfirmDeleteDialog from "./confirmDeleteOption";
import { useTranslation } from "react-i18next";

const DetailRow = ({
  label,
  value,
  isPrice = false,
  isDiscount = false,
}: {
  label: string;
  value: string;
  isPrice?: boolean;
  isDiscount?: boolean;
}) => (
  <div className="flex justify-between items-center text-xs sm:text-sm">
    <span className="text-gray-600 font-medium">{label}</span>
    <span
      className={clsx(
        "text-right",
        isPrice && "text-base sm:text-md font-bold text-green-600",
        isDiscount && "text-base sm:text-md font-bold text-red-600",
        !isPrice && !isDiscount && "text-gray-800"
      )}
    >
      {value}
    </span>
  </div>
);

export const AntiWasteCard = ({
  item,
  onEdit,
  onDelete,
}: {
  item: any;
  onEdit?: (item: any) => void;
  onDelete?: (itemId: string) => void;
}) => {
  const { t } = useTranslation();
  const [userId, setUserId] = useState<string | null>(null);
  const [store, setStore] = useState<any>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const { user, userRole } = useAuthenticate();
  const [showDeleteDialogueBox, setShowDeleteDialogueBox] =
    useState<boolean>(false);
  const isAuthorized = userRole === "ADMIN" || userRole === "RETAILER";

  // Fetch user ID from backend when component mounts
  useEffect(() => {
    const fetchUserId = async () => {
      if (!user?.email) return;

      try {
        const response = await fetch(`${baseUrl}user/${user.email}`);
        if (!response.ok) {
          toast.error("Couldn't fetch user data");
          throw new Error("Couldn't fetch user data");
        }
        const userData = await response.json();
        setUserId(userData?.id);
      } catch (error) {
        console.error("Error fetching user ID:", error);
      }
    };

    fetchUserId();
  }, [user?.email]);

  const calculateDaysLeft = () => {
    const expiryDate = new Date(item.expiryDate);
    const today = new Date();

    // Reset time to start of day for accurate comparison
    const startOfToday = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    const startOfExpiryDate = new Date(
      expiryDate.getFullYear(),
      expiryDate.getMonth(),
      expiryDate.getDate()
    );

    // Check if it's expired (after expiry date)
    if (startOfToday > startOfExpiryDate) {
      const diffTime = startOfToday.getTime() - startOfExpiryDate.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return { status: "expired", days: diffDays };
    }

    // Check if it's the last day
    if (startOfToday.getTime() === startOfExpiryDate.getTime()) {
      return { status: "last-day", days: 0 };
    }

    // It's still valid (before expiry date)
    const diffTime = startOfExpiryDate.getTime() - startOfToday.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return { status: "valid", days: diffDays };
  };

  const getDateBadge = () => {
    const dateInfo = calculateDaysLeft();

    switch (dateInfo.status) {
      case "valid":
        return {
          text: t("antiWaste.daysLeft", { days: dateInfo.days }),
          className: "bg-green-100 text-green-800 border-green-200",
        };
      case "last-day":
        return {
          text: t("antiWaste.lastDay"),
          className: "bg-orange-100 text-orange-800 border-orange-200",
        };
      case "expired":
        return {
          text: t("antiWaste.expired"),
          className: "bg-red-100 text-red-800 border-red-200",
        };
      default:
        return {
          text: "Unknown",
          className: "bg-gray-100 text-gray-800 border-gray-200",
        };
    }
  };

  const calculateDiscountPercentage = () => {
    const originalPrice = parseFloat(item.originalPrice);
    const discountedPrice = parseFloat(item.discountedPrice);
    const discount = originalPrice - discountedPrice;
    const percentage = (discount / originalPrice) * 100;
    return Math.round(percentage);
  };

  const getConditionBadge = () => {
    const conditionMap: { [key: string]: { text: string; className: string } } =
      {
        NEAR_EXPIRY: {
          text: t("antiWaste.conditionNearExpiry"),
          className: "bg-red-100 text-red-800 border-red-200",
        },
        SURPLUS_STOCK: {
          text: t("antiWaste.conditionSurplusStock"),
          className: "bg-blue-100 text-blue-800 border-blue-200",
        },
        SEASONAL: {
          text: t("antiWaste.conditionSeasonal"),
          className: "bg-orange-100 text-orange-800 border-orange-200",
        },
        SLIGHTLY_DAMAGED: {
          text: t("antiWaste.conditionSlightlyDamaged"),
          className: "bg-yellow-100 text-yellow-800 border-yellow-200",
        },
        SHORT_DATED: {
          text: t("antiWaste.conditionShortDated"),
          className: "bg-purple-100 text-purple-800 border-purple-200",
        },
      };

    return (
      conditionMap[item.condition] || {
        text: item.condition,
        className: "bg-gray-100 text-gray-800 border-gray-200",
      }
    );
  };

  useEffect(() => {
    const fetchStore = async () => {
      const res = await fetch(`${baseUrl}store/${item.storeId}`);
      if (res.ok) {
        const storeData = await res.json();
        setStore(storeData);
      }
    };
    fetchStore();
  }, [item.storeId]);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(
        `${baseUrl}api/anti-waste-items/${item.id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "user-email": user?.email || "",
          },
        }
      );

      if (response.ok) {
        toast.success(t("antiWaste.itemDeletedSuccessfully"));
        onDelete?.(item.id);
      } else {
        toast.error(t("antiWaste.deleteError"));
      }
    } catch (error) {
      console.error("Error deleting anti-waste item:", error);
      toast.error(t("antiWaste.deleteError"));
    } finally {
      setIsDeleting(false);
      setShowDeleteDialogueBox(false);
    }
  };

  const dateBadge = getDateBadge();
  const conditionBadge = getConditionBadge();
  const discountPercentage = calculateDiscountPercentage();

  return (
    <>
      <Card className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md">
        <CardContent className="p-3 sm:p-4">
          {/* Header with store info and actions */}
          <div className="flex justify-between items-start mb-2">
            <div className="flex items-center gap-2">
              {store?.logo && (
                <img
                  src={store.logo}
                  alt={store.name}
                  className="w-5 h-5 rounded-full object-cover"
                />
              )}
              <div>
                <h3 className="font-semibold text-xs text-gray-900">
                  {store?.name || t("antiWaste.unknownStore")}
                </h3>
                <p className="text-xs text-gray-500">{item.category}</p>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => setShowPreviewModal(true)}
                className="p-1 text-gray-600 hover:text-gray-800 transition-colors"
                title={t("antiWaste.viewDetails")}
              >
                <HiEye size={14} />
              </button>
              {isAuthorized && (
                <>
                  <button
                    onClick={() => onEdit?.(item)}
                    className="p-1 text-blue-600 hover:text-blue-800 transition-colors"
                    title={t("antiWaste.editItem")}
                  >
                    <HiPencil size={14} />
                  </button>
                  <button
                    onClick={() => setShowDeleteDialogueBox(true)}
                    className="p-1 text-red-600 hover:text-red-800 transition-colors"
                    title={t("antiWaste.deleteItem")}
                  >
                    <HiTrash size={14} />
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Item image */}
          <div className="relative mb-3">
            <img
              src={item.imageUrl || "/placeholder-image.jpg"}
              alt={item.name}
              className="w-full h-24 sm:h-28 object-cover rounded-lg"
            />
            <div className="absolute top-1 left-1">
              <span className="px-1.5 py-0.5 text-xs font-medium rounded-full border bg-white/90 backdrop-blur-sm">
                -{discountPercentage}%
              </span>
            </div>
            <div className="absolute top-1 right-1">
              <span
                className={`px-1.5 py-0.5 text-xs font-medium rounded-full border ${conditionBadge.className}`}
              >
                {conditionBadge.text}
              </span>
            </div>
          </div>

          {/* Item details */}
          <div className="space-y-1.5 mb-3">
            <h4 className="font-semibold text-gray-900 text-sm line-clamp-1">
              {item.name}
            </h4>
            <p className="text-gray-600 text-xs line-clamp-2">
              {item.description}
            </p>

            <div className="flex justify-between items-center">
              <div>
                <span className="text-sm font-bold text-green-600">
                  ${parseFloat(item.discountedPrice).toFixed(2)}
                </span>
                <span className="text-xs text-gray-500 line-through ml-1">
                  ${parseFloat(item.originalPrice).toFixed(2)}
                </span>
              </div>
              <span className="text-xs text-gray-500">
                {item.quantity} {t("antiWaste.available")}
              </span>
            </div>
          </div>

          {/* Date badge */}
          <div className="mb-3">
            <span
              className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full border ${dateBadge.className}`}
            >
              <HiCalendar size={10} />
              {dateBadge.text}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <ConfirmDeleteDialog
        isOpen={showDeleteDialogueBox}
        onClose={() => setShowDeleteDialogueBox(false)}
        onConfirm={handleDelete}
        title={t("antiWaste.deleteItem")}
        message={t("antiWaste.deleteConfirmationMessage")}
        isLoading={isDeleting}
      />

      {/* Preview Modal */}
      {showPreviewModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Header */}
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold text-gray-900">
                  {item.name}
                </h3>
                <button
                  onClick={() => setShowPreviewModal(false)}
                  className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <HiX size={24} />
                </button>
              </div>

              {/* Image */}
              <div className="relative mb-6">
                <img
                  src={item.imageUrl || "/placeholder-image.jpg"}
                  alt={item.name}
                  className="w-full h-64 object-cover rounded-lg"
                />
                <div className="absolute top-3 left-3">
                  <span className="px-3 py-1 text-sm font-medium rounded-full border bg-white/90 backdrop-blur-sm">
                    -{discountPercentage}%
                  </span>
                </div>
                <div className="absolute top-3 right-3">
                  <span
                    className={`px-3 py-1 text-sm font-medium rounded-full border ${conditionBadge.className}`}
                  >
                    {conditionBadge.text}
                  </span>
                </div>
              </div>

              {/* Store Info */}
              <div className="flex items-center gap-3 mb-4 p-3 bg-gray-50 rounded-lg">
                {store?.logo && (
                  <img
                    src={store.logo}
                    alt={store.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                )}
                <div>
                  <h4 className="font-semibold text-gray-900">
                    {store?.name || t("antiWaste.unknownStore")}
                  </h4>
                  <p className="text-sm text-gray-600">{item.category}</p>
                </div>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-2">
                  {t("antiWaste.description")}
                </h4>
                <p className="text-gray-700 leading-relaxed">
                  {item.description}
                </p>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <HiCurrencyDollar className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="text-sm text-gray-600">
                        {t("antiWaste.originalPrice")}
                      </p>
                      <p className="text-lg font-bold text-gray-900">
                        ${parseFloat(item.originalPrice).toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <HiTag className="w-5 h-5 text-red-600" />
                    <div>
                      <p className="text-sm text-gray-600">
                        {t("antiWaste.discountedPrice")}
                      </p>
                      <p className="text-lg font-bold text-green-600">
                        ${parseFloat(item.discountedPrice).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <HiShoppingBag className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-600">
                        {t("antiWaste.quantity")}
                      </p>
                      <p className="text-lg font-bold text-gray-900">
                        {item.quantity} {t("antiWaste.available")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <HiClock className="w-5 h-5 text-orange-600" />
                    <div>
                      <p className="text-sm text-gray-600">
                        {t("antiWaste.expiresOn")}
                      </p>
                      <p className="text-lg font-bold text-gray-900">
                        {new Date(item.expiryDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Date Status */}
              <div className="mb-6">
                <span
                  className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-full border ${dateBadge.className}`}
                >
                  <HiCalendar size={16} />
                  {dateBadge.text}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export const AntiWasteList = ({
  items,
  pagination,
  onPageChange,
  onEdit,
  onDelete,
}: {
  items: any[];
  pagination?: any;
  onPageChange?: (page: number) => void;
  onEdit?: (item: any) => void;
  onDelete?: (itemId: string) => void;
}) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      {/* Items Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {items.map((item) => (
          <AntiWasteCard
            key={item.id}
            item={item}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex justify-center items-center gap-2">
          <button
            onClick={() => {
              console.log(
                "Previous page clicked, current page:",
                pagination.currentPage
              );
              onPageChange?.(pagination.currentPage - 1);
            }}
            disabled={pagination.currentPage <= 1}
            className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {t("store.previous")}
          </button>
          <span className="px-3 py-2 text-sm text-gray-700">
            {t("store.page")} {pagination.currentPage} {t("store.of")}{" "}
            {pagination.totalPages}
          </span>
          <button
            onClick={() => {
              console.log(
                "Next page clicked, current page:",
                pagination.currentPage
              );
              onPageChange?.(pagination.currentPage + 1);
            }}
            disabled={pagination.currentPage >= pagination.totalPages}
            className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {t("store.next")}
          </button>
        </div>
      )}
    </div>
  );
};
