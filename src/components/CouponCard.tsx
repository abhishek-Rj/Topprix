import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { HiX, HiPencil, HiTrash } from "react-icons/hi";
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

  return (
    <>
      <Card
        className="w-full hover:translate-y-1 max-w-sm rounded-lg shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-all relative group"
        onClick={() => setShowPreview(true)}
      >
        <CardContent className="p-4 space-y-3">
        <div className="w-full max-w-sm rounded-lg shadow-sm overflow-hidden bg-white p-4">
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
                      <DetailRow label="Code:" value={coupon.code} isCode />
                      <DetailRow
                        label="Discount:"
                        value={coupon.discount}
                        isDiscount
                      />
                      <DetailRow
                        label="Valid From:"
                        value={new Date(coupon.startDate).toLocaleDateString()}
                      />
                      <DetailRow
                        label="Valid Until:"
                        value={new Date(coupon.endDate).toLocaleDateString()}
                      />
                    </div>
                  </section>

                  <section>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      Categories
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {coupon.categories.map((cat: any) => (
                        <span
                          key={cat.id}
                          className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-sm"
                        >
                          {cat.name}
                        </span>
                      ))}
                    </div>
                  </section>

                  <section>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      Status
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {coupon.isOnline ? (
                        <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm">
                          Online
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-full bg-red-100 text-red-700 text-sm">
                          Offline
                        </span>
                      )}
                      {coupon.isInStore ? (
                        <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm">
                          In-Store
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-full bg-red-100 text-red-700 text-sm">
                          Stock Out
                        </span>
                      )}
                      {coupon.isPremium && (
                        <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-sm">
                          Premium
                        </span>
                      )}
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

                  {/* 🗺️ Google Map Preview - Moved Here */}
                  {store.latitude && store.longitude && (
                    <section>
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        Store Location
                      </h3>
                      <div className="space-y-3">
                        <iframe
                          width="100%"
                          height="200"
                          className="rounded-lg shadow"
                          loading="lazy"
                          allowFullScreen
                          src={`https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=${store.latitude},${store.longitude}`}
                        />
                        <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-600">
                          <p>
                            <span className="font-medium">Address:</span>{" "}
                            {store.address || "Not available"}
                          </p>
                          <p>
                            <span className="font-medium">Coordinates:</span>{" "}
                            {store.latitude}, {store.longitude}
                          </p>
                        </div>
                      </div>
                    </section>
                  )}
                </div>

                {/* Right Column - Barcode, QR, Map */}
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
                      <DetailRow
                        label="Store Type:"
                        value={store.type || "Retail"}
                      />
                      <DetailRow
                        label="Contact:"
                        value={store.phone || "Not available"}
                      />
                      <DetailRow
                        label="Email:"
                        value={store.email || "Not available"}
                      />
                    </div>
                  </section>

                  {coupon.barcodeUrl && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        Barcode
                      </h3>
                      <img
                        src={coupon.barcodeUrl}
                        alt="Barcode"
                        className="w-full h-48 object-contain rounded-lg shadow"
                      />
                    </div>
                  )}

                  {coupon.qrCodeUrl && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        QR Code
                      </h3>
                      <img
                        src={coupon.qrCodeUrl}
                        alt="QR Code"
                        className="w-56 h-56 mx-auto object-contain rounded-lg shadow"
                      />
                    </div>
                  )}
                </div>
              </div>
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
          itemName="this Coupon"
          isLoading={isDeleting}
        />
      )}
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
