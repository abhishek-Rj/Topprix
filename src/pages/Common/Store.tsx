import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import Navigation from "../../components/navigation";
import { HiNewspaper, HiTag, HiPlus, HiPencil, HiX } from "react-icons/hi";
import baseUrl from "../../hooks/baseurl";
import { toast } from "react-toastify";
import CategorySelector from "./CategorySelector";
import { getDownloadURL, ref, uploadBytes } from "@firebase/storage";
import { storage } from "../../context/firebaseProvider";
import { MdCancel } from "react-icons/md";
import useAuthenticate from "../../hooks/authenticationt";
import Loader from "../../components/loading";
import { Calendar } from "@/components/ui/calendar";
import useClickOutside from "@/hooks/useClickOutside";
import CouponList from "@/components/CouponCard";
import Footer from "@/components/Footer";

export default function StoreDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"flyers" | "coupons">("flyers");
  const [store, setStore] = useState<any>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [code, setCode] = useState("");
  const [discount, setDiscount] = useState("");
  const [coupons, setCoupons] = useState<any>(null);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [barcodeFile, setBarcodeFile] = useState<File | null>(null);
  const [qrCodeFile, setQrCodeFile] = useState<File | null>(null);
  const [barcodePreview, setBarcodePreview] = useState<string | null>(null);
  const [qrCodePreview, setQrCodePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, loading } = useAuthenticate();
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [pagination, setPagination] = useState<any>(null);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [showStartDateCalender, setShowStartDateCalender] =
    useState<boolean>(false);
  const [showEndDateCalender, setShowEndDateCalender] =
    useState<boolean>(false);

  const barcodeRef = useRef<HTMLInputElement>(null);
  const qrCodeRef = useRef<HTMLInputElement>(null);

  const startRef = useRef(null);
  const endRef = useRef(null);

  useClickOutside(startRef, () => setShowStartDateCalender(false));
  useClickOutside(endRef, () => setShowEndDateCalender(false));

  useEffect(() => {
    if (activeTab === "coupons") {
      (async () => {
        try {
          const fetchCoupons = await fetch(`${baseUrl}coupons?storeId=${id}`);
          if (fetchCoupons.ok) {
            const couponsData = await fetchCoupons.json();
            setCoupons(couponsData.coupons);
            setPagination(couponsData.pagination);
          } else {
            toast.error("could fetch coupons");
          }
        } catch (err) {
          toast.error("Something went wrong" + err);
        }
      })();
    } else {
    }
  }, [activeTab]);

  useEffect(() => {
    if (localStorage.getItem("lastVisited") === "flyers") {
      setActiveTab("flyers");
    } else {
      setActiveTab("coupons");
    }
  }, []);

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

  const onPagination = async (page: number) => {
    try {
      const fetchMoreCoupons = await fetch(`${baseUrl}coupons?page=${page}`);
      if (!fetchMoreCoupons.ok) {
        toast.error(`Couldn't fetch more coupons`);
        throw new Error("Cannot fetch more Coupons");
      }
      const moreCoupons = await fetchMoreCoupons.json();
      setCoupons(moreCoupons.coupons);
      setPagination(moreCoupons.pagination);
    } catch (error) {
      toast.error("Cannot load page" + error);
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

      if (barcodeFile) {
        const barcodeRef = ref(
          storage,
          `barcodes/${Date.now()}_${barcodeFile.name}`
        );
        await uploadBytes(barcodeRef, barcodeFile);
        barcodeUrl = await getDownloadURL(barcodeRef);
      }

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
        description,
        storeId: id,
        code,
        barcodeUrl,
        qrCodeUrl,
        startDate,
        endDate,
        discount,
        categoryIds: selectedCategories,
      };

      console.log(data);

      const response = await fetch(
        `${baseUrl}${activeTab === "flyers" ? "flyer" : "coupons"}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "user-email": user?.email,
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
        window.location.reload();
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

  if (loading) {
    <>
      <Navigation />
      <div className="flex items-center justify-center min-h-screen">
        <Loader />
      </div>
    </>;
  }

  return (
    <div className="min-h-screen bg-yellow-50">
      <Navigation />
      <main className="pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-2xl p-4 sm:p-6">
            {/* Store Header with Name, Description & Edit Button */}
            <div className="mb-6 bg-yellow-100 rounded-xl p-4 sm:p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0 mb-3">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  {store.name}
                </h1>
                <button
                  onClick={handleEditStore}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 text-sm px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition"
                >
                  <HiPencil />
                  Edit Store
                </button>
              </div>
              <p className="text-sm sm:text-base text-gray-700">
                {store.description || "No description provided."}
              </p>
            </div>

            {/* Tabs and Create Button */}
            <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 sm:gap-0 mb-6">
              <div className="flex w-full sm:w-auto">
                <button
                  onClick={() => {
                    setActiveTab("flyers");
                    localStorage.setItem("lastVisited", "flyers");
                  }}
                  className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 sm:px-6 py-2 rounded-l-full border border-yellow-500 font-medium transition-all ${
                    activeTab === "flyers"
                      ? "bg-yellow-500 text-white"
                      : "bg-white text-yellow-600 hover:bg-yellow-100"
                  }`}
                >
                  <HiNewspaper />
                  <span className="hidden sm:inline">Flyers</span>
                </button>
                <button
                  onClick={() => {
                    setActiveTab("coupons");
                    localStorage.setItem("lastVisited", "coupons");
                  }}
                  className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 sm:px-6 py-2 rounded-r-full border border-yellow-500 font-medium transition-all ${
                    activeTab === "coupons"
                      ? "bg-yellow-500 text-white"
                      : "bg-white text-yellow-600 hover:bg-yellow-100"
                  }`}
                >
                  <HiTag />
                  <span className="hidden sm:inline">Coupons</span>
                </button>
              </div>

              <button
                onClick={handleCreate}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-yellow-500 text-white font-semibold px-5 py-2 rounded-md hover:bg-yellow-600 transition"
              >
                <HiPlus />
                {activeTab === "flyers" ? "Create Flyer" : "Create Coupon"}
              </button>
            </div>

            {/* Tab Content Area */}
            <div className="min-h-[200px] sm:min-h-[300px] bg-yellow-50 rounded-xl p-4 sm:p-5 shadow-inner">
              {activeTab === "flyers" ? (
                <div className="text-center text-gray-700">
                  <h2 className="text-lg sm:text-xl font-semibold flex items-center justify-center gap-2 mb-4">
                    <HiNewspaper className="text-yellow-600" />
                    Flyers
                  </h2>
                  <p className="text-sm sm:text-base">
                    No flyers yet. Click "Create Flyer" to add one.
                  </p>
                </div>
              ) : coupons ? (
                <>
                  <CouponList
                    coupons={coupons}
                    pagination={pagination}
                    onPageChange={(page: number) => onPagination(page)}
                  />
                </>
              ) : (
                <div className="text-center text-gray-700">
                  <h2 className="text-lg sm:text-xl font-semibold flex items-center justify-center gap-2 mb-4">
                    <HiTag className="text-yellow-600" />
                    Coupons
                  </h2>
                  <p className="text-sm sm:text-base">
                    No coupons yet. Click "Create Coupon" to add one.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Create Dialog */}
      {showDialog && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-5xl mx-auto p-4 sm:p-6">
            <div className="flex justify-between items-center mb-4 sm:mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
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

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3 sm:px-4 py-2 border hover:scale-105 transition border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
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
                    className="w-full px-3 sm:px-4 py-2 border hover:scale-105 transition border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Description
                </label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 border hover:scale-105 transition border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Discount <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={discount}
                    onChange={(e) => setDiscount(e.target.value)}
                    placeholder="e.g., 20% off or $10 off"
                    className="w-full px-3 sm:px-4 py-2 border hover:scale-105 transition border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                    required
                  />
                </div>
                <div>
                  <CategorySelector
                    selected={selectedCategories}
                    onChange={setSelectedCategories}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {/* Start Date */}
                <div ref={startRef} className="relative">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Start Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={startDate ? startDate.toLocaleDateString() : ""}
                    onFocus={() => setShowStartDateCalender(true)}
                    readOnly
                    placeholder="Select Start Date"
                    className="w-full px-3 sm:px-4 py-2 border hover:scale-105 transition border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                    required
                  />
                  {showStartDateCalender && (
                    <div className="absolute bottom-full left-0 z-50 bg-white/80 backdrop-blur-md border border-yellow-400 mt-1 rounded-xl shadow-2xl p-2">
                      <Calendar
                        mode="single"
                        selected={startDate}
                        onSelect={(date) => {
                          setStartDate(date);
                          setShowStartDateCalender(false);
                        }}
                      />
                    </div>
                  )}
                </div>

                {/* End Date */}
                <div ref={endRef} className="relative">
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    End Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={endDate ? endDate.toLocaleDateString() : ""}
                    onFocus={() => setShowEndDateCalender(true)}
                    readOnly
                    placeholder="Select End Date"
                    className="w-full px-3 sm:px-4 py-2 border hover:scale-105 transition border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                    required
                  />
                  {showEndDateCalender && (
                    <div className="absolute bottom-full left-0 z-50 bg-white/80 backdrop-blur-md border border-yellow-400 mt-1 rounded-xl shadow-2xl p-2">
                      <Calendar
                        mode="single"
                        selected={endDate}
                        onSelect={(date) => {
                          setEndDate(date);
                          setShowEndDateCalender(false);
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {/* Barcode Upload */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Barcode Image
                  </label>
                  <input
                    type="file"
                    ref={barcodeRef}
                    accept="image/png, image/jpeg"
                    onChange={(e) => handleFileChange(e, "barcode")}
                    className="block w-full hover:scale-105 transition text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-yellow-600 file:text-white hover:file:bg-yellow-700"
                  />
                  {barcodePreview && (
                    <div className="relative inline-block mt-2 h-16">
                      <img
                        src={barcodePreview}
                        alt="Barcode Preview"
                        className="h-full rounded shadow object-contain"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setBarcodePreview(null);
                          setBarcodeFile(null);
                          if (barcodeRef.current) barcodeRef.current.value = "";
                        }}
                        className="absolute -top-2 -right-2 bg-white text-red-600 rounded-full p-1 hover:bg-red-100 shadow"
                      >
                        <MdCancel className="text-lg" />
                      </button>
                    </div>
                  )}
                </div>

                {/* QR Code Upload */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    QR Code Image
                  </label>
                  <input
                    type="file"
                    ref={qrCodeRef}
                    accept="image/png, image/jpeg"
                    onChange={(e) => handleFileChange(e, "qrcode")}
                    className="block w-full hover:scale-105 transition text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-yellow-600 file:text-white hover:file:bg-yellow-700"
                  />
                  {qrCodePreview && (
                    <div className="relative inline-block mt-2 h-16">
                      <img
                        src={qrCodePreview}
                        alt="QR Code Preview"
                        className="h-full rounded shadow object-contain"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setQrCodePreview(null);
                          setQrCodeFile(null);
                          if (qrCodeRef.current) qrCodeRef.current.value = "";
                        }}
                        className="absolute -top-2 -right-2 bg-white text-red-600 rounded-full p-1 hover:bg-red-100 shadow"
                      >
                        <MdCancel className="text-lg" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowDialog(false);
                    resetForm();
                  }}
                  className="px-6 py-2 rounded-md hover:scale-105 transition bg-gray-100 text-gray-700 hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 rounded-md hover:scale-105 transition bg-yellow-500 text-white hover:bg-yellow-600 disabled:opacity-50"
                >
                  {isSubmitting ? "Creating..." : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
}
