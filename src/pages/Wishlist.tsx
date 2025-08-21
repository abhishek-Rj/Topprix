import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  FiHeart,
  FiTrash2,
  FiEdit,
  FiPlus,
  FiImage,
  FiFileText,
  FiTag,
} from "react-icons/fi";
import Navigation from "../components/navigation";
import Footer from "../components/Footer";
import useAuthenticate from "@/hooks/authenticationt";
import baseUrl from "@/hooks/baseurl";
import { toast } from "react-toastify";

interface WishlistItem {
  id: string;
  name: string;
  flyerItemId?: string;
  couponItemId?: string;
  targetPrice?: number;
  dateAdded: string;
  imageUrl?: string;
  itemType?: "flyer" | "coupon" | "manual";
}

export default function WishlistPage() {
  const { t } = useTranslation();
  const { user } = useAuthenticate();
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editTargetPrice, setEditTargetPrice] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItemName, setNewItemName] = useState("");
  const [newTargetPrice, setNewTargetPrice] = useState("");

  useEffect(() => {
    if (user) {
      fetchWishlist();
    }
  }, [user]);

  const fetchWishlist = async () => {
    if (!user?.email) return;

    try {
      // First get the user ID from the backend
      const userResponse = await fetch(`${baseUrl}user/${user.email}`, {
        headers: {
          "Content-Type": "application/json",
          "user-email": user?.email || "",
        },
      });
      if (!userResponse.ok) {
        throw new Error("Failed to fetch user data");
      }
      const userData = await userResponse.json();

      // Then fetch the wishlist using the backend user ID
      const response = await fetch(
        `${baseUrl}api/users/${userData.id}/wishlist`,
        {
          headers: {
            "Content-Type": "application/json",
            "user-email": user?.email || "",
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        const items = data.wishlistItems || [];

        console.log(items);

        // Fetch additional data for each item to get images
        const enrichedItems = await Promise.all(
          items.map(async (item: WishlistItem) => {
            let imageUrl = item.imageUrl;
            let itemType = item.itemType || "manual";

            // If item has flyerItemId, fetch flyer data
            if (item.flyerItemId) {
              try {
                const flyerResponse = await fetch(
                  `${baseUrl}flyers/${item.flyerItemId}`
                );
                if (flyerResponse.ok) {
                  const flyerData = await flyerResponse.json();
                  imageUrl = flyerData.imageUrl; // Flyers use imageUrl
                  itemType = "flyer";
                }
              } catch (error) {
                console.error("Error fetching flyer data:", error);
              }
            }

            // If item has couponItemId, fetch coupon data
            if (item.couponItemId) {
              try {
                const couponResponse = await fetch(
                  `${baseUrl}coupons/${item.couponItemId}`
                );
                if (couponResponse.ok) {
                  const couponData = await couponResponse.json();
                  // Coupons use barcodeUrl or qrCodeUrl as their main image

                  imageUrl = couponData.barcodeUrl || couponData.qrCodeUrl;
                  itemType = "coupon";
                  console.log(imageUrl);
                }
              } catch (error) {
                console.error("Error fetching coupon data:", error);
              }
            }

            return {
              ...item,
              imageUrl,
              itemType,
            };
          })
        );

        setWishlistItems(enrichedItems);
      } else {
        console.error("Failed to fetch wishlist");
      }
    } catch (error) {
      console.error("Error fetching wishlist:", error);
      toast.error("Failed to load wishlist");
    } finally {
      setLoading(false);
    }
  };

  const addToWishlist = async () => {
    if (!user?.email || !newItemName.trim()) return;

    try {
      // First get the user ID from the backend
      const userResponse = await fetch(`${baseUrl}user/${user.email}`, {
        headers: {
          "Content-Type": "application/json",
          "user-email": user?.email || "",
        },
      });
      if (!userResponse.ok) {
        throw new Error("Failed to fetch user data");
      }
      const userData = await userResponse.json();

      const response = await fetch(
        `${baseUrl}api/users/${userData.id}/wishlist`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "user-email": user?.email || "",
          },
          body: JSON.stringify({
            name: newItemName,
            targetPrice: newTargetPrice
              ? parseFloat(newTargetPrice)
              : undefined,
          }),
        }
      );

      if (response.ok) {
        toast.success("Item added to wishlist successfully!");
        setNewItemName("");
        setNewTargetPrice("");
        setShowAddForm(false);
        fetchWishlist();
      } else {
        throw new Error("Failed to add item to wishlist");
      }
    } catch (error) {
      console.error("Error adding to wishlist:", error);
      toast.error("Failed to add item to wishlist");
    }
  };

  const updateWishlistItem = async (itemId: string) => {
    try {
      const response = await fetch(`${baseUrl}api/wishlist-items/${itemId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "user-email": user?.email || "",
        },
        body: JSON.stringify({
          name: editName,
          targetPrice: editTargetPrice
            ? parseFloat(editTargetPrice)
            : undefined,
        }),
      });

      if (response.ok) {
        toast.success("Wishlist item updated successfully!");
        setEditingItem(null);
        setEditName("");
        setEditTargetPrice("");
        fetchWishlist();
      } else {
        throw new Error("Failed to update wishlist item");
      }
    } catch (error) {
      console.error("Error updating wishlist item:", error);
      toast.error("Failed to update wishlist item");
    }
  };

  const deleteWishlistItem = async (itemId: string) => {
    try {
      const response = await fetch(`${baseUrl}api/wishlist-items/${itemId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "user-email": user?.email || "",
        },
      });

      if (response.ok) {
        toast.success("Wishlist item deleted successfully!");
        fetchWishlist();
      } else {
        throw new Error("Failed to delete wishlist item");
      }
    } catch (error) {
      console.error("Error deleting wishlist item:", error);
      toast.error("Failed to delete wishlist item");
    }
  };

  const startEditing = (item: WishlistItem) => {
    setEditingItem(item.id);
    setEditName(item.name);
    setEditTargetPrice(item.targetPrice?.toString() || "");
  };

  const cancelEditing = () => {
    setEditingItem(null);
    setEditName("");
    setEditTargetPrice("");
  };

  const getItemTypeBadge = (itemType: string) => {
    switch (itemType) {
      case "flyer":
        return (
          <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
            Flyer
          </span>
        );
      case "coupon":
        return (
          <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
            Coupon
          </span>
        );
      default:
        return (
          <span className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">
            Manual
          </span>
        );
    }
  };

  // Filter items by type
  const flyerItems = wishlistItems.filter((item) => item.itemType === "flyer");
  const couponItems = wishlistItems.filter(
    (item) => item.itemType === "coupon"
  );
  const manualItems = wishlistItems.filter(
    (item) => item.itemType === "manual"
  );

  if (loading) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen bg-yellow-50 pt-20">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="bg-white p-4 rounded-lg shadow">
                    <div className="w-full h-32 bg-gray-200 rounded mb-3"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-yellow-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
            {/* Header Section with Background */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 bg-yellow-100 border border-yellow-200 rounded-xl px-4 py-3 shadow-inner">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center">
                <FiHeart className="mr-3 text-red-500" />
                My Wishlist
              </h1>
            </div>

            {/* Add Item Form */}
            {showAddForm && (
              <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                <h3 className="text-lg font-semibold mb-4">Add New Item</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Item Name
                    </label>
                    <input
                      type="text"
                      value={newItemName}
                      onChange={(e) => setNewItemName(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                      placeholder="Enter item name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Target Price (Optional)
                    </label>
                    <input
                      type="number"
                      value={newTargetPrice}
                      onChange={(e) => setNewTargetPrice(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                      placeholder="Enter target price"
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-3 mt-4">
                  <button
                    onClick={() => {
                      setShowAddForm(false);
                      setNewItemName("");
                      setNewTargetPrice("");
                    }}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={addToWishlist}
                    disabled={!newItemName.trim()}
                    className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Add Item
                  </button>
                </div>
              </div>
            )}

            {/* Empty State */}
            {wishlistItems.length === 0 ? (
              <div className="text-center py-12">
                <FiHeart className="mx-auto text-gray-400 text-6xl mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  Your wishlist is empty
                </h3>
                <p className="text-gray-500">
                  Start adding items to your wishlist to track products you're
                  interested in.
                </p>
              </div>
            ) : (
              <div className="space-y-8">
                {/* Flyers Section */}
                {flyerItems.length > 0 && (
                  <section>
                    <div className="flex items-center mb-6">
                      <FiFileText className="text-blue-600 text-2xl mr-3" />
                      <h2 className="text-2xl font-bold text-gray-900">
                        Flyers
                      </h2>
                      <span className="ml-3 bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
                        {flyerItems.length} item
                        {flyerItems.length !== 1 ? "s" : ""}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {flyerItems.map((item) => (
                        <WishlistCard
                          key={item.id}
                          item={item}
                          onEdit={startEditing}
                          onDelete={deleteWishlistItem}
                          editingItem={editingItem}
                          editName={editName}
                          setEditName={setEditName}
                          editTargetPrice={editTargetPrice}
                          setEditTargetPrice={setEditTargetPrice}
                          onSave={updateWishlistItem}
                          onCancel={cancelEditing}
                        />
                      ))}
                    </div>
                  </section>
                )}

                {/* Coupons Section */}
                {couponItems.length > 0 && (
                  <section>
                    <div className="flex items-center mb-6">
                      <FiTag className="text-green-600 text-2xl mr-3" />
                      <h2 className="text-2xl font-bold text-gray-900">
                        Coupons
                      </h2>
                      <span className="ml-3 bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full">
                        {couponItems.length} item
                        {couponItems.length !== 1 ? "s" : ""}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {couponItems.map((item) => (
                        <WishlistCard
                          key={item.id}
                          item={item}
                          onEdit={startEditing}
                          onDelete={deleteWishlistItem}
                          editingItem={editingItem}
                          editName={editName}
                          setEditName={setEditName}
                          editTargetPrice={editTargetPrice}
                          setEditTargetPrice={setEditTargetPrice}
                          onSave={updateWishlistItem}
                          onCancel={cancelEditing}
                        />
                      ))}
                    </div>
                  </section>
                )}

                {/* Manual Items Section */}
                {manualItems.length > 0 && (
                  <section>
                    <div className="flex items-center mb-6">
                      <span className="ml-3 bg-gray-100 text-gray-800 text-sm px-3 py-1 rounded-full">
                        {manualItems.length} item
                        {manualItems.length !== 1 ? "s" : ""}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {manualItems.map((item) => (
                        <WishlistCard
                          key={item.id}
                          item={item}
                          onEdit={startEditing}
                          onDelete={deleteWishlistItem}
                          editingItem={editingItem}
                          editName={editName}
                          setEditName={setEditName}
                          editTargetPrice={editTargetPrice}
                          setEditTargetPrice={setEditTargetPrice}
                          onSave={updateWishlistItem}
                          onCancel={cancelEditing}
                        />
                      ))}
                    </div>
                  </section>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

// WishlistCard Component
const WishlistCard = ({
  item,
  onEdit,
  onDelete,
  editingItem,
  editName,
  setEditName,
  editTargetPrice,
  setEditTargetPrice,
  onSave,
  onCancel,
}: {
  item: WishlistItem;
  onEdit: (item: WishlistItem) => void;
  onDelete: (itemId: string) => void;
  editingItem: string | null;
  editName: string;
  setEditName: (name: string) => void;
  editTargetPrice: string;
  setEditTargetPrice: (price: string) => void;
  onSave: (itemId: string) => void;
  onCancel: () => void;
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow w-full max-w-sm">
      {editingItem === item.id ? (
        <div className="p-4">
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Item Name
              </label>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Target Price
              </label>
              <input
                type="number"
                value={editTargetPrice}
                onChange={(e) => setEditTargetPrice(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button
                onClick={onCancel}
                className="px-3 py-1 text-gray-600 hover:text-gray-800 text-sm"
              >
                Cancel
              </button>
              <button
                onClick={() => onSave(item.id)}
                disabled={!editName.trim()}
                className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Image */}
          <div className="h-24 bg-gray-100 flex items-center justify-center">
            {item.imageUrl ? (
              <img
                src={item.imageUrl}
                alt={item.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <FiImage className="w-6 h-6 text-gray-400" />
            )}
          </div>

          {/* Content */}
          <div className="p-2">
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-sm font-semibold text-gray-900 truncate">
                {item.name}
              </h3>
              {getItemTypeBadge(item.itemType || "manual")}
            </div>

            {item.targetPrice && (
              <p className="text-green-600 font-medium mb-1 text-xs">
                Target: ${item.targetPrice}
              </p>
            )}

            <p className="text-xs text-gray-500 mb-1">
              Added {new Date(item.dateAdded).toLocaleDateString()}
            </p>

            {/* Action Buttons */}
            <div className="flex space-x-1">
              <button
                onClick={() => onEdit(item)}
                className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-600 py-0.5 px-1.5 rounded text-xs font-medium transition-colors"
              >
                <FiEdit className="w-2.5 h-2.5 inline mr-0.5" />
                Edit
              </button>
              <button
                onClick={() => onDelete(item.id)}
                className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 py-0.5 px-1.5 rounded text-xs font-medium transition-colors"
              >
                <FiTrash2 className="w-2.5 h-2.5 inline mr-0.5" />
                Delete
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

const getItemTypeBadge = (itemType: string) => {
  switch (itemType) {
    case "flyer":
      return (
        <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
          Flyer
        </span>
      );
    case "coupon":
      return (
        <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
          Coupon
        </span>
      );
    default:
      return (
        <span className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">
          Manual
        </span>
      );
  }
};
