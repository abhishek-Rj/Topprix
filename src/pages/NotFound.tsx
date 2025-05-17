import { Link } from "react-router-dom";
import Navigation from "../components/navigation";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-yellow-50 flex flex-col">
      <Navigation />
      <main className="flex-grow flex items-center justify-center px-4 pt-20 pb-16">
        <div className="text-center">
          <h1 className="text-7xl font-extrabold text-yellow-600 mb-4">404</h1>
          <h2 className="text-3xl font-semibold text-gray-900 mb-4">
            Page Not Found
          </h2>
          <p className="text-gray-600 mb-8">
            Sorry, the page you are looking for doesn't exist or has been moved.
          </p>
          <Link
            to="/"
            className="inline-block px-6 py-3 bg-yellow-600 text-white rounded-lg text-sm font-medium hover:bg-yellow-700 transition"
          >
            Go Back Home
          </Link>
        </div>
      </main>
    </div>
  );
}
