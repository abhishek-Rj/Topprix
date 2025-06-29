import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { HiX, HiPencil, HiTrash, HiShoppingCart, HiHeart } from "react-icons/hi";
import clsx from "clsx";
import baseUrl from "@/hooks/baseurl";
import { toast } from "react-toastify";
import useAuthenticate from "@/hooks/authenticationt";
import ConfirmDeleteDialog from "./confirmDeleteOption";

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
  showlogo,
  onEdit,
  onDelete,
}: {
  coupon: any;
  showlogo: boolean;
  onEdit?: (coupon: any) => void;
  onDelete?: (couponId: string) => void;
}) => {
  const [showPreview, setShowPreview] = useState(false);
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

  const calculateDaysLeft = () => {
    const endDate = new Date(coupon.endDate);
    const today = new Date();
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  useEffect(() => {
    const fetchStore = async () => {
      const res = await fetch(`${baseUrl}store/${coupon.storeId}`);
      const data = await res.json();
      setStore(data);
    };

    if (coupon?.storeId) {
      fetchStore();
    }
  }, [coupon?.storeId]);

  const fetchShoppingLists = async () => {
    if (!user?.uid) return;
    
    try {
      const response = await fetch(`${baseUrl}api/users/${user.uid}/shopping-lists`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "user-email": user?.email || "",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setShoppingLists(data.shoppingLists || []);
      }
    } catch (error) {
      console.error("Error fetching shopping lists:", error);
    }
  };

  const addToShoppingList = async () => {
    if (!selectedListId || !user?.uid) return;

    try {
      const response = await fetch(`${baseUrl}api/shopping-lists/${selectedListId}/items`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "user-email": user?.email || "",
        },
        body: JSON.stringify({
          name: coupon.title,
          quantity: quantity,
          couponItemId: coupon.id,
        }),
      });

      if (response.ok) {
        toast.success("Item added to shopping list successfully");
        setShowShoppingListModal(false);
        setSelectedListId("");
        setQuantity(1);
      } else {
        throw new Error("Failed to add item to shopping list");
      }
    } catch (error) {
      console.error("Error adding item to shopping list:", error);
      toast.error("Failed to add item to shopping list");
    }
  };

  const toggleWishlist = async () => {
    if (!user) {
      toast.error("Please login to add items to wishlist");
      return;
    }

    try {
      const response = await fetch(`${baseUrl}favourites`, {
        method: isInWishlist ? "DELETE" : "POST",
        headers: {
          "Content-Type": "application/json",
          "user-email": user?.email || "",
        },
        body: JSON.stringify({
          couponId: coupon.id,
          type: "coupon"
        }),
      });

      if (response.ok) {
        setIsInWishlist(!isInWishlist);
        toast.success(isInWishlist ? "Removed from wishlist" : "Added to wishlist");
      } else {
        throw new Error("Failed to update wishlist");
      }
    } catch (error) {
      console.error("Error updating wishlist:", error);
      toast.error("Failed to update wishlist");
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    if (!isAuthorized) {
      toast.error("You are not authorized to delete coupons");
      return;
    }

    try {
      const response = await fetch(`${baseUrl}coupons/${coupon.id}`, {
        method: "DELETE",
        headers: {
          "user-email": user?.email || "",
        },
      });

      if (response.ok) {
        toast.success("Coupon deleted successfully");
        if (onDelete) {
          onDelete(coupon.id);
        }
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        throw new Error("Failed to delete coupon");
      }
    } catch (error) {
      toast.error("Error deleting coupon");
    } finally {
      setIsDeleting(false);
      setShowDeleteDialogueBox(false);
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent opening preview modal
    if (!isAuthorized) {
      toast.error("You are not authorized to edit coupons");
      return;
    }
    if (onEdit) {
      onEdit(coupon);
    }
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent opening preview modal
    setShowDeleteDialogueBox(true);
  };

  const handleAddToShoppingList = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      toast.error("Please login to add items to shopping list");
      return;
    }
    fetchShoppingLists();
    setShowShoppingListModal(true);
  };

  return (
    <>
      <Card
        className="w-full hover:translate-y-1 max-w-sm rounded-lg shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-all relative group"
        onClick={() => setShowPreview(true)}
      >
        <CardContent className="p-4 space-y-3">
        <div className="w-full max-w-sm rounded-lg shadow-sm overflow-hidden bg-white p-4 relative">
          {/* Action buttons overlay for USER role */}
          {user && userRole === "USER" && (
            <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
              <button
                onClick={handleAddToShoppingList}
                className="p-1.5 bg-white/90 hover:bg-white text-green-600 hover:text-green-700 rounded-full shadow-sm transition-colors"
                title="Add to Shopping List"
              >
                <HiShoppingCart size={16} />
              </button>
              <button
                onClick={toggleWishlist}
                className={`p-1.5 bg-white/90 hover:bg-white rounded-full shadow-sm transition-colors ${
                  isInWishlist ? "text-red-500" : "text-gray-500 hover:text-red-500"
                }`}
                title={isInWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
              >
                <HiHeart size={16} />
              </button>
            </div>
          )}
          
          <div className="flex flex-col items-center space-y-3">
            {/* Title */}
            <h2 className="text-lg font-semibold text-gray-800 truncate">
              {coupon.title}
            </h2>

            {/* Images */}
            <div className="flex gap-4 justify-center">
              {coupon.barcodeUrl && (
                <img
                  src={coupon.barcodeUrl}
                  alt="Barcode"
                  className="w-24 h-24 object-contain rounded-md shadow"
                />
              )}
              {coupon.qrCodeUrl && (
                <img
                  src={coupon.qrCodeUrl}
                  alt="QR Code"
                  className="w-24 h-24 object-contain rounded-md shadow"
                />
              )}
            </div>

            {/* Valid Until */}
            <span className="text-sm font-medium text-yellow-600">
            {calculateDaysLeft() === 0
                    ? "Last day" 
                    : (calculateDaysLeft() < 0) ? "Expired" :  calculateDaysLeft() + " days left"}
            </span>
          </div>
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
                <div className="flex items-center gap-4">
                  {store.logo && (
                    <img
                      src={store.logo}
                      alt={store.name}
                      className="w-12 h-12 rounded-xl object-cover shadow-md"
                    />
                  )}
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {store.name}
                    </h2>
                    <p className="text-sm text-gray-600">{store.address}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {user && userRole === "USER" && (
                    <>
                      <button
                        onClick={handleAddToShoppingList}
                        className="p-2 text-green-600 hover:text-green-700 transition-colors"
                        title="Add to Shopping List"
                      >
                        <HiShoppingCart className="w-5 h-5" />
                      </button>
                      <button
                        onClick={toggleWishlist}
                        className={`p-2 transition-colors ${
                          isInWishlist ? "text-red-500" : "text-gray-500 hover:text-red-500"
                        }`}
                        title={isInWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
                      >
                        <HiHeart className="w-5 h-5" />
                      </button>
                    </>
                  )}
                  {isAuthorized && (
                    <>
                      <button
                        onClick={handleEdit}
                        className="p-2 text-yellow-600 hover:text-yellow-700 transition-colors"
                        title="Edit Coupon"
                      >
                        <HiPencil className="w-5 h-5" />
                      </button>
                      <button
                        onClick={handleDeleteClick}
                        disabled={isDeleting}
                        className="p-2 text-red-600 hover:text-red-700 transition-colors disabled:opacity-50"
                        title="Delete Coupon"
                      >
                        <HiTrash className="w-5 h-5" />
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => setShowPreview(false)}
                    className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
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
                        value={calculateDaysLeft() > 0 ? "Active" : "Expired"}
                      />
                      <DetailRow
                        label="Type"
                        value={coupon.isPremium ? "Premium" : "Standard"}
                      />
                      <div className="flex justify-between items-center text-xs sm:text-sm">
                        <span className="text-gray-600 font-medium">Usage:</span>
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
                  {/* Store Details Section */}
                  <section>
                    <h3 className="text-xl font-bold text-yellow-600 mb-4 border-b border-yellow-100 pb-2">
                      Store Information
                    </h3>
                    <div className="bg-yellow-50/70 rounded-2xl p-5 sm:p-6 shadow-inner space-y-4">
                      <div className="flex items-center gap-4">
                        {store.logo && (
                          <img
                            src={store.logo}
                            alt={store.name}
                            className="w-16 h-16 rounded-xl object-cover shadow-md"
                          />
                        )}
                        <div>
                          <h4 className="text-lg font-semibold text-gray-800">
                            {store.name}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {store.address}
                          </p>
                        </div>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600 font-medium">
                          Store Type:
                        </span>
                        <span className="text-gray-800">
                          {store.type || "Retail"}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600 font-medium">
                          Contact:
                        </span>
                        <span className="text-gray-800">
                          {store.phone || "Not available"}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600 font-medium">
                          Email:
                        </span>
                        <span className="text-gray-800">
                          {store.email || "Not available"}
                        </span>
                      </div>
                    </div>
                  </section>

                  {/* Coupon Images */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      Coupon Codes
                    </h3>
                    <div className="flex gap-4 justify-center">
                      {coupon.barcodeUrl && (
                        <div className="text-center">
                          <img
                            src={coupon.barcodeUrl}
                            alt="Barcode"
                            className="w-32 h-32 object-contain rounded-lg shadow"
                          />
                          <p className="text-xs text-gray-600 mt-1">Barcode</p>
                        </div>
                      )}
                      {coupon.qrCodeUrl && (
                        <div className="text-center">
                          <img
                            src={coupon.qrCodeUrl}
                            alt="QR Code"
                            className="w-32 h-32 object-contain rounded-lg shadow"
                          />
                          <p className="text-xs text-gray-600 mt-1">QR Code</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {user && userRole === "USER" && (
                    <section>
                      <h3 className="text-xl font-bold text-green-600 mb-4 border-b border-green-100 pb-2">
                        Shopping Actions
                      </h3>
                      <div className="bg-green-50/70 rounded-2xl p-5 sm:p-6 shadow-inner space-y-3">
                        <button
                          onClick={handleAddToShoppingList}
                          className="w-full bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                        >
                          <HiShoppingCart className="w-5 h-5" />
                          Add to Shopping List
                        </button>
                        <button
                          onClick={toggleWishlist}
                          className={`w-full py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 ${
                            isInWishlist
                              ? "bg-red-500 hover:bg-red-600 text-white"
                              : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                          }`}
                        >
                          <HiHeart className="w-5 h-5" />
                          {isInWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
                        </button>
                      </div>
                    </section>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Shopping List Modal */}
      {showShoppingListModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Add to Shopping List
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Shopping List
                </label>
                <select
                  value={selectedListId}
                  onChange={(e) => setSelectedListId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Choose a list...</option>
                  {shoppingLists.map((list) => (
                    <option key={list.id} value={list.id}>
                      {list.title}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700">Quantity:</label>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  min="1"
                  className="w-20 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => {
                  setShowShoppingListModal(false);
                  setSelectedListId("");
                  setQuantity(1);
                }}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={addToShoppingList}
                disabled={!selectedListId}
                className="px-4 py-2 bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white rounded-md transition"
              >
                Add to List
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDeleteDialog
        open={showDeleteDialogueBox}
        onCancel={() => setShowDeleteDialogueBox(false)}
        onConfirm={handleDelete}
        isLoading={isDeleting}
        itemName="this coupon"
      />
    </>
  );
};

const CouponList = ({
  coupons,
  pagination,
  onPageChange,
  showLogo,
  onEdit,
  onDelete,
}: {
  coupons: any[];
  pagination: any;
  onPageChange: (page: number) => void;
  showLogo: boolean;
  onEdit?: (coupon: any) => void;
  onDelete?: (couponId: string) => void;
}) => {
  if (!Array.isArray(coupons)) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
        {coupons.map((coupon: any) => (
          <CouponCard
            showlogo={showLogo}
            key={coupon.id}
            coupon={coupon}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>

      {pagination && (
        <div className="flex justify-center gap-2 mt-6">
          <Button
            variant="outline"
            disabled={!pagination.hasPreviousPage}
            onClick={() => onPageChange(pagination.page - 1)}
          >
            Previous
          </Button>
          <div className="text-sm text-gray-600 translate-y-2">
            Page {pagination.page} of {pagination.totalPages}
          </div>
          <Button
            variant="outline"
            disabled={!pagination.hasNextPage}
            onClick={() => onPageChange(pagination.page + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};

export default CouponList;
