import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "../../components/navigation";
import Loader from "../../components/loading";
import useAuthenticate from "../../hooks/authenticationt";

export default function RetailerStores() {
  const { userRole, loading } = useAuthenticate();
  const [stores, setStores] = useState<any[]>([]);

  const navigate = useNavigate();

  useEffect(() => {
    if (userRole === "USER") {
      navigate("/not-found");
    }
  });

  if (loading) {
    return (
      <>
        <Navigation />
        <div className="flex items-center justify-center min-h-screen">
          <Loader />
        </div>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-yellow-50">
      <Navigation />
      <main className="pt-20">
        <div className="container mx-auto px-4 py-12">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold translate-x-4 text-gray-900">
              Your Stores
            </h1>
            <button
              onClick={() => navigate("/retailer-stores/create-new-store")}
              className="px-5 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition"
            >
              + Create New Store
            </button>
          </div>

          {stores.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {stores.map((store) => (
                <div
                  key={store.id}
                  className="bg-white rounded-lg shadow p-5 hover:shadow-md transition cursor-pointer"
                  onClick={() => navigate(`/store/${store.id}`)}
                >
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">
                    {store.name}
                  </h2>
                  <p className="text-sm text-gray-600">
                    {store.description || "No description available."}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-600 text-lg">
              You haven't created any stores yet.
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
