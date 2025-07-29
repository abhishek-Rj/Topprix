import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { HiPencil, HiTrash, HiShoppingCart, HiHeart } from "react-icons/hi";
import baseUrl from "@/hooks/baseurl";
import { toast } from "react-toastify";
import useAuthenticate from "@/hooks/authenticationt";
import ConfirmDeleteDialog from "./confirmDeleteOption";
import { FiImage } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export const FlyerCard = ({
  flyer,
  onEdit,
  onDelete,
}: {
  flyer: any;
  onEdit?: (flyer: any) => void;
  onDelete?: (flyerId: string) => void;
}) => {
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
  const navigate = useNavigate();

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

  useEffect(() => {
    const fetchStore = async () => {
      const res = await fetch(`${baseUrl}store/${flyer.storeId}`);
      const data = await res.json();
      setStore(data);
    };

    if (flyer?.storeId) {
      fetchStore();
    }
  }, [flyer?.storeId]);

  const fetchShoppingLists = async () => {
    if (!userId) {
      toast.error("User data not available. Please try again.");
      return;
    }

    try {
      const response = await fetch(
        `${baseUrl}api/users/${userId}/shopping-lists`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "user-email": user?.email || "",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setShoppingLists(data.shoppingLists || []);
      } else {
        throw new Error("Failed to fetch shopping lists");
      }
    } catch (error) {
      console.error("Error fetching shopping lists:", error);
      toast.error("Failed to fetch shopping lists");
    }
  };

  const addToShoppingList = async () => {
    if (!selectedListId || !userId) {
      toast.error("Please select a shopping list");
      return;
    }

    try {
      const response = await fetch(
        `${baseUrl}api/shopping-lists/${selectedListId}/items`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "user-email": user?.email || "",
          },
          body: JSON.stringify({
            name: flyer.title,
            quantity: quantity,
            flyerItemId: flyer.id,
          }),
        }
      );

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

  const addToWishlist = async () => {
    if (!user) {
      toast.error("Please login to add items to wishlist");
      return;
    }

    if (!userId) {
      toast.error("User data not available. Please try again.");
      return;
    }

    try {
      const response = await fetch(`${baseUrl}api/users/${userId}/wishlist`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "user-email": user?.email || "",
        },
        body: JSON.stringify({
          name: flyer.title,
          flyerItemId: flyer.id,
        }),
      });

      if (response.ok) {
        toast.success("Added to wishlist successfully!");
      } else {
        throw new Error("Failed to add to wishlist");
      }
    } catch (error) {
      console.error("Error adding to wishlist:", error);
      toast.error("Failed to add to wishlist");
    }
  };

  const calculateDaysLeft = () => {
    const endDate = new Date(flyer.endDate);
    const today = new Date();
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    if (!isAuthorized) {
      toast.error("You are not authorized to delete flyers");
      return;
    }

    try {
      const response = await fetch(`${baseUrl}flyers/${flyer.id}`, {
        method: "DELETE",
        headers: {
          "user-email": user?.email || "",
        },
      });

      if (response.ok) {
        toast.success("Flyer deleted successfully");
        if (onDelete) {
          onDelete(flyer.id);
        }
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        throw new Error("Failed to delete flyer");
      }
    } catch (error) {
      toast.error("Error deleting flyer");
    } finally {
      setIsDeleting(false);
      setShowDeleteDialogueBox(false);
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAuthorized) {
      toast.error("You are not authorized to edit flyers");
      return;
    }
    if (onEdit) {
      onEdit(flyer);
    }
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
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
        className="w-full hover:translate-y-1 rounded-lg shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-all relative group"
        onClick={() => navigate(`/flyers/${flyer.id}`)}
      >
        <CardContent className="p-4">
          {/* Mobile Layout - Horizontal */}
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Image Section */}
            <div className="relative w-full sm:w-32 h-32 sm:h-24 overflow-hidden rounded-lg flex-shrink-0">
              {flyer.imageUrl ? (
                <img
                  src={flyer.imageUrl}
                  alt={flyer.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <FiImage className="w-8 h-8 text-gray-400" />
                </div>
              )}

              {/* Action buttons overlay for USER role */}
              {user && userRole === "USER" && (
                <div className="absolute top-1 right-1 flex gap-1 opacity-0 sm:group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToShoppingList(e);
                    }}
                    className="p-1 bg-white/90 sm:hover:bg-white text-green-600 sm:hover:text-green-700 rounded-full shadow-sm transition-colors"
                    title="Add to Shopping List"
                  >
                    <HiShoppingCart size={12} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      addToWishlist();
                    }}
                    className={`p-1 bg-white/90 sm:hover:bg-white rounded-full shadow-sm transition-colors ${
                      isInWishlist
                        ? "text-red-500"
                        : "text-gray-500 sm:hover:text-red-500"
                    }`}
                    title={
                      isInWishlist ? "Remove from Wishlist" : "Add to Wishlist"
                    }
                  >
                    <HiHeart size={12} />
                  </button>
                </div>
              )}
            </div>

            {/* Content Section */}
            <div className="flex-1 min-w-0">
              <h2 className="text-sm sm:text-lg font-semibold text-gray-800 line-clamp-2 mb-2">
                {flyer.title}
              </h2>
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm font-medium text-yellow-600">
                  {calculateDaysLeft() === 0
                    ? "Last day"
                    : calculateDaysLeft() < 0
                    ? "Expired"
                    : calculateDaysLeft() + " days left"}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

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
                <label className="text-sm font-medium text-gray-700">
                  Quantity:
                </label>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) =>
                    setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                  }
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
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md sm:hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={addToShoppingList}
                disabled={!selectedListId}
                className="px-4 py-2 bg-green-500 sm:hover:bg-green-600 disabled:bg-gray-300 text-white rounded-md transition"
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
        itemName="this flyer"
      />
    </>
  );
};

const FlyerList = ({
  flyers,
  pagination,
  onPageChange,
  onEdit,
  onDelete,
}: {
  flyers: any[];
  pagination: any;
  onPageChange: (page: number) => void;
  onEdit?: (flyer: any) => void;
  onDelete?: (flyerId: string) => void;
}) => {
  if (!Array.isArray(flyers)) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
        {flyers.map((flyer: any) => (
          <FlyerCard
            key={flyer.id}
            flyer={flyer}
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

export default FlyerList;
