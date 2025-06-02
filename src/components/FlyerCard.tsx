import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { HiX, HiPencil, HiTrash } from "react-icons/hi";
import baseUrl from "@/hooks/baseurl";
import { toast } from "react-toastify";
import useAuthenticate from "@/hooks/authenticationt";
import ConfirmDeleteDialog from "./confirmDeleteOption";

const DetailRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between items-center text-sm sm:text-sm">
    <span className="text-gray-600 font-medium">{label}</span>
    <span className="text-gray-800 text-right">{value}</span>
  </div>
);

const FlyerCard = ({
  flyer,
  showlogo,
  onEdit,
  onDelete,
}: {
  flyer: any;
  showlogo: boolean;
  onEdit?: (flyer: any) => void;
  onDelete?: (flyerId: string) => void;
}) => {
  const [showPreview, setShowPreview] = useState(false);
  const [store, setStore] = useState<any>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { user, userRole } = useAuthenticate();
  const [showDeleteDialogueBox, setShowDeleteDialogueBox] =
    useState<boolean>(false);

  const isAuthorized = userRole === "ADMIN" || userRole === "RETAILER";

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

  return (
    <>
      <Card
        className="w-full hover:translate-y-2 max-w-md rounded-2xl shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-all relative group"
        onClick={() => setShowPreview(true)}
      >
        {/* Action Buttons */}
        {isAuthorized && (
          <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={handleEdit}
              className="p-2 bg-yellow-500 text-white rounded-full hover:bg-yellow-600 transition-colors"
              title="Edit Flyer"
            >
              <HiPencil className="w-4 h-4" />
            </button>
            <button
              onClick={handleDeleteClick}
              disabled={isDeleting}
              className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors disabled:opacity-50"
              title="Delete Flyer"
            >
              <HiTrash className="w-4 h-4" />
            </button>
          </div>
        )}

        <CardContent className="p-2 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-800">
                {flyer.title}
              </h2>
              <p className="text-sm text-gray-600">{flyer.description}</p>
            </div>
            {showlogo && store?.logo && (
              <img
                src={store.logo}
                alt={store.name}
                width={20}
                height={20}
                className="w-12 h-12 border-2 border-yellow-800 object-contain rounded-full shadow"
              />
            )}
          </div>

          <div className="flex gap-2 text-sm">
            {flyer.categories.map((cat: any) => (
              <span
                key={cat.id}
                className="px-2 py-1 rounded bg-yellow-100 text-yellow-700"
              >
                {cat.name}
              </span>
            ))}
          </div>

          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg">
            <img
              src={flyer.imageUrl}
              alt={flyer.title}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="text-xs text-gray-500">
            Valid from {new Date(flyer.startDate).toLocaleDateString()} to{" "}
            {new Date(flyer.endDate).toLocaleDateString()}
          </div>

          <div className="flex gap-2 text-xs">
            {flyer.isPremium && (
              <span className="px-2 py-1 rounded-full bg-purple-100 text-purple-700">
                Premium
              </span>
            )}
            {flyer.isSponsored && (
              <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-700">
                Sponsored
              </span>
            )}
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
                        title="Edit Flyer"
                      >
                        <HiPencil className="w-5 h-5" />
                      </button>
                      <button
                        onClick={handleDeleteClick}
                        disabled={isDeleting}
                        className="p-2 text-red-600 hover:text-red-700 transition-colors disabled:opacity-50"
                        title="Delete Flyer"
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
                      Flyer Details
                    </h3>
                    <div className="bg-yellow-50/70 rounded-2xl p-5 sm:p-6 shadow-inner space-y-4">
                      <DetailRow
                        label="Valid From:"
                        value={new Date(flyer.startDate).toLocaleDateString()}
                      />
                      <DetailRow
                        label="Valid Until:"
                        value={new Date(flyer.endDate).toLocaleDateString()}
                      />
                      <DetailRow
                        label="Status:"
                        value={flyer.isPremium ? "Premium" : "Standard"}
                      />
                    </div>
                  </section>

                  <section>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      Categories
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {flyer.categories.map((cat: any) => (
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
                      {flyer.isPremium && (
                        <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-sm">
                          Premium
                        </span>
                      )}
                      {flyer.isSponsored && (
                        <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm">
                          Sponsored
                        </span>
                      )}
                    </div>
                  </section>

                  {/* 🗺️ Google Map Preview */}
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

                  {flyer.description && (
                    <section>
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        Description
                      </h3>
                      <p className="text-gray-600">{flyer.description}</p>
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

                  {/* Flyer Image */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      Flyer Image
                    </h3>
                    <img
                      src={flyer.imageUrl}
                      alt={flyer.title}
                      className="w-full rounded-lg shadow"
                    />
                  </div>
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
          itemName="this Flyer"
          isLoading={isDeleting}
        />
      )}
    </>
  );
};

const FlyerList = ({
  flyers,
  pagination,
  onPageChange,
  showLogo,
  onEdit,
  onDelete,
}: {
  flyers: any[];
  pagination: any;
  onPageChange: (page: number) => void;
  showLogo: boolean;
  onEdit?: (flyer: any) => void;
  onDelete?: (flyerId: string) => void;
}) => {
  if (!Array.isArray(flyers)) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {flyers.map((flyer: any) => (
          <FlyerCard
            showlogo={showLogo}
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
