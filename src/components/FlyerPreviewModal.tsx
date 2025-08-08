import { useEffect, useState } from "react";
import {
  HiX,
  HiLocationMarker,
  HiCalendar,
  HiTag,
  HiExternalLink,
} from "react-icons/hi";
import { FaStore } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import baseUrl from "@/hooks/baseurl";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

// Set up PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

interface FlyerPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  flyer: any;
}

export default function FlyerPreviewModal({
  isOpen,
  onClose,
  flyer,
}: FlyerPreviewModalProps) {
  const [store, setStore] = useState<any>(null);
  const [loadingStore, setLoadingStore] = useState(false);
  const [pdfLoadError, setPdfLoadError] = useState<boolean>(false);
  const navigate = useNavigate();

  // Check if the flyer URL is a PDF
  const isPdf = flyer?.imageUrl?.toLowerCase().includes(".pdf");

  // Fetch store data
  useEffect(() => {
    const fetchStore = async () => {
      if (!flyer?.storeId) return;

      setLoadingStore(true);
      try {
        const response = await fetch(`${baseUrl}store/${flyer.storeId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch store data");
        }
        const data = await response.json();
        setStore(data);
      } catch (error) {
        console.error("Error fetching store:", error);
        toast.error("Failed to load store information");
      } finally {
        setLoadingStore(false);
      }
    };

    if (isOpen && flyer?.storeId) {
      fetchStore();
    }
  }, [isOpen, flyer?.storeId]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Calculate days left
  const calculateDaysLeft = () => {
    if (!flyer?.endDate) return 0;
    const today = new Date();
    const endDate = new Date(flyer.endDate);
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Format date
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleViewFullFlyer = () => {
    navigate(`/flyers/${flyer.id}`);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Flyer Preview</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-gray-100"
          >
            <HiX className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="space-y-6">
            {/* Flyer Image and Title */}
            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-1/2">
                <div className="relative w-full h-64 bg-gray-100 rounded-lg overflow-hidden">
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
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-600"></div>
                              </div>
                            }
                            error={
                              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                <HiTag className="w-12 h-12 text-gray-400" />
                              </div>
                            }
                          >
                            <Page
                              pageNumber={1}
                              height={256}
                              renderTextLayer={false}
                              renderAnnotationLayer={false}
                              className="pdf-page-preview"
                            />
                          </Document>
                        ) : (
                          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                            <HiTag className="w-12 h-12 text-gray-400" />
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
                    <div className="w-full h-full flex items-center justify-center">
                      <HiTag className="w-12 h-12 text-gray-400" />
                    </div>
                  )}
                </div>
              </div>

              <div className="md:w-1/2 space-y-4">
                <h3 className="text-xl font-bold text-gray-900">
                  {flyer.title}
                </h3>

                {flyer.description && (
                  <p className="text-gray-600 leading-relaxed">
                    {flyer.description}
                  </p>
                )}

                {/* Category */}
                {flyer.category && (
                  <div className="flex items-center gap-2">
                    <HiTag className="w-4 h-4 text-yellow-600" />
                    <span className="text-sm font-medium text-yellow-600">
                      {flyer.category}
                    </span>
                  </div>
                )}

                {/* Validity */}
                <div className="flex items-center gap-2">
                  <HiCalendar className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">
                    Valid until: {formatDate(flyer.endDate)}
                  </span>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      calculateDaysLeft() <= 0
                        ? "bg-red-100 text-red-600"
                        : calculateDaysLeft() <= 3
                        ? "bg-orange-100 text-orange-600"
                        : "bg-green-100 text-green-600"
                    }`}
                  >
                    {calculateDaysLeft() === 0
                      ? "Last day"
                      : calculateDaysLeft() < 0
                      ? "Expired"
                      : `${calculateDaysLeft()} days left`}
                  </span>
                </div>
              </div>
            </div>

            {/* Store Information */}
            <div className="border-t pt-6">
              <div className="flex items-center gap-2 mb-4">
                <FaStore className="w-5 h-5 text-yellow-600" />
                <h4 className="text-lg font-semibold text-gray-900">
                  Store Information
                </h4>
              </div>

              {loadingStore ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-600"></div>
                </div>
              ) : store ? (
                <div className="space-y-3">
                  <div>
                    <h5 className="font-semibold text-gray-900">
                      {store.name}
                    </h5>
                    {store.description && (
                      <p className="text-gray-600 text-sm mt-1">
                        {store.description}
                      </p>
                    )}
                  </div>

                  {store.address && (
                    <div className="flex items-start gap-2">
                      <HiLocationMarker className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-600">
                        {store.address}
                      </span>
                    </div>
                  )}

                  {store.phone && (
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">Phone: </span>
                      {store.phone}
                    </div>
                  )}

                  {store.email && (
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">Email: </span>
                      {store.email}
                    </div>
                  )}

                  {store.website && (
                    <div className="text-sm">
                      <a
                        href={store.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-yellow-600 hover:text-yellow-700 flex items-center gap-1"
                      >
                        Visit Website
                        <HiExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">
                  Store information not available
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <Button
              onClick={handleViewFullFlyer}
              className="bg-yellow-600 hover:bg-yellow-700 text-white flex items-center gap-2"
            >
              View Full Flyer
              <HiExternalLink className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// CSS for PDF rendering in preview modal
const pdfPreviewStyles = `
  .pdf-page-preview {
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
  }
  
  .pdf-page-preview .react-pdf__Page {
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
  }
  
  .pdf-page-preview .react-pdf__Page__canvas {
    max-width: 100% !important;
    max-height: 100% !important;
    object-fit: contain !important;
    border-radius: 0.5rem !important;
  }
`;

// Inject styles
if (typeof document !== "undefined") {
  const styleElement = document.createElement("style");
  styleElement.textContent = pdfPreviewStyles;
  document.head.appendChild(styleElement);
}
