import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  HiArrowLeft,
  HiX,
  HiShoppingCart,
  HiHeart,
  HiPencil,
  HiTrash,
} from "react-icons/hi";
import { FaStore } from "react-icons/fa";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { toast } from "react-toastify";
import baseUrl from "@/hooks/baseurl";
import useAuthenticate from "@/hooks/authenticationt";
import ConfirmDeleteDialog from "@/components/confirmDeleteOption";

// Set up PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

export default function FlyerDetail() {
  const { flyerId } = useParams();
  const navigate = useNavigate();
  const [flyer, setFlyer] = useState<any>(null);
  const [store, setStore] = useState<any>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [shoppingLists, setShoppingLists] = useState<any[]>([]);
  const [showShoppingListModal, setShowShoppingListModal] = useState(false);
  const [selectedListId, setSelectedListId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteDialogueBox, setShowDeleteDialogueBox] =
    useState<boolean>(false);
  const { user, userRole } = useAuthenticate();

  const isAuthorized = userRole === "ADMIN" || userRole === "RETAILER";

  // Check if the flyer is a PDF
  const isPdf = flyer?.imageUrl?.toLowerCase().includes(".pdf");

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

  // Fetch flyer data
  useEffect(() => {
    const fetchFlyer = async () => {
      if (!flyerId) {
        toast.error("No flyer ID provided");
        navigate("/explore/flyers");
        return;
      }

      try {
        const response = await fetch(`${baseUrl}flyers/${flyerId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch flyer");
        }
        const data = await response.json();
        setFlyer(data);
      } catch (err) {
        console.error("Error fetching flyer:", err);
        toast.error("Failed to load flyer");
        navigate("/explore/flyers");
      }
    };

    fetchFlyer();
  }, [flyerId, navigate]);

  // Fetch store data
  useEffect(() => {
    const fetchStore = async () => {
      if (!flyer?.storeId) return;

      try {
        const res = await fetch(`${baseUrl}store/${flyer.storeId}`);
        const data = await res.json();
        setStore(data);
      } catch (error) {
        console.error("Error fetching store:", error);
      }
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
    if (!flyer?.endDate) return 0;
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
        setTimeout(() => {
          navigate("/explore/flyers");
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

  const handleEdit = () => {
    if (!isAuthorized) {
      toast.error("You are not authorized to edit flyers");
      return;
    }
    // Navigate to edit page or open edit modal
    navigate(`/flyers/edit/${flyer.id}`);
  };

  const handleAddToShoppingList = () => {
    if (!user) {
      toast.error("Please login to add items to shopping list");
      return;
    }
    fetchShoppingLists();
    setShowShoppingListModal(true);
  };

  if (!flyer) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600"></div>
          <span className="text-lg text-gray-500 mt-4">Loading flyer...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Fixed Header with Navigation and Title */}
      <div className="fixed top-0 left-0 right-0 bg-gradient-to-r h-12 from-yellow-800 to-yellow-700 text-white shadow-md z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
          <div className="flex items-center justify-between h-full">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center text-white/80 hover:text-white transition-colors"
              >
                <HiArrowLeft className="w-4 h-4 mr-1" />
                Back
              </button>
              <h1 className="text-base font-semibold truncate">
                {flyer.title}
              </h1>
            </div>

            <div className="flex items-center gap-1">
              {user && userRole === "USER" && (
                <>
                  <button
                    onClick={handleAddToShoppingList}
                    className="p-1.5 text-white/80 hover:text-white transition-colors"
                    title="Add to Shopping List"
                  >
                    <HiShoppingCart className="w-4 h-4" />
                  </button>
                  <button
                    onClick={addToWishlist}
                    className={`p-1.5 transition-colors ${
                      isInWishlist
                        ? "text-red-300"
                        : "text-white/80 hover:text-white"
                    }`}
                    title={
                      isInWishlist ? "Remove from Wishlist" : "Add to Wishlist"
                    }
                  >
                    <HiHeart className="w-4 h-4" />
                  </button>
                </>
              )}
              {isAuthorized && (
                <>
                  <button
                    onClick={handleEdit}
                    className="p-1.5 text-white/80 hover:text-white transition-colors"
                    title="Edit Flyer"
                  >
                    <HiPencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setShowDeleteDialogueBox(true)}
                    disabled={isDeleting}
                    className="p-1.5 text-white/80 hover:text-white transition-colors disabled:opacity-50"
                    title="Delete Flyer"
                  >
                    <HiTrash className="w-4 h-4" />
                  </button>
                </>
              )}
              <button
                onClick={() => navigate(-1)}
                className="p-1.5 text-white/80 hover:text-white transition-colors"
              >
                <HiX className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Store Details Bar */}
      {store && (
        <div className="fixed top-12 left-0 right-0 bg-gradient-to-r from-yellow-50 to-orange-50 border-b border-yellow-200 shadow-md z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center justify-between">
              {/* Store Info */}
              <div className="flex items-center gap-4">
                {store.logo && (
                  <div className="relative">
                    <img
                      src={store.logo}
                      alt={store.name}
                      className="w-12 h-12 rounded-xl object-cover border-2 border-white shadow-md"
                    />
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                  </div>
                )}
                <div className="flex-1">
                  <h2 className="text-lg font-bold text-gray-900 mb-1">
                    {store.name}
                  </h2>
                  <p className="text-sm text-gray-600 mb-2 line-clamp-1">
                    {store.description}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    {store.phone && (
                      <span className="flex items-center gap-1">
                        <span className="text-green-600">📞</span>
                        {store.phone}
                      </span>
                    )}
                    {store.email && (
                      <span className="flex items-center gap-1">
                        <span className="text-blue-600">📧</span>
                        {store.email}
                      </span>
                    )}
                    {store.type && (
                      <span className="flex items-center gap-1">
                        <span className="text-purple-600">🏪</span>
                        {store.type}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Status and Tags */}
              <div className="flex items-end gap-3">
                {/* Status Badge */}
                <span
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm ${
                    calculateDaysLeft() > 0
                      ? "bg-green-500 text-white"
                      : calculateDaysLeft() === 0
                      ? "bg-orange-500 text-white"
                      : "bg-red-500 text-white"
                  }`}
                >
                  {calculateDaysLeft() === 0
                    ? "Last day"
                    : calculateDaysLeft() < 0
                    ? "Expired"
                    : `${calculateDaysLeft()} days left`}
                </span>

                {/* Flyer Type Badge */}
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm">
                  {flyer.isPremium ? "Premium Flyer" : "Standard Flyer"}
                </div>

                {/* Categories - Horizontal Layout */}
                {flyer.categories && flyer.categories.length > 0 && (
                  <div className="flex flex-wrap gap-1 max-w-48 justify-end">
                    {flyer.categories.slice(0, 3).map((cat: any) => (
                      <span
                        key={cat.id}
                        className="bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-medium shadow-sm"
                      >
                        {cat.name}
                      </span>
                    ))}
                    {flyer.categories.length > 3 && (
                      <span className="bg-gray-400 text-white px-2 py-1 rounded-full text-xs font-medium shadow-sm">
                        +{flyer.categories.length - 3}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area - Flyer Display with Top Padding Only */}
      <div className="pt-24 bg-gray-100 overflow-hidden">
        {isPdf ? (
          // PDF Display - Direct in container
          <div className="h-full w-full">
            <Document
              file={flyer.imageUrl}
              onLoadSuccess={({ numPages }) => setNumPages(numPages)}
              onLoadError={(error) => {
                console.error("Error loading PDF:", error);
                toast.error("Failed to load PDF");
              }}
              loading={
                <div className="flex flex-col items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600"></div>
                  <span className="text-lg text-gray-500 mt-4">
                    Loading PDF...
                  </span>
                </div>
              }
              error={
                <div className="flex flex-col items-center justify-center h-full">
                  <div className="text-red-600 text-2xl font-bold mb-4">
                    PDF
                  </div>
                  <p className="text-gray-500">Failed to load PDF</p>
                </div>
              }
            >
              <div
                className="h-full overflow-x-auto p-4 pt-8 relative"
                style={{ pointerEvents: "auto" }}
              >
                <div
                  className="flex gap-6 h-full pdf-scroll-container px-12"
                  style={{
                    scrollbarWidth: "thin",
                    scrollbarColor: "#9CA3AF #F3F4F6",
                  }}
                  onWheel={(e) => {
                    e.preventDefault();
                    const container = e.currentTarget;
                    const scrollAmount = e.deltaY;
                    container.scrollBy({
                      left: scrollAmount,
                      behavior: "smooth",
                    });
                  }}
                >
                  {Array.from(new Array(numPages || 1), (el, index) => (
                    <div
                      key={`page_${index + 1}`}
                      className="flex-shrink-0 flex items-center justify-center page-container"
                      style={{
                        width: "600px",
                        height: "800px",
                        minWidth: "600px",
                        minHeight: "800px",
                      }}
                    >
                      <div className="shadow-lg rounded-lg overflow-hidden w-full h-full flex items-center justify-center bg-white">
                        <Page
                          pageNumber={index + 1}
                          width={550}
                          height={750}
                          renderTextLayer={true}
                          renderAnnotationLayer={false}
                          className="max-w-full max-h-full object-contain"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Document>
          </div>
        ) : (
          // Regular Image Display
          <div className="h-full w-full flex items-center justify-center p-4">
            <img
              src={flyer.imageUrl}
              alt={flyer.title}
              className="max-w-full max-h-full object-contain rounded-lg shadow-sm"
            />
          </div>
        )}
      </div>

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
        itemName="this flyer"
      />
    </div>
  );
}
