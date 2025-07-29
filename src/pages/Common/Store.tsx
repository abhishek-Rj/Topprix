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
import FlyerList from "@/components/FlyerCard";
import { useTranslation } from "react-i18next";

export default function StoreDetailPage() {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"flyers" | "coupons">("flyers");
  const [store, setStore] = useState<any>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState<any>(null);
  const [selectedFlyer, setSelectedFlyer] = useState<any>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [code, setCode] = useState("");
  const [discount, setDiscount] = useState("");
  const [coupons, setCoupons] = useState<any>(null);
  const [flyers, setFlyers] = useState<any>(null);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [barcodeFile, setBarcodeFile] = useState<File | null>(null);
  const [qrCodeFile, setQrCodeFile] = useState<File | null>(null);
  const [barcodePreview, setBarcodePreview] = useState<string | null>(null);
  const [qrCodePreview, setQrCodePreview] = useState<string | null>(null);
  const [flyerImage, setFlyerImage] = useState<File | null>(null);
  const [flyerImagePreview, setFlyerImagePreview] = useState<string | null>(
    null
  );
  const [flyerPdf, setFlyerPdf] = useState<File | null>(null);
  const [flyerPdfPreview, setFlyerPdfPreview] = useState<string | null>(null);
  const [fileType, setFileType] = useState<"image" | "pdf">("image");
  const [isPremium, setIsPremium] = useState(false);
  const [isSponsored, setIsSponsored] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, loading, userRole } = useAuthenticate();
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
          const fetchCoupons = await fetch(
            `${baseUrl}coupons?storeId=${id}&limit=${12}`
          );
          if (fetchCoupons.ok) {
            const couponsData = await fetchCoupons.json();
            setCoupons(couponsData.coupons);
            setPagination(couponsData.pagination);
          } else {
            toast.error(t("store.couldFetchCoupons"));
          }
        } catch (err) {
          toast.error(t("store.somethingWentWrong") + err);
        }
      })();
    } else if (activeTab === "flyers") {
      (async () => {
        try {
          const fetchFlyers = await fetch(
            `${baseUrl}flyers?storeId=${id}&limit=${12}`
          );
          if (fetchFlyers.ok) {
            const flyersData = await fetchFlyers.json();
            setFlyers(flyersData.flyers);
            setPagination(flyersData.pagination);
          } else {
            toast.error(t("store.couldFetchFlyers"));
          }
        } catch (err) {
          toast.error(t("store.somethingWentWrong") + err);
        }
      })();
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
          toast.error(t("store.storeNotFound"));
          navigate("/stores");
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
    setIsEditing(false);
    setSelectedCoupon(null);
    setSelectedFlyer(null);
    resetForm();
    setShowDialog(true);
  };

  let categoriesForCoupon: Map<string, string[]> = new Map();

  coupons?.forEach((coupon: any) => {
    coupon.categories.forEach((category: any) => {
      categoriesForCoupon.set(coupon.id, [
        ...(categoriesForCoupon.get(coupon.id) || []),
        category.id,
      ]);
    });
  });

  let categoriesForFlyer: Map<string, string[]> = new Map();

  flyers?.forEach((flyer: any) => {
    flyer.categories.forEach((category: any) => {
      categoriesForFlyer.set(flyer.id, [
        ...(categoriesForFlyer.get(flyer.id) || []),
        category.id,
      ]);
    });
  });

  const handleEdit = (coupon: any) => {
    setIsEditing(true);
    setSelectedCoupon(coupon);
    setTitle(coupon.title);
    setDescription(coupon.description);
    setCode(coupon.code);
    setDiscount(coupon.discount);
    setSelectedCategories(categoriesForCoupon.get(coupon.id) || []);
    setBarcodePreview(coupon.barcodeUrl);
    setQrCodePreview(coupon.qrCodeUrl);
    setStartDate(coupon.startDate ? new Date(coupon.startDate) : undefined);
    setEndDate(coupon.endDate ? new Date(coupon.endDate) : undefined);
    setShowDialog(true);
  };

  const handleEditStore = () => {
    navigate(`/stores/edit-store/${id}`);
  };

  const handleEditFlyer = (flyer: any) => {
    setIsEditing(true);
    setSelectedFlyer(flyer);
    setTitle(flyer.title);
    setDescription(flyer.description);
    setSelectedCategories(categoriesForFlyer.get(flyer.id) || []);
    
    // Handle both image and PDF flyers
    if (flyer.pdfUrl) {
      setFileType("pdf");
      setFlyerPdfPreview(flyer.pdfUrl);
      setFlyerImagePreview(null);
    } else {
      setFileType("image");
      setFlyerImagePreview(flyer.imageUrl);
      setFlyerPdfPreview(null);
    }
    
    setIsPremium(flyer.isPremium);
    setIsSponsored(flyer.isSponsored);
    setStartDate(flyer.startDate ? new Date(flyer.startDate) : undefined);
    setEndDate(flyer.endDate ? new Date(flyer.endDate) : undefined);
    setShowDialog(true);
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "barcode" | "qrcode" | "flyer"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (type === "barcode" || type === "qrcode") {
      if (["image/jpeg", "image/png"].includes(file.type)) {
        if (type === "barcode") {
          setBarcodeFile(file);
          setBarcodePreview(URL.createObjectURL(file));
        } else if (type === "qrcode") {
          setQrCodeFile(file);
          setQrCodePreview(URL.createObjectURL(file));
        }
              } else {
          toast.error(t("store.onlyJpgPngAllowed"));
        }
    } else if (type === "flyer") {
      // Handle both image and PDF files for flyers
      if (["image/jpeg", "image/png"].includes(file.type)) {
        setFileType("image");
        setFlyerImage(file);
        setFlyerImagePreview(URL.createObjectURL(file));
        setFlyerPdf(null);
        setFlyerPdfPreview(null);
      } else if (file.type === "application/pdf") {
        setFileType("pdf");
        setFlyerPdf(file);
        setFlyerPdfPreview(URL.createObjectURL(file));
        setFlyerImage(null);
        setFlyerImagePreview(null);
              } else {
          toast.error(t("store.onlyJpgPngPdfAllowed"));
        }
    }
  };

  const onPagination = async (page: number) => {
    try {
      const fetchMoreCoupons = await fetch(
        `${baseUrl}coupons?storeId=${id}&page=${page}&limit=${12}`
      );
      if (!fetchMoreCoupons.ok) {
        toast.error(t("store.couldntFetchMoreCoupons"));
        throw new Error(t("store.cannotFetchMoreCoupons"));
      }
      const moreCoupons = await fetchMoreCoupons.json();
      setCoupons(moreCoupons.coupons);
      setPagination(moreCoupons.pagination);
    } catch (error) {
      toast.error(t("store.cannotLoadPage") + error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (activeTab === "flyers") {
      if (
        !title ||
        selectedCategories.length === 0 ||
        !startDate ||
        !endDate ||
        (!flyerImage && !flyerPdf)
      ) {
        toast.error(t("store.pleaseFillRequiredFieldsFlyer"));
        setIsSubmitting(false);
        return;
      }

      try {
        let imageUrl = "";
        let pdfUrl = "";

        if (fileType === "image" && flyerImage) {
          const imageRef = ref(
            storage,
            `flyers/${Date.now()}_${flyerImage.name}`
          );
          await uploadBytes(imageRef, flyerImage);
          imageUrl = await getDownloadURL(imageRef);
        } else if (fileType === "pdf" && flyerPdf) {
          const pdfRef = ref(
            storage,
            `flyers/${Date.now()}_${flyerPdf.name}`
          );
          await uploadBytes(pdfRef, flyerPdf);
          pdfUrl = await getDownloadURL(pdfRef);
        }

        const flyerData = {
          title,
          description,
          storeId: id,
          categoryIds: selectedCategories,
          imageUrl: fileType === "image" ? (imageUrl || (isEditing ? selectedFlyer?.imageUrl : null)) : (pdfUrl || (isEditing ? selectedFlyer?.pdfUrl : null)),
          startDate,
          endDate,
          isPremium,
          isSponsored,
        };

        console.log(flyerData);

        const url = isEditing
          ? `${baseUrl}flyers/${selectedFlyer.id}`
          : `${baseUrl}flyers`;

        const response = await fetch(url, {
          method: isEditing ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
            "user-email": user?.email || "",
          },
          body: JSON.stringify(flyerData),
        });

        if (!response.ok) {
          throw new Error(
            isEditing ? t("store.failedToUpdateFlyer") : t("store.failedToCreateFlyer")
          );
        }

        toast.success(
          isEditing
            ? t("store.flyerUpdatedSuccessfully")
            : t("store.flyerCreatedSuccessfully")
        );
        setTimeout(() => {
          window.location.reload();
        }, 1000);

        setShowDialog(false);
        resetForm();
      } catch (error) {
        console.error(
          isEditing ? "Error updating flyer:" : "Error creating flyer:",
          error
        );
        toast.error(
          isEditing ? t("store.errorUpdatingFlyer") : t("store.errorCreatingFlyer")
        );
      }
    } else {
      if (
        !title ||
        !code ||
        !discount ||
        selectedCategories.length === 0 ||
        !startDate ||
        !endDate
        || !barcodeFile
        || !qrCodeFile
      ) {
        toast.error(t("store.pleaseFillRequiredFields"));
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

        const couponData = {
          title,
          description,
          code,
          discount,
          storeId: id,
          categoryIds: selectedCategories,
          barcodeUrl:
            barcodeUrl || (isEditing ? selectedCoupon.barcodeUrl : null),
          qrCodeUrl: qrCodeUrl || (isEditing ? selectedCoupon.qrCodeUrl : null),
          startDate,
          endDate,
        };

        const url = isEditing
          ? `${baseUrl}coupons/${selectedCoupon.id}`
          : `${baseUrl}coupons`;

        const response = await fetch(url, {
          method: isEditing ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
            "user-email": user?.email || "",
          },
          body: JSON.stringify(couponData),
        });

        if (!response.ok) {
          throw new Error(
            isEditing ? t("store.failedToUpdateCoupon") : t("store.failedToCreateCoupon")
          );
        }
        if (isEditing) {
          toast.success(t("store.couponUpdatedSuccessfully"));
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        } else {
          toast.success(t("store.couponCreatedSuccessfully"));
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        }

        setShowDialog(false);
        resetForm();
      } catch (error) {
        console.error(
          isEditing ? "Error updating coupon:" : "Error creating coupon:",
          error
        );
        toast.error(
          isEditing ? t("store.errorUpdatingCoupon") : t("store.errorCreatingCoupon")
        );
      }
    }
    setIsSubmitting(false);
  };

  useEffect(() => {
    if (showDialog) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
  }, [showDialog]);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setCode("");
    setDiscount("");
    setSelectedCategories([]);
    setBarcodeFile(null);
    setQrCodeFile(null);
    setBarcodePreview(null);
    setQrCodePreview(null);
    setFlyerImage(null);
    setFlyerImagePreview(null);
    setFlyerPdf(null);
    setFlyerPdfPreview(null);
    setFileType("image");
    setIsPremium(false);
    setIsSponsored(false);
    setStartDate(undefined);
    setEndDate(undefined);
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
    <>
      <div className="fixed top-0 left-0 right-0 z-50">
        <Navigation />
      </div>
      <main className={`pt-20 pb-10 ${userRole === "ADMIN" ? "bg-blue-50" : "bg-yellow-50"}`}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-9xl mx-auto max-h-max overflow-y-auto p-4 sm:p-6">
            {/* Store Header with Name, Description & Edit Button */}
            <div className={`mb-6 ${userRole === "ADMIN" ? "bg-blue-100" : "bg-yellow-100"} rounded-xl p-4 sm:p-6 shadow-sm`}>
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-start sm:items-center">
                {/* Store Logo */}
                <div className="w-full sm:w-32 shrink-0">
                  {store.logo ? (
                    <img
                      src={store.logo}
                      alt={`${store.name} Logo`}
                      className={`w-full aspect-[4/3] object-cover rounded-md border ${userRole === "ADMIN" ? "border-blue-300" : "border-yellow-300"} shadow-sm`}
                    />
                  ) : (
                    <div className={`w-full aspect-[4/3] flex items-center justify-center text-2xl font-semibold ${userRole === "ADMIN" ? "text-blue-700 bg-blue-200 border-blue-300" : "text-yellow-700 bg-yellow-200 border-yellow-300"} rounded-md border shadow-sm`}>
                      {store.name?.charAt(0).toUpperCase() || "S"}
                    </div>
                  )}
                </div>

                {/* Store Info */}
                <div className="flex flex-col w-full">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                      {store.name}
                    </h1>
                    {(userRole === "ADMIN" || userRole === "RETAILER") && (
                                          <button
                      onClick={handleEditStore}
                      className={`w-full sm:w-auto flex items-center justify-center gap-2 text-sm px-4 py-2 ${userRole === "ADMIN" ? "bg-blue-500 hover:bg-blue-600" : "bg-yellow-500 hover:bg-yellow-600"} text-white rounded-md transition`}
                    >
                      <HiPencil />
                      {t("store.editStore")}
                    </button>
                    )}
                  </div>

                  {/* Store Description */}
                  <p className="text-sm sm:text-base text-gray-700 mt-1">
                    {store.description || t("store.noDescription")}
                  </p>
                </div>
              </div>
            </div>

            {/* Tabs and Create Button */}
            <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 sm:gap-0 mb-6">
              <div className="flex w-full sm:w-auto">
                <button
                  onClick={() => {
                    setActiveTab("flyers");
                    localStorage.setItem("lastVisited", "flyers");
                  }}
                  className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 sm:px-6 py-2 rounded-l-full border ${userRole === "ADMIN" ? "border-blue-500" : "border-yellow-500"} font-medium transition-all ${
                    activeTab === "flyers"
                      ? userRole === "ADMIN" ? "bg-blue-500 text-white" : "bg-yellow-500 text-white"
                      : userRole === "ADMIN" ? "bg-white text-blue-600 hover:bg-blue-100" : "bg-white text-yellow-600 hover:bg-yellow-100"
                  }`}
                >
                  <HiNewspaper />
                  <span className="hidden sm:inline">{t("store.flyers")}</span>
                </button>
                <button
                  onClick={() => {
                    setActiveTab("coupons");
                    localStorage.setItem("lastVisited", "coupons");
                  }}
                  className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 sm:px-6 py-2 rounded-r-full border ${userRole === "ADMIN" ? "border-blue-500" : "border-yellow-500"} font-medium transition-all ${
                    activeTab === "coupons"
                      ? userRole === "ADMIN" ? "bg-blue-500 text-white" : "bg-yellow-500 text-white"
                      : userRole === "ADMIN" ? "bg-white text-blue-600 hover:bg-blue-100" : "bg-white text-yellow-600 hover:bg-yellow-100"
                  }`}
                >
                  <HiTag />
                  <span className="hidden sm:inline">{t("store.coupons")}</span>
                </button>
              </div>

              {(userRole === "ADMIN" || userRole === "RETAILER") && (
                <button
                  onClick={handleCreate}
                  className={`w-full sm:w-auto flex items-center justify-center gap-2 ${userRole === "ADMIN" ? "bg-blue-500 hover:bg-blue-600" : "bg-yellow-500 hover:bg-yellow-600"} text-white font-semibold px-5 py-2 rounded-md transition`}
                >
                  <HiPlus />
                  {activeTab === "flyers" ? t("store.createFlyer") : t("store.createCoupon")}
                </button>
              )}
            </div>

            {/* Tab Content Area */}
            <div className={`min-h-[200px] sm:min-h-[300px] ${userRole === "ADMIN" ? "bg-blue-50" : "bg-yellow-50"} rounded-xl p-4 sm:p-5 shadow-inner`}>
              {activeTab === "flyers" ? (
                flyers ? (
                  <FlyerList
                    flyers={flyers}
                    pagination={pagination}
                    onPageChange={onPagination}
                    onEdit={handleEditFlyer}
                  />
                ) : (
                  <div className="text-center text-gray-700">
                    <h2 className="text-lg sm:text-xl font-semibold flex items-center justify-center gap-2 mb-4">
                      <HiNewspaper className={userRole === "ADMIN" ? "text-blue-600" : "text-yellow-600"} />
                      {t("store.flyers")}
                    </h2>
                    <p className="text-sm sm:text-base">
                      {t("store.noFlyersYet")}
                    </p>
                  </div>
                )
              ) : coupons ? (
                <CouponList
                  showLogo={false}
                  coupons={coupons}
                  pagination={pagination}
                  onPageChange={onPagination}
                  onEdit={handleEdit}
                />
              ) : (
                <div className="text-center text-gray-700">
                  <h2 className="text-lg sm:text-xl font-semibold flex items-center justify-center gap-2 mb-4">
                    <HiTag className={userRole === "ADMIN" ? "text-blue-600" : "text-yellow-600"} />
                    {t("store.coupons")}
                  </h2>
                  <p className="text-sm sm:text-base">
                    {t("store.noCouponsYet")}
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
          <div className="bg-white rounded-xl shadow-xl w-full max-w-5xl mx-auto max-h-[90vh] overflow-y-auto p-4 sm:p-6">
            <div className="flex justify-between items-center mb-4 sm:mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                {isEditing ? t("store.edit") : t("store.create")}{" "}
                {activeTab === "flyers" ? t("store.flyers") : t("store.coupons")}
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
              {activeTab === "flyers" ? (
                // Flyer Form
                <>
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
                      <CategorySelector
                        selected={selectedCategories}
                        onChange={setSelectedCategories}
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
                        Flyer File <span className="text-red-600">*</span>
                      </label>
                      
                      {/* File Type Toggle */}
                      <div className="flex gap-2 mb-3">
                        <button
                          type="button"
                          onClick={() => setFileType("image")}
                          className={`px-3 py-1 text-xs rounded-full transition-colors ${
                            fileType === "image"
                              ? "bg-yellow-500 text-white"
                              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                          }`}
                        >
                          Image
                        </button>
                        <button
                          type="button"
                          onClick={() => setFileType("pdf")}
                          className={`px-3 py-1 text-xs rounded-full transition-colors ${
                            fileType === "pdf"
                              ? "bg-yellow-500 text-white"
                              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                          }`}
                        >
                          PDF
                        </button>
                      </div>

                      {/* File Input */}
                      <input
                        type="file"
                        accept={fileType === "image" ? "image/png, image/jpeg" : "application/pdf"}
                        onChange={(e) => handleFileChange(e, "flyer")}
                        className="block w-full hover:scale-105 transition text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-yellow-600 file:text-white hover:file:bg-yellow-700"
                        required
                      />
                      
                      {/* Preview Section */}
                      {flyerImagePreview && (
                        <div className="relative inline-block mt-2 h-16">
                          <img
                            src={flyerImagePreview}
                            alt="Flyer Preview"
                            className="h-full rounded shadow object-contain"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setFlyerImagePreview(null);
                              setFlyerImage(null);
                            }}
                            className="absolute -top-2 -right-2 bg-white text-red-600 rounded-full p-1 hover:bg-red-100 shadow"
                          >
                            <MdCancel className="text-lg" />
                          </button>
                        </div>
                      )}
                      
                      {flyerPdfPreview && (
                        <div className="relative inline-block mt-2 h-16">
                          <div className="h-full w-12 bg-red-100 rounded shadow flex items-center justify-center">
                            <div className="text-center">
                              <div className="text-red-600 text-xs font-bold">PDF</div>
                              <div className="text-red-600 text-xs">
                                {flyerPdf?.name?.substring(0, 10)}...
                              </div>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setFlyerPdfPreview(null);
                              setFlyerPdf(null);
                            }}
                            className="absolute -top-2 -right-2 bg-white text-red-600 rounded-full p-1 hover:bg-red-100 shadow"
                          >
                            <MdCancel className="text-lg" />
                          </button>
                        </div>
                      )}
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
                        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[60] bg-white/80 backdrop-blur-md border border-yellow-400 rounded-xl shadow-2xl p-2">
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
                        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[60] bg-white/80 backdrop-blur-md border border-yellow-400 rounded-xl shadow-2xl p-2">
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
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="isPremium"
                        checked={isPremium}
                        onChange={(e) => setIsPremium(e.target.checked)}
                        className="w-4 h-4 text-yellow-600 border-gray-300 rounded focus:ring-yellow-500"
                      />
                      <label htmlFor="isPremium" className="text-sm font-medium text-gray-700">
                        Premium Flyer
                      </label>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="isSponsored"
                        checked={isSponsored}
                        onChange={(e) => setIsSponsored(e.target.checked)}
                        className="w-4 h-4 text-yellow-600 border-gray-300 rounded focus:ring-yellow-500"
                      />
                      <label htmlFor="isSponsored" className="text-sm font-medium text-gray-700">
                        Sponsored Flyer
                      </label>
                    </div>
                  </div>
                </>
              ) : (
                // Coupon Form
                <>
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
                        placeholder="e.g., SAVE20"
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
                        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[60] bg-white/80 backdrop-blur-md border border-yellow-400 rounded-xl shadow-2xl p-2">
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
                        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[60] bg-white/80 backdrop-blur-md border border-yellow-400 rounded-xl shadow-2xl p-2">
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
                        Barcode Image <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="file"
                        ref={barcodeRef}
                        accept="image/png, image/jpeg"
                        onChange={(e) => handleFileChange(e, "barcode")}
                        className="block w-full hover:scale-105 transition text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-yellow-600 file:text-white hover:file:bg-yellow-700"
                        required
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
                              if (barcodeRef.current)
                                barcodeRef.current.value = "";
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
                        QR Code Image <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="file"
                        ref={qrCodeRef}
                        accept="image/png, image/jpeg"
                        onChange={(e) => handleFileChange(e, "qrcode")}
                        className="block w-full hover:scale-105 transition text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-yellow-600 file:text-white hover:file:bg-yellow-700"
                        required
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
                              if (qrCodeRef.current)
                                qrCodeRef.current.value = "";
                            }}
                            className="absolute -top-2 -right-2 bg-white text-red-600 rounded-full p-1 hover:bg-red-100 shadow"
                          >
                            <MdCancel className="text-lg" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}

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
                  {isSubmitting
                    ? isEditing
                      ? "Updating..."
                      : "Creating..."
                    : isEditing
                    ? "Update"
                    : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <Footer />
    </>
  );
}
