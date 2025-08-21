import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import {
  HiPencil,
  HiTrash,
  HiShoppingCart,
  HiHeart,
  HiEye,
} from "react-icons/hi";
import baseUrl from "@/hooks/baseurl";
import { toast } from "react-toastify";
import useAuthenticate from "@/hooks/authenticationt";
import ConfirmDeleteDialog from "./confirmDeleteOption";
import { FiImage } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import FlyerPreviewModal from "./FlyerPreviewModal";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { useTranslation } from "react-i18next";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

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
  const [showPreviewModal, setShowPreviewModal] = useState<boolean>(false);
  const [pdfLoadError, setPdfLoadError] = useState<boolean>(false);
  const [pdfWidth, setPdfWidth] = useState<number>(128);
  const navigate = useNavigate();
  const { t } = useTranslation();

  // Check if the flyer URL is a PDF
  const isPdf = flyer?.imageUrl?.toLowerCase().includes(".pdf");

  const isAuthorized = userRole === "ADMIN" || userRole === "RETAILER";

  // Set PDF width based on screen size
  useEffect(() => {
    const updatePdfWidth = () => {
      if (typeof window !== "undefined") {
        if (window.innerWidth > 640) {
          setPdfWidth(128); // Desktop: use fixed width for sm:w-32
        } else {
          setPdfWidth(Math.min(window.innerWidth * 0.8, 300)); // Mobile: responsive width
        }
      }
    };

    updatePdfWidth();
    window.addEventListener("resize", updatePdfWidth);
    return () => window.removeEventListener("resize", updatePdfWidth);
  }, []);

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
    const startDate = new Date(flyer.startDate);
    const endDate = new Date(flyer.endDate);
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
        className={`w-full rounded-lg shadow-sm overflow-hidden cursor-pointer transition-all relative group ${
          calculateDaysLeft().status === "expired"
            ? "opacity-60 grayscale"
            : "hover:translate-y-1 hover:shadow-md"
        }`}
        onClick={() => navigate(`/flyers/${flyer.id}`)}
        onContextMenu={(e) => {
          e.preventDefault();
          setShowPreviewModal(true);
        }}
      >
        <CardContent className="p-4">
          {/* New Layout: Title -> Image -> Date Badge */}
          <div className="flex flex-col items-center space-y-3">
            {/* Title - At the top */}
            <h2 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-800 text-center line-clamp-2 w-full">
              {flyer.title}
            </h2>

            {/* Image/PDF Section - In the middle */}
            <div className="relative w-full h-32 sm:h-40 overflow-hidden rounded-lg">
              {flyer.imageUrl ? (
                isPdf ? (
                  // PDF Preview - First Page
                  <div className="w-full h-full bg-white flex items-center justify-center">
                    {!pdfLoadError ? (
                      <Document
                        file={flyer.imageUrl}
                        onLoadError={() => setPdfLoadError(true)}
                        loading={
                          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-yellow-600"></div>
                          </div>
                        }
                        error={
                          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                            <FiImage className="w-8 h-8 text-gray-400" />
                          </div>
                        }
                      >
                        <Page
                          pageNumber={1}
                          width={pdfWidth}
                          renderTextLayer={false}
                          renderAnnotationLayer={false}
                          className="pdf-page-card"
                        />
                      </Document>
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <FiImage className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                  </div>
                ) : (
                  // Regular Image
                  <img
                    src={flyer.imageUrl}
                    alt={flyer.title}
                    className="w-full h-full object-cover"
                  />
                )
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <FiImage className="w-8 h-8 text-gray-400" />
                </div>
              )}

              {/* Action buttons - overlay on image */}
              <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowPreviewModal(true);
                  }}
                  className="p-1.5 bg-white/90 hover:bg-white text-blue-600 hover:text-blue-700 rounded-full shadow-sm transition-colors"
                  title="Preview Flyer"
                >
                  <HiEye size={14} />
                </button>

                {/* Additional action buttons for authenticated USER role */}
                {user && userRole === "USER" && (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToShoppingList(e);
                      }}
                      className="p-1.5 bg-white/90 hover:bg-white text-green-600 hover:text-green-700 rounded-full shadow-sm transition-colors"
                      title="Add to Shopping List"
                    >
                      <HiShoppingCart size={14} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        addToWishlist();
                      }}
                      className={`p-1.5 bg-white/90 hover:bg-white rounded-full shadow-sm transition-colors ${
                        isInWishlist
                          ? "text-red-500"
                          : "text-gray-500 hover:text-red-500"
                      }`}
                      title={
                        isInWishlist
                          ? "Remove from Wishlist"
                          : "Add to Wishlist"
                      }
                    >
                      <HiHeart size={14} />
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Date Badge - At the bottom */}
            <span
              className={`text-xs sm:text-sm font-medium px-3 py-1.5 rounded-full border ${
                getDateBadge().className
              }`}
            >
              {getDateBadge().text}
            </span>
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

      {/* Flyer Preview Modal */}
      <FlyerPreviewModal
        isOpen={showPreviewModal}
        onClose={() => setShowPreviewModal(false)}
        flyer={flyer}
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
  const { t } = useTranslation();

  if (!Array.isArray(flyers)) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {flyers.map((flyer: any) => (
          <FlyerCard
            key={flyer.id}
            flyer={flyer}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>

      {/* Pagination - Same design as CouponCard */}
      {pagination && (
        <div className="flex justify-center items-center gap-2 mt-8">
          <button
            onClick={() => onPageChange(pagination.currentPage - 1)}
            disabled={!pagination.hasPreviousPage}
            className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>
          <span className="px-3 py-2 text-sm font-medium text-gray-700">
            Page {pagination.currentPage} of {pagination.totalPages}
          </span>
          <button
            onClick={() => onPageChange(pagination.currentPage + 1)}
            disabled={!pagination.hasNextPage}
            className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default FlyerList;

// CSS for PDF rendering in cards
const pdfCardStyles = `
  .pdf-page-card {
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
  }
  
  .pdf-page-card .react-pdf__Page {
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
  }
  
  .pdf-page-card .react-pdf__Page__canvas {
    max-width: 100% !important;
    max-height: 100% !important;
    object-fit: contain !important;
    border-radius: 0.5rem !important;
  }
`;

// Inject styles
if (typeof document !== "undefined") {
  const styleElement = document.createElement("style");
  styleElement.textContent = pdfCardStyles;
  document.head.appendChild(styleElement);
}
