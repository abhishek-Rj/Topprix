import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import Navigation from "../../components/navigation";
import {
  HiNewspaper,
  HiTag,
  HiPlus,
  HiPencil,
  HiX,
  HiRefresh,
} from "react-icons/hi";
import baseUrl from "../../hooks/baseurl";
import { toast } from "react-toastify";
import PredefinedCategorySelector from "@/components/PredefinedCategorySelector";
import { getDownloadURL, ref, uploadBytes } from "@firebase/storage";
import { storage } from "../../context/firebaseProvider";
import { MdCancel } from "react-icons/md";
import useAuthenticate from "../../hooks/authenticationt";
import Loader from "../../components/loading";
import { Calendar } from "@/components/ui/calendar";
import useClickOutside from "@/hooks/useClickOutside";
import { CouponList } from "@/components/CouponCard";
import Footer from "@/components/Footer";
import FlyerList from "@/components/FlyerCard";
import { AntiWasteList } from "@/components/AntiWasteCard";
import { useTranslation } from "react-i18next";

export default function StoreDetailPage() {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<
    "flyers" | "coupons" | "antiwaste"
  >("flyers");
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
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>(
    []
  ); // Keep for backward compatibility, but not actively used
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

  // Anti-waste state variables
  const [antiWasteItems, setAntiWasteItems] = useState<any>(null);
  const [showAntiWasteDialog, setShowAntiWasteDialog] = useState(false);
  const [isEditingAntiWaste, setIsEditingAntiWaste] = useState(false);
  const [selectedAntiWasteItem, setSelectedAntiWasteItem] = useState<any>(null);
  const [antiWasteName, setAntiWasteName] = useState("");
  const [antiWasteDescription, setAntiWasteDescription] = useState("");
  const [originalPrice, setOriginalPrice] = useState("");
  const [discountedPrice, setDiscountedPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [expiryDate, setExpiryDate] = useState<Date | undefined>(undefined);
  const [antiWasteImage, setAntiWasteImage] = useState<File | null>(null);
  const [antiWasteImagePreview, setAntiWasteImagePreview] = useState<
    string | null
  >(null);
  const [antiWasteCategory, setAntiWasteCategory] = useState("");
  const [antiWasteCondition, setAntiWasteCondition] = useState("");
  const [showExpiryDateCalendar, setShowExpiryDateCalendar] = useState(false);

  const barcodeRef = useRef<HTMLInputElement>(null);
  const qrCodeRef = useRef<HTMLInputElement>(null);

  const startRef = useRef(null);
  const endRef = useRef(null);
  const expiryRef = useRef(null);

  useClickOutside(startRef, () => setShowStartDateCalender(false));
  useClickOutside(endRef, () => setShowEndDateCalender(false));
  useClickOutside(expiryRef, () => setShowExpiryDateCalendar(false));

  const antiWasteCategories = [
    "Bakery",
    "Dairy",
    "Fruits",
    "Vegetables",
    "Meat",
    "Fish",
    "Pantry",
    "Beverages",
    "Snacks",
    "Frozen",
    "Other",
  ];

  const antiWasteConditions = [
    { value: "NEAR_EXPIRY", label: "Near Expiry" },
    { value: "SURPLUS_STOCK", label: "Surplus Stock" },
    { value: "SEASONAL", label: "Seasonal" },
    { value: "SLIGHTLY_DAMAGED", label: "Slightly Damaged" },
    { value: "SHORT_DATED", label: "Short Dated" },
  ];

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
    } else if (activeTab === "antiwaste") {
      (async () => {
        try {
          const fetchAntiWaste = await fetch(
            `${baseUrl}api/anti-waste-items?storeId=${id}&limit=${20}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                "user-email": user?.email || "",
              },
            }
          );
          if (fetchAntiWaste.ok) {
            const antiWasteData = await fetchAntiWaste.json();
            console.log("Anti-waste data:", antiWasteData); // Debug log
            setAntiWasteItems(antiWasteData.data);
            setPagination(antiWasteData.pagination);
          } else {
            toast.error(t("store.couldFetchAntiWaste"));
          }
        } catch (err) {
          toast.error(t("store.somethingWentWrong") + err);
        }
      })();
    }
  }, [activeTab]);

  useEffect(() => {
    const lastVisited = localStorage.getItem("lastVisited");
    if (lastVisited === "flyers") {
      setActiveTab("flyers");
    } else if (lastVisited === "antiwaste") {
      setActiveTab("antiwaste");
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
    setActiveTab("coupons"); // Set active tab to coupons when editing
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
    setActiveTab("flyers"); // Set active tab to flyers when editing
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

  const handleEditAntiWaste = (item: any) => {
    setIsEditingAntiWaste(true);
    setActiveTab("antiwaste"); // Set active tab to antiwaste when editing
    setSelectedAntiWasteItem(item);
    setAntiWasteName(item.name);
    setAntiWasteDescription(item.description);
    setOriginalPrice(item.originalPrice.toString());
    setDiscountedPrice(item.discountedPrice.toString());
    setQuantity(item.quantity.toString());
    setExpiryDate(item.expiryDate ? new Date(item.expiryDate) : undefined);
    setAntiWasteImagePreview(item.imageUrl);
    setAntiWasteCategory(item.category);
    setAntiWasteCondition(item.condition);
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
      if (activeTab === "coupons") {
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
      } else if (activeTab === "flyers") {
        const fetchMoreFlyers = await fetch(
          `${baseUrl}flyers?storeId=${id}&page=${page}&limit=${12}`
        );
        if (!fetchMoreFlyers.ok) {
          toast.error(t("store.couldntFetchMoreFlyers"));
          throw new Error(t("store.cannotFetchMoreFlyers"));
        }
        const moreFlyers = await fetchMoreFlyers.json();
        setFlyers(moreFlyers.flyers);
        setPagination(moreFlyers.pagination);
      } else if (activeTab === "antiwaste") {
        const fetchMoreAntiWaste = await fetch(
          `${baseUrl}api/anti-waste-items?storeId=${id}&page=${page}&limit=${20}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "user-email": localStorage.getItem("userEmail") || "",
            },
          }
        );
        if (!fetchMoreAntiWaste.ok) {
          toast.error(t("store.couldntFetchMoreAntiWaste"));
          throw new Error(t("store.cannotFetchMoreAntiWaste"));
        }
        const moreAntiWaste = await fetchMoreAntiWaste.json();
        console.log("Anti-waste pagination data:", moreAntiWaste); // Debug log
        setAntiWasteItems(moreAntiWaste.data);
        setPagination(moreAntiWaste.pagination);
      }
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
          const pdfRef = ref(storage, `flyers/${Date.now()}_${flyerPdf.name}`);
          await uploadBytes(pdfRef, flyerPdf);
          pdfUrl = await getDownloadURL(pdfRef);
        }

        const flyerData = {
          title,
          description,
          storeId: id,
          categoryIds: selectedCategories,
          imageUrl:
            fileType === "image"
              ? imageUrl || (isEditing ? selectedFlyer?.imageUrl : null)
              : pdfUrl || (isEditing ? selectedFlyer?.pdfUrl : null),
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
            isEditing
              ? t("store.failedToUpdateFlyer")
              : t("store.failedToCreateFlyer")
          );
        }

        toast.success(
          isEditing
            ? t("flyerUpdatedSuccessfully")
            : t("flyerCreatedSuccessfully")
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
          isEditing
            ? t("store.errorUpdatingFlyer")
            : t("store.errorCreatingFlyer")
        );
      }
    } else if (activeTab === "antiwaste") {
      if (
        !antiWasteName ||
        !antiWasteDescription ||
        !originalPrice ||
        !discountedPrice ||
        !quantity ||
        !expiryDate ||
        !antiWasteCategory ||
        !antiWasteCondition
      ) {
        toast.error(t("store.pleaseFillRequiredFieldsAntiWaste"));
        setIsSubmitting(false);
        return;
      }

      try {
        let imageUrl = "";

        if (antiWasteImage) {
          const imageRef = ref(
            storage,
            `antiwaste/${Date.now()}_${antiWasteImage.name}`
          );
          await uploadBytes(imageRef, antiWasteImage);
          imageUrl = await getDownloadURL(imageRef);
        }

        const antiWasteData = {
          storeId: id,
          name: antiWasteName,
          description: antiWasteDescription,
          originalPrice: parseFloat(originalPrice),
          discountedPrice: parseFloat(discountedPrice),
          quantity: parseInt(quantity),
          expiryDate: expiryDate?.toISOString(),
          imageUrl:
            imageUrl ||
            (isEditingAntiWaste ? selectedAntiWasteItem?.imageUrl : ""),
          category: antiWasteCategory,
          condition: antiWasteCondition,
          isAvailable: true,
        };

        const url = isEditingAntiWaste
          ? `${baseUrl}api/anti-waste-items/${selectedAntiWasteItem.id}`
          : `${baseUrl}api/anti-waste-items`;

        const response = await fetch(url, {
          method: isEditingAntiWaste ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
            "user-email": user?.email || "",
          },
          body: JSON.stringify(antiWasteData),
        });

        if (!response.ok) {
          throw new Error(
            isEditingAntiWaste
              ? t("store.failedToUpdateAntiWaste")
              : t("store.failedToCreateAntiWaste")
          );
        }

        toast.success(
          isEditingAntiWaste
            ? t("antiWaste.itemUpdatedSuccessfully")
            : t("antiWaste.itemCreatedSuccessfully")
        );
        setTimeout(() => {
          window.location.reload();
        }, 1000);

        setShowDialog(false);
        resetForm();
      } catch (error) {
        console.error(
          isEditingAntiWaste
            ? "Error updating anti-waste item:"
            : "Error creating anti-waste item:",
          error
        );
        toast.error(
          isEditingAntiWaste
            ? t("store.errorUpdatingAntiWaste")
            : t("store.errorCreatingAntiWaste")
        );
      }
    } else {
      if (
        !title ||
        !code ||
        !discount ||
        selectedCategories.length === 0 ||
        !startDate ||
        !endDate ||
        !barcodeFile ||
        !qrCodeFile
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
            isEditing
              ? t("store.failedToUpdateCoupon")
              : t("store.failedToCreateCoupon")
          );
        }
        if (isEditing) {
          toast.success(t("couponUpdatedSuccessfully"));
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        } else {
          toast.success(t("couponCreatedSuccessfully"));
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
          isEditing
            ? t("store.errorUpdatingCoupon")
            : t("store.errorCreatingCoupon")
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

    // Reset anti-waste form
    setAntiWasteName("");
    setAntiWasteDescription("");
    setOriginalPrice("");
    setDiscountedPrice("");
    setQuantity("");
    setExpiryDate(undefined);
    setAntiWasteImage(null);
    setAntiWasteImagePreview(null);
    setAntiWasteCategory("");
    setAntiWasteCondition("");
    setIsEditingAntiWaste(false);
    setSelectedAntiWasteItem(null);
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
      <main
        className={`pt-20 pb-10 ${
          userRole === "ADMIN" ? "bg-blue-50" : "bg-yellow-50"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-9xl mx-auto max-h-max overflow-y-auto p-4 sm:p-6">
            {/* Store Header with Name, Description & Edit Button */}
            <div
              className={`mb-6 ${
                userRole === "ADMIN" ? "bg-blue-100" : "bg-yellow-100"
              } rounded-xl p-4 sm:p-6 shadow-sm`}
            >
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-start sm:items-center">
                {/* Store Logo */}
                <div className="w-full sm:w-32 shrink-0">
                  {store.logo ? (
                    <img
                      src={store.logo}
                      alt={`${store.name} Logo`}
                      className={`w-full aspect-[4/3] object-cover rounded-md border ${
                        userRole === "ADMIN"
                          ? "border-blue-300"
                          : "border-yellow-300"
                      } shadow-sm`}
                    />
                  ) : (
                    <div
                      className={`w-full aspect-[4/3] flex items-center justify-center text-2xl font-semibold ${
                        userRole === "ADMIN"
                          ? "text-blue-700 bg-blue-200 border-blue-300"
                          : "text-yellow-700 bg-yellow-200 border-yellow-300"
                      } rounded-md border shadow-sm`}
                    >
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
                        className={`w-full sm:w-auto flex items-center justify-center gap-2 text-sm px-4 py-2 ${
                          userRole === "ADMIN"
                            ? "bg-blue-500 hover:bg-blue-600"
                            : "bg-yellow-500 hover:bg-yellow-600"
                        } text-white rounded-md transition`}
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
                  className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 sm:px-6 py-2 rounded-l-full border ${
                    userRole === "ADMIN"
                      ? "border-blue-500"
                      : "border-yellow-500"
                  } font-medium transition-all ${
                    activeTab === "flyers"
                      ? userRole === "ADMIN"
                        ? "bg-blue-500 text-white"
                        : "bg-yellow-500 text-white"
                      : userRole === "ADMIN"
                      ? "bg-white text-blue-600 hover:bg-blue-100"
                      : "bg-white text-yellow-600 hover:bg-yellow-100"
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
                  className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 sm:px-6 py-2 border-t border-b ${
                    userRole === "ADMIN"
                      ? "border-blue-500"
                      : "border-yellow-500"
                  } font-medium transition-all ${
                    activeTab === "coupons"
                      ? userRole === "ADMIN"
                        ? "bg-blue-500 text-white"
                        : "bg-yellow-500 text-white"
                      : userRole === "ADMIN"
                      ? "bg-white text-blue-600 hover:bg-blue-100"
                      : "bg-white text-yellow-600 hover:bg-yellow-100"
                  }`}
                >
                  <HiTag />
                  <span className="hidden sm:inline">{t("store.coupons")}</span>
                </button>
                <button
                  onClick={() => {
                    setActiveTab("antiwaste");
                    localStorage.setItem("lastVisited", "antiwaste");
                  }}
                  className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 sm:px-6 py-2 rounded-r-full border ${
                    userRole === "ADMIN"
                      ? "border-blue-500"
                      : "border-yellow-500"
                  } font-medium transition-all ${
                    activeTab === "antiwaste"
                      ? userRole === "ADMIN"
                        ? "bg-blue-500 text-white"
                        : "bg-yellow-500 text-white"
                      : userRole === "ADMIN"
                      ? "bg-white text-blue-600 hover:bg-blue-100"
                      : "bg-white text-yellow-600 hover:bg-yellow-100"
                  }`}
                >
                  <HiRefresh />
                  <span className="hidden sm:inline">
                    {t("store.antiWaste")}
                  </span>
                </button>
              </div>

              {(userRole === "ADMIN" || userRole === "RETAILER") && (
                <button
                  onClick={handleCreate}
                  className={`w-full sm:w-auto flex items-center justify-center gap-2 ${
                    userRole === "ADMIN"
                      ? "bg-blue-500 hover:bg-blue-600"
                      : "bg-yellow-500 hover:bg-yellow-600"
                  } text-white font-semibold px-5 py-2 rounded-md transition`}
                >
                  <HiPlus />
                  {activeTab === "flyers"
                    ? t("store.createFlyer")
                    : activeTab === "coupons"
                    ? t("store.createCoupon")
                    : t("store.createAntiWaste")}
                </button>
              )}
            </div>

            {/* Tab Content Area */}
            <div
              className={`min-h-[200px] sm:min-h-[300px] ${
                userRole === "ADMIN" ? "bg-blue-50" : "bg-yellow-50"
              } rounded-xl p-4 sm:p-5 shadow-inner`}
            >
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
                      <HiNewspaper
                        className={
                          userRole === "ADMIN"
                            ? "text-blue-600"
                            : "text-yellow-600"
                        }
                      />
                      {t("store.flyers")}
                    </h2>
                    <p className="text-sm sm:text-base">
                      {t("store.noFlyersYet")}
                    </p>
                  </div>
                )
              ) : activeTab === "coupons" ? (
                coupons ? (
                  <CouponList
                    coupons={coupons}
                    pagination={pagination}
                    onPageChange={onPagination}
                    onEdit={handleEdit}
                  />
                ) : (
                  <div className="text-center text-gray-700">
                    <h2 className="text-lg sm:text-xl font-semibold flex items-center justify-center gap-2 mb-4">
                      <HiTag
                        className={
                          userRole === "ADMIN"
                            ? "text-blue-600"
                            : "text-yellow-600"
                        }
                      />
                      {t("store.coupons")}
                    </h2>
                    <p className="text-sm sm:text-base">
                      {t("store.noCouponsYet")}
                    </p>
                  </div>
                )
              ) : // Anti-waste tab content
              antiWasteItems ? (
                <AntiWasteList
                  items={antiWasteItems}
                  pagination={pagination}
                  onPageChange={onPagination}
                  onEdit={handleEditAntiWaste}
                  onDelete={(itemId) => {
                    // Remove the item from the list
                    setAntiWasteItems(
                      antiWasteItems.filter((item: any) => item.id !== itemId)
                    );
                  }}
                />
              ) : (
                <div className="text-center text-gray-700">
                  <h2 className="text-lg sm:text-xl font-semibold flex items-center justify-center gap-2 mb-4">
                    <HiRefresh
                      className={
                        userRole === "ADMIN"
                          ? "text-blue-600"
                          : "text-yellow-600"
                      }
                    />
                    {t("store.antiWaste")}
                  </h2>
                  <p className="text-sm sm:text-base">
                    {t("store.noAntiWasteYet")}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Create Dialog */}
      {showDialog && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/40 z-50 flex items-center justify-center p-2 sm:p-4">
          <div className="bg-white rounded-lg sm:rounded-xl shadow-xl w-full max-w-sm sm:max-w-2xl md:max-w-4xl lg:max-w-6xl xl:max-w-7xl mx-auto max-h-[98vh] sm:max-h-[95vh] overflow-y-auto p-3 sm:p-6 lg:p-8">
            <div className="flex justify-between items-center mb-4 sm:mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                {isEditing
                  ? activeTab === "flyers"
                    ? t("editFlyer")
                    : activeTab === "antiwaste"
                    ? t("antiWaste.editItem")
                    : t("editCouponDialogTitle")
                  : activeTab === "flyers"
                  ? t("createFlyer")
                  : activeTab === "antiwaste"
                  ? t("antiWaste.createItem")
                  : t("createCouponDialogTitle")}
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
                // Flyer Form - Redesigned for better space utilization
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
                  {/* Left Column */}
                  <div className="space-y-4 sm:space-y-6">
                    {/* Title and Description */}
                    <div className="space-y-3 sm:space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          {t("store.title")}{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          className="w-full px-3 py-2 sm:px-4 sm:py-3 border hover:scale-105 transition border-gray-300 rounded-md sm:rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-sm sm:text-base"
                          placeholder={t("store.enterFlyerTitle")}
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          {t("store.description")}
                        </label>
                        <textarea
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          rows={3}
                          className="w-full px-3 py-2 sm:px-4 sm:py-3 border hover:scale-105 transition border-gray-300 rounded-md sm:rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-sm sm:text-base"
                          placeholder={t("store.describeYourFlyer")}
                        />
                      </div>
                    </div>

                    {/* File Upload Section */}
                    <div className="space-y-3 sm:space-y-4">
                      <label className="block text-sm font-semibold text-gray-700 mb-1 sm:mb-2">
                        {t("store.flyerFile")}{" "}
                        <span className="text-red-600">*</span>
                      </label>

                      {/* File Type Toggle */}
                      <div className="flex gap-2 sm:gap-3 mb-3 sm:mb-4">
                        <button
                          type="button"
                          onClick={() => setFileType("image")}
                          className={`flex-1 px-3 py-2 sm:px-4 sm:py-2 text-xs sm:text-sm rounded-md sm:rounded-lg transition-all ${
                            fileType === "image"
                              ? "bg-yellow-500 text-white shadow-md"
                              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                          }`}
                        >
                          📷 Image
                        </button>
                        <button
                          type="button"
                          onClick={() => setFileType("pdf")}
                          className={`flex-1 px-3 py-2 sm:px-4 sm:py-2 text-xs sm:text-sm rounded-md sm:rounded-lg transition-all ${
                            fileType === "pdf"
                              ? "bg-yellow-500 text-white shadow-md"
                              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                          }`}
                        >
                          📄 PDF
                        </button>
                      </div>

                      {/* File Input */}
                      <div className="border-2 border-dashed border-yellow-300 rounded-md sm:rounded-lg p-4 sm:p-6 text-center hover:border-yellow-400 transition-colors">
                        <input
                          type="file"
                          accept={
                            fileType === "image"
                              ? "image/png, image/jpeg"
                              : "application/pdf"
                          }
                          onChange={(e) => handleFileChange(e, "flyer")}
                          className="hidden"
                          id="flyer-upload"
                          required
                        />
                        <label
                          htmlFor="flyer-upload"
                          className="cursor-pointer block"
                        >
                          <div className="text-2xl sm:text-4xl mb-1 sm:mb-2">
                            📁
                          </div>
                          <div className="text-xs sm:text-sm text-gray-600">
                            {t("store.clickToUpload")}{" "}
                            {fileType === "image"
                              ? t("store.image")
                              : t("store.pdf")}
                          </div>
                          <div className="text-xs text-gray-400 mt-1">
                            {fileType === "image" ? "PNG, JPG" : t("store.pdf")}{" "}
                            {t("store.files")}
                            {t("store.only")}
                          </div>
                        </label>
                      </div>

                      {/* Preview Section */}
                      {flyerImagePreview && (
                        <div className="relative inline-block">
                          <img
                            src={flyerImagePreview}
                            alt="Flyer Preview"
                            className="h-24 sm:h-32 rounded-md sm:rounded-lg shadow-md object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setFlyerImagePreview(null);
                              setFlyerImage(null);
                            }}
                            className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 shadow-md"
                          >
                            <MdCancel className="text-xs sm:text-sm" />
                          </button>
                        </div>
                      )}

                      {flyerPdfPreview && (
                        <div className="relative inline-block">
                          <div className="h-24 w-20 sm:h-32 sm:w-24 bg-red-100 rounded-md sm:rounded-lg shadow-md flex flex-col items-center justify-center">
                            <div className="text-red-600 text-sm sm:text-lg font-bold">
                              PDF
                            </div>
                            <div className="text-red-600 text-xs text-center px-1 sm:px-2">
                              {flyerPdf?.name?.substring(0, 10)}...
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setFlyerPdfPreview(null);
                              setFlyerPdf(null);
                            }}
                            className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 shadow-md"
                          >
                            <MdCancel className="text-xs sm:text-sm" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-4 sm:space-y-6">
                    {/* Categories */}
                    <div>
                      <PredefinedCategorySelector
                        selectedCategories={selectedCategories}
                        selectedSubcategories={selectedSubcategories}
                        onCategoryChange={setSelectedCategories}
                        onSubcategoryChange={setSelectedSubcategories}
                        allowMultiple={true}
                      />
                    </div>

                    {/* Date Selection */}
                    <div className="space-y-3 sm:space-y-4">
                      <h4 className="text-sm font-semibold text-gray-700">
                        {t("store.schedule")}
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        {/* Start Date */}
                        <div ref={startRef} className="relative">
                          <label className="block text-sm font-semibold text-gray-700 mb-1 sm:mb-2">
                            {t("store.startDate")}{" "}
                            <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={
                              startDate ? startDate.toLocaleDateString() : ""
                            }
                            onFocus={() => setShowStartDateCalender(true)}
                            readOnly
                            placeholder={t("store.selectStartDate")}
                            className="w-full px-3 py-2 sm:px-4 sm:py-3 border hover:scale-105 transition border-gray-300 rounded-md sm:rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 cursor-pointer text-sm sm:text-base"
                            required
                          />
                          {showStartDateCalender && (
                            <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[60] bg-white/90 backdrop-blur-md border border-yellow-400 rounded-xl shadow-2xl p-2 sm:p-4">
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
                          <label className="block text-sm font-semibold text-gray-700 mb-1 sm:mb-2">
                            {t("store.endDate")}{" "}
                            <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={endDate ? endDate.toLocaleDateString() : ""}
                            onFocus={() => setShowEndDateCalender(true)}
                            readOnly
                            placeholder={t("store.selectEndDate")}
                            className="w-full px-3 py-2 sm:px-4 sm:py-3 border hover:scale-105 transition border-gray-300 rounded-md sm:rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 cursor-pointer text-sm sm:text-base"
                            required
                          />
                          {showEndDateCalender && (
                            <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[60] bg-white/90 backdrop-blur-md border border-yellow-400 rounded-xl shadow-2xl p-2 sm:p-4">
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
                    </div>

                    {/* Flyer Options */}
                    <div className="space-y-3 sm:space-y-4">
                      <h4 className="text-sm font-semibold text-gray-700">
                        {t("store.options")}
                      </h4>
                      <div className="space-y-2 sm:space-y-3">
                        <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-gray-50 rounded-md sm:rounded-lg">
                          <input
                            type="checkbox"
                            id="isPremium"
                            checked={isPremium}
                            onChange={(e) => setIsPremium(e.target.checked)}
                            className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600 border-gray-300 rounded focus:ring-yellow-500"
                          />
                          <label
                            htmlFor="isPremium"
                            className="text-xs sm:text-sm font-medium text-gray-700 cursor-pointer"
                          >
                            ⭐ {t("store.premiumFlyer")}
                          </label>
                        </div>
                        <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-gray-50 rounded-md sm:rounded-lg">
                          <input
                            type="checkbox"
                            id="isSponsored"
                            checked={isSponsored}
                            onChange={(e) => setIsSponsored(e.target.checked)}
                            className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600 border-gray-300 rounded focus:ring-yellow-500"
                          />
                          <label
                            htmlFor="isSponsored"
                            className="text-xs sm:text-sm font-medium text-gray-700 cursor-pointer"
                          >
                            📢 {t("store.sponsoredFlyer")}
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* General Conditions Notice */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <div className="text-blue-600 mt-1">
                          <svg
                            className="w-5 h-5"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-blue-900 mb-2">
                            {t("generalConditionsOfSale")}
                          </h3>
                          <p className="text-xs text-blue-800 mb-3">
                            {t("generalConditionsAcceptance")}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : activeTab === "coupons" ? (
                // Coupon Form - Redesigned for better space utilization
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
                  {/* Left Column */}
                  <div className="space-y-4 sm:space-y-6">
                    {/* Basic Information */}
                    <div className="space-y-3 sm:space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1 sm:mb-2">
                          {t("store.title")}{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          className="w-full px-3 py-2 sm:px-4 sm:py-3 border hover:scale-105 transition border-gray-300 rounded-md sm:rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-sm sm:text-base"
                          placeholder={t("store.enterCouponTitle")}
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1 sm:mb-2">
                          {t("store.code")}{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={code}
                          onChange={(e) => setCode(e.target.value)}
                          placeholder={t("store.enterCouponCode")}
                          className="w-full px-3 py-2 sm:px-4 sm:py-3 border hover:scale-105 transition border-gray-300 rounded-md sm:rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-sm sm:text-base"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1 sm:mb-2">
                          {t("store.discount")}{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={discount}
                          onChange={(e) => setDiscount(e.target.value)}
                          placeholder={t("store.enterDiscount")}
                          className="w-full px-3 py-2 sm:px-4 sm:py-3 border hover:scale-105 transition border-gray-300 rounded-md sm:rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-sm sm:text-base"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1 sm:mb-2">
                          {t("store.description")}
                        </label>
                        <textarea
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          rows={3}
                          className="w-full px-3 py-2 sm:px-4 sm:py-3 border hover:scale-105 transition border-gray-300 rounded-md sm:rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-sm sm:text-base"
                          placeholder={t("store.describeCouponTerms")}
                        />
                      </div>
                    </div>

                    {/* Upload Section */}
                    <div className="space-y-3 sm:space-y-4">
                      <h4 className="text-sm font-semibold text-gray-700">
                        {t("store.uploadFiles")}
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        {/* Barcode Upload */}
                        <div className="space-y-2 sm:space-y-3">
                          <label className="block text-sm font-semibold text-gray-700">
                            {t("store.barcodeImage")}{" "}
                            <span className="text-red-600">*</span>
                          </label>
                          <div className="border-2 border-dashed border-yellow-300 rounded-md sm:rounded-lg p-3 sm:p-4 text-center hover:border-yellow-400 transition-colors">
                            <input
                              type="file"
                              ref={barcodeRef}
                              accept="image/png, image/jpeg"
                              onChange={(e) => handleFileChange(e, "barcode")}
                              className="hidden"
                              id="barcode-upload"
                              required
                            />
                            <label
                              htmlFor="barcode-upload"
                              className="cursor-pointer block"
                            >
                              <div className="text-xl sm:text-2xl mb-1">📊</div>
                              <div className="text-xs text-gray-600">
                                {t("store.uploadBarcode")}
                              </div>
                            </label>
                          </div>
                          {barcodePreview && (
                            <div className="relative inline-block">
                              <img
                                src={barcodePreview}
                                alt="Barcode Preview"
                                className="h-12 sm:h-16 rounded shadow object-contain"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  setBarcodePreview(null);
                                  setBarcodeFile(null);
                                  if (barcodeRef.current)
                                    barcodeRef.current.value = "";
                                }}
                                className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 shadow-md"
                              >
                                <MdCancel className="text-xs" />
                              </button>
                            </div>
                          )}
                        </div>

                        {/* QR Code Upload */}
                        <div className="space-y-2 sm:space-y-3">
                          <label className="block text-sm font-semibold text-gray-700">
                            QR Code Image{" "}
                            <span className="text-red-600">*</span>
                          </label>
                          <div className="border-2 border-dashed border-yellow-300 rounded-md sm:rounded-lg p-3 sm:p-4 text-center hover:border-yellow-400 transition-colors">
                            <input
                              type="file"
                              ref={qrCodeRef}
                              accept="image/png, image/jpeg"
                              onChange={(e) => handleFileChange(e, "qrcode")}
                              className="hidden"
                              id="qrcode-upload"
                              required
                            />
                            <label
                              htmlFor="qrcode-upload"
                              className="cursor-pointer block"
                            >
                              <div className="text-xl sm:text-2xl mb-1">🔲</div>
                              <div className="text-xs text-gray-600">
                                {t("uploadQrCode")}
                              </div>
                            </label>
                          </div>
                          {qrCodePreview && (
                            <div className="relative inline-block">
                              <img
                                src={qrCodePreview}
                                alt="QR Code Preview"
                                className="h-12 sm:h-16 rounded shadow object-contain"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  setQrCodePreview(null);
                                  setQrCodeFile(null);
                                  if (qrCodeRef.current)
                                    qrCodeRef.current.value = "";
                                }}
                                className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 shadow-md"
                              >
                                <MdCancel className="text-xs" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-4 sm:space-y-6">
                    {/* Categories */}
                    <div>
                      <PredefinedCategorySelector
                        selectedCategories={selectedCategories}
                        selectedSubcategories={selectedSubcategories}
                        onCategoryChange={setSelectedCategories}
                        onSubcategoryChange={setSelectedSubcategories}
                        allowMultiple={true}
                      />
                    </div>

                    {/* Date Selection */}
                    <div className="space-y-3 sm:space-y-4">
                      <h4 className="text-sm font-semibold text-gray-700">
                        {t("validityPeriod")}
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        {/* Start Date */}
                        <div ref={startRef} className="relative">
                          <label className="block text-sm font-semibold text-gray-700 mb-1 sm:mb-2">
                            {t("startDate")}{" "}
                            <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={
                              startDate ? startDate.toLocaleDateString() : ""
                            }
                            onFocus={() => setShowStartDateCalender(true)}
                            readOnly
                            placeholder={t("selectStartDate")}
                            className="w-full px-3 py-2 sm:px-4 sm:py-3 border hover:scale-105 transition border-gray-300 rounded-md sm:rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 cursor-pointer text-sm sm:text-base"
                            required
                          />
                          {showStartDateCalender && (
                            <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[60] bg-white/90 backdrop-blur-md border border-yellow-400 rounded-xl shadow-2xl p-2 sm:p-4">
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
                          <label className="block text-sm font-semibold text-gray-700 mb-1 sm:mb-2">
                            {t("endDate")}{" "}
                            <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={endDate ? endDate.toLocaleDateString() : ""}
                            onFocus={() => setShowEndDateCalender(true)}
                            readOnly
                            placeholder={t("selectEndDate")}
                            className="w-full px-3 py-2 sm:px-4 sm:py-3 border hover:scale-105 transition border-gray-300 rounded-md sm:rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 cursor-pointer text-sm sm:text-base"
                            required
                          />
                          {showEndDateCalender && (
                            <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[60] bg-white/90 backdrop-blur-md border border-yellow-400 rounded-xl shadow-2xl p-2 sm:p-4">
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
                    </div>
                  </div>
                </div>
              ) : activeTab === "antiwaste" ? (
                // Anti-Waste Form
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
                  {/* Left Column */}
                  <div className="space-y-4 sm:space-y-6">
                    {/* Basic Information */}
                    <div className="space-y-3 sm:space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1 sm:mb-2">
                          {t("antiWaste.name")}{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={antiWasteName}
                          onChange={(e) => setAntiWasteName(e.target.value)}
                          className="w-full px-3 py-2 sm:px-4 sm:py-3 border hover:scale-105 transition border-gray-300 rounded-md sm:rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-sm sm:text-base"
                          placeholder={t("antiWaste.enterItemName")}
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1 sm:mb-2">
                          {t("antiWaste.description")}{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          value={antiWasteDescription}
                          onChange={(e) =>
                            setAntiWasteDescription(e.target.value)
                          }
                          rows={3}
                          className="w-full px-3 py-2 sm:px-4 sm:py-3 border hover:scale-105 transition border-gray-300 rounded-md sm:rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-sm sm:text-base"
                          placeholder={t("antiWaste.describeItem")}
                          required
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-1 sm:mb-2">
                            {t("antiWaste.originalPrice")}{" "}
                            <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            value={originalPrice}
                            onChange={(e) => setOriginalPrice(e.target.value)}
                            className="w-full px-3 py-2 sm:px-4 sm:py-3 border hover:scale-105 transition border-gray-300 rounded-md sm:rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-sm sm:text-base"
                            placeholder="0.00"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-1 sm:mb-2">
                            {t("antiWaste.discountedPrice")}{" "}
                            <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            value={discountedPrice}
                            onChange={(e) => setDiscountedPrice(e.target.value)}
                            className="w-full px-3 py-2 sm:px-4 sm:py-3 border hover:scale-105 transition border-gray-300 rounded-md sm:rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-sm sm:text-base"
                            placeholder="0.00"
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-1 sm:mb-2">
                            {t("antiWaste.quantity")}{" "}
                            <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="number"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                            className="w-full px-3 py-2 sm:px-4 sm:py-3 border hover:scale-105 transition border-gray-300 rounded-md sm:rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-sm sm:text-base"
                            placeholder="1"
                            min="1"
                            required
                          />
                        </div>

                        <div ref={expiryRef} className="relative">
                          <label className="block text-sm font-semibold text-gray-700 mb-1 sm:mb-2">
                            {t("antiWaste.expiryDate")}{" "}
                            <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={
                              expiryDate ? expiryDate.toLocaleDateString() : ""
                            }
                            onFocus={() => setShowExpiryDateCalendar(true)}
                            readOnly
                            placeholder={t("antiWaste.selectExpiryDate")}
                            className="w-full px-3 py-2 sm:px-4 sm:py-3 border hover:scale-105 transition border-gray-300 rounded-md sm:rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 cursor-pointer text-sm sm:text-base"
                            required
                          />
                          {showExpiryDateCalendar && (
                            <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[60] bg-white/90 backdrop-blur-md border border-yellow-400 rounded-xl shadow-2xl p-2 sm:p-4">
                              <Calendar
                                mode="single"
                                selected={expiryDate}
                                onSelect={(date) => {
                                  setExpiryDate(date);
                                  setShowExpiryDateCalendar(false);
                                }}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Image Upload */}
                    <div className="space-y-3 sm:space-y-4">
                      <label className="block text-sm font-semibold text-gray-700 mb-1 sm:mb-2">
                        {t("antiWaste.itemImage")}
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setAntiWasteImage(file);
                            setAntiWasteImagePreview(URL.createObjectURL(file));
                          }
                        }}
                        className="w-full px-3 py-2 sm:px-4 sm:py-3 border hover:scale-105 transition border-gray-300 rounded-md sm:rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-sm sm:text-base"
                      />
                      {antiWasteImagePreview && (
                        <div className="relative inline-block">
                          <img
                            src={antiWasteImagePreview}
                            alt="Preview"
                            className="h-24 w-24 sm:h-32 sm:w-32 object-cover rounded-md sm:rounded-lg shadow-md"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setAntiWasteImagePreview(null);
                              setAntiWasteImage(null);
                            }}
                            className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 shadow-md"
                          >
                            <MdCancel className="text-xs sm:text-sm" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-4 sm:space-y-6">
                    {/* Category and Condition */}
                    <div className="space-y-3 sm:space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1 sm:mb-2">
                          {t("antiWaste.category")}{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={antiWasteCategory}
                          onChange={(e) => setAntiWasteCategory(e.target.value)}
                          className="w-full px-3 py-2 sm:px-4 sm:py-3 border hover:scale-105 transition border-gray-300 rounded-md sm:rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-sm sm:text-base"
                          required
                        >
                          <option value="">
                            {t("antiWaste.selectCategory")}
                          </option>
                          {antiWasteCategories.map((category) => (
                            <option key={category} value={category}>
                              {category}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1 sm:mb-2">
                          {t("antiWaste.condition")}{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={antiWasteCondition}
                          onChange={(e) =>
                            setAntiWasteCondition(e.target.value)
                          }
                          className="w-full px-3 py-2 sm:px-4 sm:py-3 border hover:scale-105 transition border-gray-300 rounded-md sm:rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-sm sm:text-base"
                          required
                        >
                          <option value="">
                            {t("antiWaste.selectCondition")}
                          </option>
                          {antiWasteConditions.map((condition) => (
                            <option
                              key={condition.value}
                              value={condition.value}
                            >
                              {condition.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}

              {/* General Conditions Notice for Coupons */}
              {activeTab === "coupons" && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <div className="flex items-start gap-3">
                    <div className="text-blue-600 mt-1">
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-blue-900 mb-2">
                        {t("generalConditionsOfSale")}
                      </h3>
                      <p className="text-xs text-blue-800 mb-3">
                        {t("generalConditionsAcceptance")}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 pt-4 border-t border-gray-200 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowDialog(false);
                    resetForm();
                  }}
                  className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-2 text-sm sm:text-base rounded-md hover:scale-105 transition bg-gray-100 text-gray-700 hover:bg-gray-200 order-2 sm:order-1"
                >
                  {t("cancel")}
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-2 text-sm sm:text-base rounded-md hover:scale-105 transition bg-yellow-500 text-white hover:bg-yellow-600 disabled:opacity-50 order-1 sm:order-2"
                >
                  {isSubmitting
                    ? isEditing
                      ? t("updating")
                      : t("creating")
                    : isEditing
                    ? t("update")
                    : t("create")}
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
