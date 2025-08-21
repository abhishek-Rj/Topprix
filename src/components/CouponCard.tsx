import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import {
  HiX,
  HiPencil,
  HiTrash,
  HiShoppingCart,
  HiHeart,
  HiEye,
  HiTag,
  HiCalendar,
  HiExternalLink,
  HiLocationMarker,
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
  isCode = false,
  isDiscount = false,
}: {
  label: string;
  value: string;
  isCode?: boolean;
  isDiscount?: boolean;
}) => (
  <div className="flex justify-between items-center text-xs sm:text-sm">
    <span className="text-gray-600 font-medium">{label}</span>
    <span
      className={clsx(
        "text-right",
        isCode && "text-base sm:text-md font-bold",
        isDiscount && "text-base sm:text-md font-bold text-yellow-600",
        !isCode && !isDiscount && "text-gray-800"
      )}
    >
      {value}
    </span>
  </div>
);

export const CouponCard = ({
  coupon,
  onEdit,
  onDelete,
}: {
  coupon: any;
  onEdit?: (coupon: any) => void;
  onDelete?: (couponId: string) => void;
}) => {
  const { t } = useTranslation();
  const [showPreview, setShowPreview] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [store, setStore] = useState<any>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [shoppingLists, setShoppingLists] = useState<any[]>([]);
  const [showShoppingListModal, setShowShoppingListModal] = useState(false);
  const [selectedListId, setSelectedListId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isInWishlist, setIsInWishlist] = useState(false);
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
    const startDate = new Date(coupon.startDate);
    const endDate = new Date(coupon.endDate);
    const today = new Date();

    // Reset time to start of day for accurate comparison
    const startOfToday = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    const startOfStartDate = new Date(
      startDate.getFullYear(),
      startDate.getMonth(),
      startDate.getDate()
    );
    const startOfEndDate = new Date(
      endDate.getFullYear(),
      endDate.getMonth(),
      endDate.getDate()
    );

    // Check if it's before start date
    if (startOfToday < startOfStartDate) {
      const diffTime = startOfStartDate.getTime() - startOfToday.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return { status: "soon", days: diffDays };
    }

    // Check if it's expired (after end date)
    if (startOfToday > startOfEndDate) {
      const diffTime = startOfToday.getTime() - startOfEndDate.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return { status: "expired", days: diffDays };
    }

    // Check if it's the last day
    if (startOfToday.getTime() === startOfEndDate.getTime()) {
      return { status: "last-day", days: 0 };
    }

    // It's active (between start and end date)
    const diffTime = startOfEndDate.getTime() - startOfToday.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return { status: "active", days: diffDays };
  };

  const getDateBadge = () => {
    const dateInfo = calculateDaysLeft();

    switch (dateInfo.status) {
      case "soon":
        return {
          text: t("store.soonDays", { days: dateInfo.days }),
          className: "bg-blue-100 text-blue-800 border-blue-200",
        };
      case "active":
        return {
          text: t("store.daysLeftText", { days: dateInfo.days }),
          className: "bg-green-100 text-green-800 border-green-200",
        };
      case "last-day":
        return {
          text: t("store.lastDayText"),
          className: "bg-orange-100 text-orange-800 border-orange-200",
        };
      case "expired":
        return {
          text: t("store.expiredText"),
          className: "bg-red-100 text-red-800 border-red-200",
        };
      default:
        return {
          text: "Unknown",
          className: "bg-gray-100 text-gray-800 border-gray-200",
        };
    }
  };

  useEffect(() => {
    const fetchStore = async () => {
      const res = await fetch(`${baseUrl}store/${coupon.storeId}`);
      if (res.ok) {
        const storeData = await res.json();
        setStore(storeData);
      }
    };
    fetchStore();
  }, [coupon.storeId]);

  const fetchShoppingLists = async () => {
    if (!userId) return;

    try {
      const response = await fetch(`${baseUrl}shopping-lists/${userId}`);
      if (response.ok) {
        const data = await response.json();
        setShoppingLists(data.shoppingLists || []);
      }
    } catch (error) {
      console.error("Error fetching shopping lists:", error);
    }
  };

  const addToShoppingList = async () => {
    if (!userId || !selectedListId) {
      toast.error("Please select a shopping list");
      return;
    }

    try {
      const response = await fetch(
        `${baseUrl}shopping-lists/${selectedListId}/items`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            couponId: coupon.id,
            quantity: quantity,
          }),
        }
      );

      if (response.ok) {
        toast.success("Coupon added to shopping list");
        setShowShoppingListModal(false);
        setSelectedListId("");
        setQuantity(1);
      } else {
        toast.error("Failed to add coupon to shopping list");
      }
    } catch (error) {
      console.error("Error adding to shopping list:", error);
      toast.error("Failed to add coupon to shopping list");
    }
  };

  const addToWishlist = async () => {
    if (!userId) {
      toast.error("Please log in to add to wishlist");
      return;
    }

    try {
      const response = await fetch(`${baseUrl}wishlist/${userId}/coupons`, {
        method: isInWishlist ? "DELETE" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: isInWishlist
          ? undefined
          : JSON.stringify({ couponId: coupon.id }),
      });

      if (response.ok) {
        setIsInWishlist(!isInWishlist);
        toast.success(
          isInWishlist
            ? "Coupon removed from wishlist"
            : "Coupon added to wishlist"
        );
      } else {
        toast.error("Failed to update wishlist");
      }
    } catch (error) {
      console.error("Error updating wishlist:", error);
      toast.error("Failed to update wishlist");
    }
  };

  const handleDelete = async () => {
    if (!onDelete) return;

    setIsDeleting(true);
    try {
      await onDelete(coupon.id);
      setShowDeleteDialogueBox(false);
    } catch (error) {
      console.error("Error deleting coupon:", error);
      toast.error("Failed to delete coupon");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onEdit) {
      onEdit(coupon);
    }
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDeleteDialogueBox(true);
  };

  const handleAddToShoppingList = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!userId) {
      toast.error("Please log in to add to shopping list");
      return;
    }
    fetchShoppingLists();
    setShowShoppingListModal(true);
  };

  return (
    <>
      <Card
        className={`group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-105 cursor-pointer ${
          calculateDaysLeft().status === "expired"
            ? "opacity-60 grayscale"
            : "hover:shadow-xl"
        }`}
        onClick={() => setShowPreview(true)}
      >
        <CardContent className="p-4 sm:p-6">
          {/* Header with Actions */}
          <div className="flex items-center justify-end mb-4">
            <div className="flex items-center gap-1 sm:gap-2">
              {user && userRole === "USER" && (
                <>
                  <button
                    onClick={handleAddToShoppingList}
                    className="p-1.5 sm:p-2 text-green-600 sm:hover:text-green-700 transition-colors rounded-full hover:bg-green-50"
                    title="Add to Shopping List"
                  >
                    <HiShoppingCart className="w-4 h-4" />
                  </button>
                  <button
                    onClick={addToWishlist}
                    className={`p-1.5 sm:p-2 transition-colors rounded-full hover:bg-red-50 ${
                      isInWishlist
                        ? "text-red-500"
                        : "text-gray-500 sm:hover:text-red-500"
                    }`}
                    title={
                      isInWishlist ? "Remove from Wishlist" : "Add to Wishlist"
                    }
                  >
                    <HiHeart size={16} />
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="flex flex-col items-center space-y-2 sm:space-y-3">
            {/* Title */}
            <h2 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-800 truncate text-center line-clamp-2">
              {coupon.title}
            </h2>

            {/* Images */}
            <div className="flex gap-2 sm:gap-4 justify-center">
              {coupon.barcodeUrl && (
                <img
                  src={coupon.barcodeUrl}
                  alt="Barcode"
                  className="w-16 h-16 sm:w-20 md:w-24 object-contain rounded-md shadow"
                />
              )}
              {coupon.qrCodeUrl && (
                <img
                  src={coupon.qrCodeUrl}
                  alt="QR Code"
                  className="w-16 h-16 sm:w-20 md:w-24 object-contain rounded-md shadow"
                />
              )}
            </div>

            {/* Valid Until */}
            <span
              className={`text-xs sm:text-sm font-medium px-2 py-1 rounded-full border ${
                getDateBadge().className
              }`}
            >
              {getDateBadge().text}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Preview Modal */}
      {showPreview && store && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Store Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {store.name}
                  </h2>
                  <p className="text-sm text-gray-600">{store.address}</p>
                </div>
                <div className="flex items-center gap-2">
                  {user && userRole === "USER" && (
                    <>
                      <button
                        onClick={handleAddToShoppingList}
                        className="p-2 text-green-600 sm:hover:text-green-700 transition-colors"
                        title="Add to Shopping List"
                      >
                        <HiShoppingCart className="w-5 h-5" />
                      </button>
                      <button
                        onClick={addToWishlist}
                        className={`p-2 transition-colors ${
                          isInWishlist
                            ? "text-red-500"
                            : "text-gray-500 sm:hover:text-red-500"
                        }`}
                        title={
                          isInWishlist
                            ? "Remove from Wishlist"
                            : "Add to Wishlist"
                        }
                      >
                        <HiHeart className="w-5 h-5" />
                      </button>
                    </>
                  )}
                  {isAuthorized && (
                    <>
                      <button
                        onClick={handleEdit}
                        className="p-2 text-yellow-600 sm:hover:text-yellow-700 transition-colors"
                        title="Edit Coupon"
                      >
                        <HiPencil className="w-5 h-5" />
                      </button>
                      <button
                        onClick={handleDeleteClick}
                        disabled={isDeleting}
                        className="p-2 text-red-600 sm:hover:text-red-700 transition-colors disabled:opacity-50"
                        title="Delete Coupon"
                      >
                        <HiTrash className="w-5 h-5" />
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => setShowPreview(false)}
                    className="p-2 text-gray-500 sm:hover:text-gray-700 transition-colors"
                  >
                    <HiX className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left Column */}
                <div className="space-y-6">
                  <section>
                    <h3 className="text-xl font-bold text-yellow-600 mb-4 border-b border-yellow-100 pb-2">
                      Coupon Details
                    </h3>
                    <div className="bg-yellow-50/70 rounded-2xl p-5 sm:p-6 shadow-inner space-y-4">
                      <DetailRow
                        label="Discount"
                        value={coupon.discount}
                        isDiscount={true}
                      />
                      <DetailRow
                        label="Code"
                        value={coupon.code}
                        isCode={true}
                      />
                      <DetailRow
                        label="Valid From"
                        value={new Date(coupon.startDate).toLocaleDateString()}
                      />
                      <DetailRow
                        label="Valid Until"
                        value={new Date(coupon.endDate).toLocaleDateString()}
                      />
                      <DetailRow
                        label="Status"
                        value={
                          calculateDaysLeft().status.charAt(0).toUpperCase() +
                          calculateDaysLeft().status.slice(1)
                        }
                      />
                      <DetailRow
                        label="Type"
                        value={coupon.isPremium ? "Premium" : "Standard"}
                      />
                      <div className="flex justify-between items-center text-xs sm:text-sm">
                        <span className="text-gray-600 font-medium">
                          Usage:
                        </span>
                        <div className="flex gap-2">
                          {coupon.isOnline && (
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                              Online
                            </span>
                          )}
                          {coupon.isInStore && (
                            <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                              In Store
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </section>

                  <section>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      Categories
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {coupon.categories?.map((cat: any) => (
                        <span
                          key={cat.id}
                          className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-sm"
                        >
                          {cat.name}
                        </span>
                      ))}
                    </div>
                  </section>

                  {coupon.description && (
                    <section>
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        Description
                      </h3>
                      <p className="text-gray-600">{coupon.description}</p>
                    </section>
                  )}
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  {/* Store Information */}
                  <section>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">
                      Store Information
                    </h3>
                    <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          {store.name}
                        </h4>
                        {store.description && (
                          <p className="text-sm text-gray-600">
                            {store.description}
                          </p>
                        )}
                      </div>

                      {store.address && (
                        <div className="flex items-start gap-2">
                          <HiLocationMarker className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-600">
                            {store.address}
                          </span>
                        </div>
                      )}

                      {store.phone && (
                        <div className="text-sm text-gray-600">
                          <span className="font-medium">Phone: </span>
                          {store.phone}
                        </div>
                      )}

                      {store.email && (
                        <div className="text-sm text-gray-600">
                          <span className="font-medium">Email: </span>
                          {store.email}
                        </div>
                      )}

                      {store.website && (
                        <div className="text-sm">
                          <a
                            href={store.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-yellow-600 hover:text-yellow-700 flex items-center gap-1"
                          >
                            Visit Website
                            <HiExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      )}
                    </div>
                  </section>

                  {/* Barcode and QR Code */}
                  <section>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">
                      Codes
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      {coupon.barcodeUrl && (
                        <div className="text-center">
                          <h4 className="text-sm font-medium text-gray-700 mb-2">
                            Barcode
                          </h4>
                          <img
                            src={coupon.barcodeUrl}
                            alt="Barcode"
                            className="w-full max-w-32 mx-auto object-contain rounded-lg shadow-sm"
                          />
                        </div>
                      )}
                      {coupon.qrCodeUrl && (
                        <div className="text-center">
                          <h4 className="text-sm font-medium text-gray-700 mb-2">
                            QR Code
                          </h4>
                          <img
                            src={coupon.qrCodeUrl}
                            alt="QR Code"
                            className="w-full max-w-32 mx-auto object-contain rounded-lg shadow-sm"
                          />
                        </div>
                      )}
                    </div>
                  </section>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Shopping List Modal */}
      {showShoppingListModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Add to Shopping List
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Shopping List
                </label>
                <select
                  value={selectedListId}
                  onChange={(e) => setSelectedListId(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                >
                  <option value="">Choose a list</option>
                  {shoppingLists.map((list) => (
                    <option key={list.id} value={list.id}>
                      {list.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quantity
                </label>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value))}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowShoppingListModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={addToShoppingList}
                className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-md transition-colors"
              >
                Add to List
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {showDeleteDialogueBox && (
        <ConfirmDeleteDialog
          open={showDeleteDialogueBox}
          onCancel={() => setShowDeleteDialogueBox(false)}
          onConfirm={handleDelete}
          isLoading={isDeleting}
          itemName="this coupon"
        />
      )}
    </>
  );
};

const CouponList = ({
  coupons,
  pagination,
  onPageChange,
  onEdit,
  onDelete,
}: {
  coupons: any[];
  pagination: any;
  onPageChange: (page: number) => void;
  onEdit?: (coupon: any) => void;
  onDelete?: (couponId: string) => void;
}) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      {/* Coupons Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {coupons.map((coupon) => (
          <CouponCard
            key={coupon.id}
            coupon={coupon}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>

      {/* Pagination */}
      {pagination && (
        <div className="flex justify-center items-center gap-2 mt-8">
          <button
            onClick={() => onPageChange(pagination.currentPage - 1)}
            disabled={pagination.currentPage === 1}
            className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span className="px-3 py-2 text-sm font-medium text-gray-700">
            Page {pagination.currentPage} of {pagination.totalPages}
          </span>
          <button
            onClick={() => onPageChange(pagination.currentPage + 1)}
            disabled={!pagination.hasNextPage}
            className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export { CouponList };
