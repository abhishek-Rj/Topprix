import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Navigation from "../../components/navigation";
import { HiNewspaper, HiTag, HiPlus, HiPencil, HiX } from "react-icons/hi";
import baseUrl from "../../hooks/baseurl";
import { toast } from "react-toastify";
import CategorySelector from "./CategorySelector";
import { getDownloadURL, ref, uploadBytes } from "@firebase/storage";
import { storage } from "../../context/firebaseProvider";

export default function StoreDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"flyers" | "coupons">("flyers");
  const [store, setStore] = useState<any>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [title, setTitle] = useState("");
  const [code, setCode] = useState("");
  const [discount, setDiscount] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [barcodeFile, setBarcodeFile] = useState<File | null>(null);
  const [qrCodeFile, setQrCodeFile] = useState<File | null>(null);
  const [barcodePreview, setBarcodePreview] = useState<string | null>(null);
  const [qrCodePreview, setQrCodePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchStoreDetails = async () => {
      try {
        const res = await fetch(`${baseUrl}store/${id}`);
        if (!res.ok) {
          toast.error("Store not found");
          navigate("/retailer-stores");
          return;
        }
        const data = await res.json();
        if (data.id) {
          setStore(data);
        }
      } catch (err) {
        console.error("Error fetching store details:", err);
      }
    };

    if (id) fetchStoreDetails();
  }, [id]);

  const handleCreate = () => {
    setShowDialog(true);
  };

  const handleEditStore = () => {
    navigate(`/retailer-stores/edit-store/${id}`);
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "barcode" | "qrcode"
  ) => {
    const file = e.target.files?.[0];
    if (file && ["image/jpeg", "image/png"].includes(file.type)) {
      if (type === "barcode") {
        setBarcodeFile(file);
        setBarcodePreview(URL.createObjectURL(file));
      } else {
        setQrCodeFile(file);
        setQrCodePreview(URL.createObjectURL(file));
      }
    } else {
      toast.error("Only JPG or PNG files are allowed.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!title || !code || !discount || selectedCategories.length === 0) {
      toast.error("Please fill in all required fields.");
      setIsSubmitting(false);
      return;
    }

    try {
      let barcodeUrl = "";
      let qrCodeUrl = "";

      // Upload barcode image
      if (barcodeFile) {
        const barcodeRef = ref(
          storage,
          `barcodes/${Date.now()}_${barcodeFile.name}`
        );
        await uploadBytes(barcodeRef, barcodeFile);
        barcodeUrl = await getDownloadURL(barcodeRef);
      }

      // Upload QR code image
      if (qrCodeFile) {
        const qrCodeRef = ref(
          storage,
          `qrcodes/${Date.now()}_${qrCodeFile.name}`
        );
        await uploadBytes(qrCodeRef, qrCodeFile);
        qrCodeUrl = await getDownloadURL(qrCodeRef);
      }

      const data = {
        title,
        storeId: id,
        code,
        barcodeUrl,
        qrCodeUrl,
        discount,
        categoryIds: selectedCategories,
      };

      const response = await fetch(
        `${baseUrl}${activeTab === "flyers" ? "flyer" : "coupon"}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (response.ok) {
        toast.success(
          `${activeTab === "flyers" ? "Flyer" : "Coupon"} created successfully`
        );
        setShowDialog(false);
        resetForm();
      } else {
        throw new Error("Failed to create");
      }
    } catch (error) {
      toast.error(
        `Error creating ${activeTab === "flyers" ? "flyer" : "coupon"}`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setTitle("");
    setCode("");
    setDiscount("");
    setSelectedCategories([]);
    setBarcodeFile(null);
    setQrCodeFile(null);
    setBarcodePreview(null);
    setQrCodePreview(null);
  };

  if (!store) return null;

  return (
    <div className="min-h-screen bg-yellow-50">
      <Navigation />
      <main className="pt-20 pb-10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6">
            {/* Store Header with Name, Description & Edit Button */}
            <div className="mb-6 bg-yellow-100 rounded-xl p-6 shadow-sm">
              <div className="flex justify-between items-center mb-3">
                <h1 className="text-3xl font-bold text-gray-900">
                  {store.name}
                </h1>
                <button
                  onClick={handleEditStore}
                  className="flex items-center gap-2 text-sm px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition"
                >
                  <HiPencil />
                  Edit Store
                </button>
              </div>
              <p className="text-gray-700">
                {store.description || "No description provided."}
              </p>
            </div>

            {/* Tabs and Create Button */}
            <div className="flex justify-between items-center mb-6">
              <div className="flex">
                <button
                  onClick={() => setActiveTab("flyers")}
                  className={`flex items-center gap-2 px-6 py-2 rounded-l-full border border-yellow-500 font-medium transition-all ${
                    activeTab === "flyers"
                      ? "bg-yellow-500 text-white"
                      : "bg-white text-yellow-600 hover:bg-yellow-100"
                  }`}
                >
                  <HiNewspaper />
                  Flyers
                </button>
                <button
                  onClick={() => setActiveTab("coupons")}
                  className={`flex items-center gap-2 px-6 py-2 rounded-r-full border border-yellow-500 font-medium transition-all ${
                    activeTab === "coupons"
                      ? "bg-yellow-500 text-white"
                      : "bg-white text-yellow-600 hover:bg-yellow-100"
                  }`}
                >
                  <HiTag />
                  Coupons
                </button>
              </div>

              <button
                onClick={handleCreate}
                className="flex items-center gap-2 bg-yellow-500 text-white font-semibold px-5 py-2 rounded-md hover:bg-yellow-600 transition"
              >
                <HiPlus />
                {activeTab === "flyers" ? "Create Flyer" : "Create Coupon"}
              </button>
            </div>

            {/* Tab Content Area */}
            <div className="min-h-[300px] bg-yellow-50 rounded-xl p-5 shadow-inner">
              {activeTab === "flyers" ? (
                <div className="text-center text-gray-700">
                  <h2 className="text-xl font-semibold flex items-center justify-center gap-2 mb-4">
                    <HiNewspaper className="text-yellow-600" />
                    Flyers
                  </h2>
                  <p>No flyers yet. Click "Create Flyer" to add one.</p>
                </div>
              ) : (
                <div className="text-center text-gray-700">
                  <h2 className="text-xl font-semibold flex items-center justify-center gap-2 mb-4">
                    <HiTag className="text-yellow-600" />
                    Coupons
                  </h2>
                  <p>No coupons yet. Click "Create Coupon" to add one.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Create Dialog */}
      {showDialog && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/40 z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4 p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Create {activeTab === "flyers" ? "Flyer" : "Coupon"}
              </h2>
              <button
                onClick={() => {
                  setShowDialog(false);
                  resetForm();
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <HiX size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Discount <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={discount}
                  onChange={(e) => setDiscount(e.target.value)}
                  placeholder="e.g., 20% off or $10 off"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Categories <span className="text-red-500">*</span>
                </label>
                <CategorySelector
                  selected={selectedCategories}
                  onChange={setSelectedCategories}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Barcode Image
                  </label>
                  <input
                    type="file"
                    accept="image/png, image/jpeg"
                    onChange={(e) => handleFileChange(e, "barcode")}
                    className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-yellow-600 file:text-white hover:file:bg-yellow-700"
                  />
                  {barcodePreview && (
                    <img
                      src={barcodePreview}
                      alt="Barcode Preview"
                      className="mt-2 h-16 rounded shadow object-contain"
                    />
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    QR Code Image
                  </label>
                  <input
                    type="file"
                    accept="image/png, image/jpeg"
                    onChange={(e) => handleFileChange(e, "qrcode")}
                    className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-yellow-600 file:text-white hover:file:bg-yellow-700"
                  />
                  {qrCodePreview && (
                    <img
                      src={qrCodePreview}
                      alt="QR Code Preview"
                      className="mt-2 h-16 rounded shadow object-contain"
                    />
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowDialog(false);
                    resetForm();
                  }}
                  className="px-4 py-2 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-md bg-yellow-500 text-white hover:bg-yellow-600 disabled:opacity-50"
                >
                  {isSubmitting ? "Creating..." : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
