import { useEffect, useState, useRef } from "react";
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { useParams, useNavigate } from "react-router-dom";
import { HiArrowLeft, HiX } from "react-icons/hi";
import baseUrl from "@/hooks/baseurl";

// Set up PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).toString();

const PDFViewer = () => {
  const { flyerId } = useParams();
  const navigate = useNavigate();
  const [flyer, setFlyer] = useState<any>(null);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchFlyer = async () => {
      if (!flyerId) {
        setError("No flyer ID provided");
        setLoading(false);
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
        setError("Failed to load flyer");
        console.error("Error fetching flyer:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFlyer();
  }, [flyerId]);

  const handleDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  const handleDocumentLoadError = (error: Error) => {
    console.error('Error loading PDF:', error);
    setError('Failed to load PDF');
  };

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ 
        left: -scrollContainerRef.current.offsetWidth * 0.8, 
        behavior: 'smooth' 
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ 
        left: scrollContainerRef.current.offsetWidth * 0.8, 
        behavior: 'smooth' 
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600"></div>
          <span className="text-lg text-gray-500 mt-4">Loading flyer...</span>
        </div>
      </div>
    );
  }

  if (error || !flyer) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-2xl font-bold mb-4">Error</div>
          <p className="text-gray-500 mb-4">{error || "Flyer not found"}</p>
          <button
            onClick={() => navigate(-1)}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const isPdf = flyer?.imageUrl?.toLowerCase().includes('.pdf');

  if (!isPdf) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-2xl font-bold mb-4">Not a PDF</div>
          <p className="text-gray-500 mb-4">This flyer is not a PDF file.</p>
          <button
            onClick={() => navigate(-1)}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <HiArrowLeft className="w-5 h-5 mr-2" />
                Back
              </button>
              <h1 className="ml-4 text-lg font-semibold text-gray-900 truncate">
                {flyer.title}
              </h1>
            </div>
            <button
              onClick={() => navigate(-1)}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <HiX className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* PDF Viewer */}
      <div className="flex-1 relative" style={{ height: 'calc(100vh - 64px)' }}>
        <div className="w-full h-full flex items-center justify-center bg-gray-100">
          <div className="relative w-full h-full max-w-7xl mx-auto">
            <Document
              file={flyer.imageUrl}
              onLoadSuccess={handleDocumentLoadSuccess}
              onLoadError={handleDocumentLoadError}
              loading={
                <div className="flex flex-col items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600"></div>
                  <span className="text-lg text-gray-500 mt-4">Loading PDF...</span>
                </div>
              }
              error={
                <div className="flex flex-col items-center justify-center h-full">
                  <div className="text-red-600 text-2xl font-bold mb-4">PDF Error</div>
                  <p className="text-gray-500">Failed to load PDF</p>
                </div>
              }
            >
              <div 
                ref={scrollContainerRef}
                className="flex gap-6 overflow-x-auto overflow-y-auto h-full custom-scrollbar"
                style={{ 
                  scrollBehavior: 'smooth',
                  scrollbarWidth: 'auto',
                  scrollbarColor: '#9CA3AF #F3F4F6',
                  maxHeight: '100%',
                  padding: '20px'
                }}
              >
                {Array.from(new Array(numPages || 1), (el, index) => (
                  <div key={`page_${index + 1}`} className="flex-shrink-0 flex items-center">
                    <Page
                      pageNumber={index + 1}
                      width={Math.min(800, window.innerWidth * 0.9)}
                      height={Math.min(700, window.innerHeight * 0.8)}
                      renderTextLayer={false}
                      renderAnnotationLayer={false}
                    />
                  </div>
                ))}
              </div>
            </Document>
            
            {/* Navigation Buttons */}
            {numPages && numPages > 1 && (
              <>
                <button
                  onClick={scrollLeft}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/70 hover:bg-black/80 text-white p-3 rounded-full transition-all z-10"
                  title="Scroll Left"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={scrollRight}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/70 hover:bg-black/80 text-white p-3 rounded-full transition-all z-10"
                  title="Scroll Right"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}
            
            {/* Page Count */}
            {numPages && numPages > 1 && (
              <div className="absolute bottom-6 right-6 bg-black/70 text-white px-4 py-2 rounded-lg text-sm">
                {numPages} pages
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PDFViewer; 