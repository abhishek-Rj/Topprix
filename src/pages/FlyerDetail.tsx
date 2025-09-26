import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  HiArrowLeft,
  HiX,
  HiChevronLeft,
  HiChevronRight,
  HiCalendar,
  HiTag,
} from "react-icons/hi";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { toast } from "react-toastify";
import baseUrl from "@/hooks/baseurl";
import Loader from "@/components/loading";
import { useTranslation } from "react-i18next";

// Set up PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

export default function FlyerDetail() {
  const { t } = useTranslation();
  const { flyerId } = useParams();
  const navigate = useNavigate();
  const [flyer, setFlyer] = useState<any>(null);
  const [store, setStore] = useState<any>(null);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [isLoadingPdf, setIsLoadingPdf] = useState<boolean>(false);
  const [isPdfFile, setIsPdfFile] = useState<boolean | null>(null);

  // Add CSS for zoom functionality
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      .flyer-detail-page {
        zoom: 100% !important;
        transform: scale(1) !important;
        transform-origin: top left !important;
      }
      
      .flyer-detail-page * {
        zoom: inherit;
      }
      
      /* Ensure PDF and images can be zoomed */
      .pdf-container, .image-container {
        zoom: 100% !important;
        transform: scale(1) !important;
      }
      
      /* Allow user zoom on content */
      .flyer-content {
        zoom: 100% !important;
        transform: scale(1) !important;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Force 100% zoom and enable zoom functionality
  useEffect(() => {
    // Force the page to always start at 100% zoom
    const force100PercentZoom = () => {
      // Reset zoom to 100% when page loads
      document.body.style.zoom = "100%";
      document.body.style.transform = "scale(1)";
      document.body.style.transformOrigin = "top left";

      // Reset any CSS transforms that might affect zoom
      document.documentElement.style.zoom = "100%";
      document.documentElement.style.transform = "scale(1)";
    };

    // Set initial zoom
    force100PercentZoom();

    // Also reset zoom when the page becomes visible (handles browser back/forward)
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        force100PercentZoom();
      }
    };

    // Handle browser zoom events
    const handleZoom = () => {
      // Allow user zoom but ensure we start at 100%
      const currentZoom = window.devicePixelRatio || 1;
      if (currentZoom !== 1) {
        // User has zoomed, allow it but don't reset
        return;
      }
    };

    // Set viewport meta tag to allow zooming but start at 100%
    let viewportMeta = document.querySelector('meta[name="viewport"]');
    let originalContent = "";

    if (viewportMeta) {
      originalContent = viewportMeta.getAttribute("content") || "";
      viewportMeta.setAttribute(
        "content",
        "width=device-width, initial-scale=1, minimum-scale=0.5, maximum-scale=3, user-scalable=yes"
      );
    } else {
      viewportMeta = document.createElement("meta");
      viewportMeta.setAttribute("name", "viewport");
      viewportMeta.setAttribute(
        "content",
        "width=device-width, initial-scale=1, minimum-scale=0.5, maximum-scale=3, user-scalable=yes"
      );
      document.head.appendChild(viewportMeta);
    }

    // Add event listeners
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("resize", handleZoom);

    // Cleanup function
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("resize", handleZoom);

      // Restore original viewport meta tag
      if (viewportMeta) {
        if (originalContent) {
          viewportMeta.setAttribute("content", originalContent);
        } else {
          viewportMeta.remove();
        }
      }
    };
  }, []);

  const extensionThinksPdf = flyer?.imageUrl?.toLowerCase().includes(".pdf");
  const isPdf = isPdfFile ?? extensionThinksPdf;

  useEffect(() => {
    const fetchFlyer = async () => {
      if (!flyerId) {
        toast.error(t("flyerPreview.fetchError"));
        navigate("/explore/flyers");
        return;
      }

      try {
        const response = await fetch(`${baseUrl}flyers/${flyerId}`, {
          headers: {
            "Content-Type": "application/json",
            "user-email": localStorage.getItem("userEmail") || "",
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch flyer");
        }
        const data = await response.json();
        setFlyer(data.flyer);

        if (data.storeId) {
          const storeResponse = await fetch(`${baseUrl}store/${data.storeId}`);
          if (storeResponse.ok) {
            const storeData = await storeResponse.json();
            setStore(storeData);
          }
        }
      } catch (err) {
        console.error("Error fetching flyer:", err);
        toast.error(t("flyerPreview.fetchError"));
        navigate("/explore/flyers");
      }
    };

    fetchFlyer();
  }, [flyerId, navigate]);

  useEffect(() => {
    const detectPdf = async () => {
      if (!flyer?.imageUrl) {
        setIsPdfFile(null);
        return;
      }
      if (flyer.imageUrl.toLowerCase().includes(".pdf")) {
        setIsPdfFile(true);
        return;
      }
      try {
        const resp = await fetch(flyer.imageUrl, { method: "GET" });
        const ct = resp.headers.get("content-type") || "";
        setIsPdfFile(ct.toLowerCase().includes("pdf"));
      } catch (_err) {
        setIsPdfFile(false);
      }
    };

    detectPdf();
  }, [flyer?.imageUrl]);

  const calculateDaysLeft = () => {
    if (!flyer?.startDate || !flyer?.endDate)
      return { status: "unknown", days: 0 };

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

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (!flyer) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600"></div>
          <span className="text-lg text-gray-500 mt-4">
            {t("flyerPreview.loading")}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flyer-detail-page">
      {/* Fixed Header with Navigation and Title */}
      <div className="fixed top-0 left-0 right-0 bg-gradient-to-r h-16 from-yellow-800 to-yellow-700 text-white shadow-md z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
          <div className="flex items-center justify-between h-full">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-white/80 hover:text-white transition-colors"
            >
              <HiArrowLeft className="w-4 h-4 mr-1" />
              {t("flyerPreview.back")}
            </button>

            <div className="flex-1 text-center mx-4">
              <h1 className="text-base font-semibold truncate">
                {flyer.title}
              </h1>
              {store && (
                <p className="text-xs text-white/80 truncate">{store.name}</p>
              )}
            </div>

            <div className="flex items-center gap-2">
              {/* Zoom Reset Button */}
              <button
                onClick={() => {
                  document.body.style.zoom = "100%";
                  document.body.style.transform = "scale(1)";
                  document.documentElement.style.zoom = "100%";
                  document.documentElement.style.transform = "scale(1)";
                  toast.success(t("flyerPreview.zoomReset"));
                }}
                className="p-1.5 text-white/80 hover:text-white transition-colors"
                title={t("flyerPreview.resetZoom")}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                  />
                </svg>
              </button>

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

      {/* Flyer Information Bar */}
      <div className="fixed top-16 left-0 right-0 bg-white border-b border-gray-200 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-4">
              {flyer.category && (
                <div className="flex items-center gap-1">
                  <HiTag className="w-4 h-4 text-yellow-600" />
                  <span className="text-gray-600">{flyer.category}</span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <HiCalendar className="w-4 h-4 text-gray-500" />
                <span className="text-gray-600">
                  {t("flyerPreview.validUntil")}: {formatDate(flyer.endDate)}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`text-xs px-2 py-1 rounded-full border ${
                  getDateBadge().className
                }`}
              >
                {getDateBadge().text}
              </span>
              {/* Zoom Instructions */}
              <div className="text-xs text-gray-500 flex items-center gap-1">
                <svg
                  className="w-3 h-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                  />
                </svg>
                <span>{t("flyerPreview.zoomInstructions")}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area - Flyer Display */}
      <div className="pt-28 bg-gray-100 h-screen flyer-content">
        {isPdf ? (
          // PDF Display
          <div className="h-full w-full">
            {isLoadingPdf && (
              <div className="flex flex-col items-center justify-center h-full">
                <Loader />
                <span className="text-lg text-gray-500 mt-4">
                  {t("flyerPreview.loading")}
                </span>
              </div>
            )}
            <Document
              file={flyer.imageUrl}
              onLoadSuccess={({ numPages }) => {
                setNumPages(numPages);
                setIsLoadingPdf(false);
              }}
              onLoadStart={() => setIsLoadingPdf(true)}
              onLoadError={(error) => {
                console.error("Error loading PDF:", error);
                toast.error(t("flyerPreview.pdfLoadError"));
                setIsLoadingPdf(false);
              }}
              error={
                <div className="flex flex-col items-center justify-center h-full">
                  <div className="text-red-600 text-2xl font-bold mb-4">
                    PDF
                  </div>
                  <p className="text-gray-500">
                    {t("flyerPreview.pdfLoadError")}
                  </p>
                </div>
              }
            >
              <div
                className="h-full overflow-x-auto p-4 pdf-container"
                id="pdf-container"
                onWheel={(e) => {
                  // Handle horizontal scrolling for multi-page PDFs
                  if (numPages && numPages > 1) {
                    // Allow horizontal scrolling with shift+wheel
                    if (e.shiftKey) {
                      e.preventDefault();
                      const container = e.currentTarget;
                      container.scrollBy({
                        left: e.deltaY,
                        behavior: "auto",
                      });
                    }
                    // For regular wheel, allow zooming
                  }
                }}
              >
                <div className="flex gap-6 h-full">
                  {Array.from(new Array(numPages || 1), (_, index) => (
                    <div
                      key={`page_${index + 1}`}
                      className="flex-shrink-0 flex items-center justify-center"
                    >
                      <div className="shadow-lg rounded-lg overflow-hidden bg-white">
                        <Page
                          pageNumber={index + 1}
                          height={window.innerHeight - 140}
                          renderTextLayer={false}
                          renderAnnotationLayer={false}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Document>

            {/* Navigation Buttons - Positioned outside PDF container for fixed positioning */}
            {numPages && numPages > 1 && (
              <>
                {/* Left Button */}
                <button
                  onClick={() => {
                    const container = document.getElementById("pdf-container");
                    if (container) {
                      container.scrollBy({
                        left: -400,
                        behavior: "smooth",
                      });
                    }
                  }}
                  className="fixed left-6 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full shadow-lg transition-all z-50"
                >
                  <HiChevronLeft className="w-6 h-6" />
                </button>

                {/* Right Button */}
                <button
                  onClick={() => {
                    const container = document.getElementById("pdf-container");
                    if (container) {
                      container.scrollBy({
                        left: 400,
                        behavior: "smooth",
                      });
                    }
                  }}
                  className="fixed right-6 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full shadow-lg transition-all z-50"
                >
                  <HiChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
          </div>
        ) : (
          // Regular Image Display
          <div className="h-full w-full flex items-center justify-center p-4 image-container">
            <img
              src={flyer.imageUrl}
              alt={flyer.title}
              className="max-w-full max-h-full object-contain rounded-lg shadow-sm"
            />
          </div>
        )}
      </div>
    </div>
  );
}
