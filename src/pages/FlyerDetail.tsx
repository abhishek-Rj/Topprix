import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  HiArrowLeft,
  HiX,
  HiChevronLeft,
  HiChevronRight,
} from "react-icons/hi";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { toast } from "react-toastify";
import baseUrl from "@/hooks/baseurl";
import Loader from "@/components/loading";

// Set up PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

export default function FlyerDetail() {
  const { flyerId } = useParams();
  const navigate = useNavigate();
  const [flyer, setFlyer] = useState<any>(null);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [isLoadingPdf, setIsLoadingPdf] = useState<boolean>(false);

  // Disable zoom functionality
  useEffect(() => {
    // Prevent zoom with keyboard shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.ctrlKey || e.metaKey) &&
        (e.key === "+" || e.key === "-" || e.key === "0" || e.key === "=")
      ) {
        e.preventDefault();
      }
    };

    // Prevent zoom with mouse wheel
    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
      }
    };

    // Prevent zoom with touch gestures
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 1) {
        e.preventDefault();
      }
    };

    // Add event listeners
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("wheel", handleWheel, { passive: false });
    document.addEventListener("touchstart", handleTouchStart, {
      passive: false,
    });

    // Set viewport meta tag to disable zoom
    let viewportMeta = document.querySelector('meta[name="viewport"]');
    let originalContent = "";

    if (viewportMeta) {
      originalContent = viewportMeta.getAttribute("content") || "";
      viewportMeta.setAttribute(
        "content",
        "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
      );
    } else {
      viewportMeta = document.createElement("meta");
      viewportMeta.setAttribute("name", "viewport");
      viewportMeta.setAttribute(
        "content",
        "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
      );
      document.head.appendChild(viewportMeta);
    }

    // Cleanup function
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("wheel", handleWheel);
      document.removeEventListener("touchstart", handleTouchStart);

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

  // Check if the flyer is a PDF
  const isPdf = flyer?.imageUrl?.toLowerCase().includes(".pdf");

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
    <div
      className="min-h-screen bg-gray-50"
      style={{
        userSelect: "none",
        WebkitUserSelect: "none",
        MozUserSelect: "none",
        msUserSelect: "none",
      }}
    >
      {/* Fixed Header with Navigation and Title */}
      <div className="fixed top-0 left-0 right-0 bg-gradient-to-r h-12 from-yellow-800 to-yellow-700 text-white shadow-md z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
          <div className="flex items-center justify-between h-full">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-white/80 hover:text-white transition-colors"
            >
              <HiArrowLeft className="w-4 h-4 mr-1" />
              Back
            </button>

            <h1 className="text-base font-semibold truncate flex-1 text-center mx-4">
              {flyer.title}
            </h1>

            <button
              onClick={() => navigate(-1)}
              className="p-1.5 text-white/80 hover:text-white transition-colors"
            >
              <HiX className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area - Flyer Display */}
      <div className="pt-12 bg-gray-100 h-screen">
        {isPdf ? (
          // PDF Display
          <div className="h-full w-full">
            {isLoadingPdf && (
              <div className="flex flex-col items-center justify-center h-full">
                <Loader />
                <span className="text-lg text-gray-500 mt-4">
                  Loading Flyer...
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
                toast.error("Failed to load PDF");
                setIsLoadingPdf(false);
              }}
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
                className="h-full overflow-x-auto p-4"
                id="pdf-container"
                onWheel={(e) => {
                  e.preventDefault();
                  const container = e.currentTarget;
                  container.scrollBy({
                    left: e.deltaY,
                    behavior: "auto",
                  });
                }}
              >
                <div className="flex gap-6 h-full">
                  {Array.from(new Array(numPages || 1), (el, index) => (
                    <div
                      key={`page_${index + 1}`}
                      className="flex-shrink-0 flex items-center justify-center"
                    >
                      <div className="shadow-lg rounded-lg overflow-hidden bg-white">
                        <Page
                          pageNumber={index + 1}
                          height={window.innerHeight - 100}
                          renderTextLayer={false}
                          renderAnnotationLayer={false}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Navigation Buttons */}
                {numPages && numPages > 1 && (
                  <>
                    {/* Left Button */}
                    <button
                      onClick={() => {
                        const container =
                          document.getElementById("pdf-container");
                        if (container) {
                          container.scrollBy({
                            left: -400,
                            behavior: "smooth",
                          });
                        }
                      }}
                      className="absolute left-6 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full shadow-lg transition-all z-10"
                    >
                      <HiChevronLeft className="w-6 h-6" />
                    </button>

                    {/* Right Button */}
                    <button
                      onClick={() => {
                        const container =
                          document.getElementById("pdf-container");
                        if (container) {
                          container.scrollBy({
                            left: 400,
                            behavior: "smooth",
                          });
                        }
                      }}
                      className="absolute right-6 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full shadow-lg transition-all z-10"
                    >
                      <HiChevronRight className="w-6 h-6" />
                    </button>
                  </>
                )}
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
    </div>
  );
}
