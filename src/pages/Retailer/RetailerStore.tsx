import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "../../components/navigation";
import Loader from "../../components/loading";
import { auth, db } from "../../context/firebaseProvider";
import useBaseUrl from "../../hooks/baseurl";
import useAuthenticate from "../../hooks/authenticationt";

export default function RetailerStores() {
  const { authenticated, user, userRole, loading } = useAuthenticate();
  const [stores, setStores] = useState<any[]>([]);
  const [category, setCategory] = useState<any[]>([]);
  const [showCategoryDialog, setShowCategoryDialog] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [addingNewCategory, setAddingNewCategory] = useState(false);
  const [newCategory, setNewCategory] = useState<string>("");

  const navigate = useNavigate();
  const baseUrl = useBaseUrl;

  useEffect(() => {
    (async () => {
      try {
        const getCategories = await fetch(`${baseUrl}categories`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await getCategories.json();
        if (data.categories) {
          setCategory(data.categories);
        } else {
          throw new Error("No categories found");
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    })();
  }, []);

  const handleCategory = async () => {
    try {
      if (category.map((cat) => cat.name).includes(newCategory)) {
        alert("Category already exists");
        return;
      }
      const submitCategory = await fetch(`${baseUrl}category`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "user-email": user.email,
        },
        body: JSON.stringify({
          name: addingNewCategory ? newCategory : selectedCategory,
          description: description,
        }),
      });

      const response = await submitCategory.json();
      if (!response.category) {
        throw new Error("Failed to create store");
      }
      navigate(`/retailer-stores/create-new-store`);
    } catch (error) {
      console.error("Error creating store:", error);
    }
  };

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
              onClick={() => setShowCategoryDialog(true)}
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

      {showCategoryDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4 shadow-xl">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Create New Store
            </h3>

            <select
              className="w-full mb-4 p-2 border border-gray-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500"
              value={selectedCategory}
              onChange={(e) => {
                const value = e.target.value;
                if (value === "other") {
                  setAddingNewCategory(true);
                  setSelectedCategory("");
                  setDescription("");
                } else {
                  setAddingNewCategory(false);
                  setSelectedCategory(value);
                  const selectedCat = category.find(
                    (cat) => cat.name === value
                  );
                  setDescription(selectedCat ? selectedCat.description : "");
                }
              }}
            >
              <option value="" disabled>
                Select a Category
              </option>
              {category.map((cat) => (
                <option key={cat.id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
              <option value="other">+ Add New Category</option>
            </select>

            {addingNewCategory && (
              <input
                type="text"
                placeholder="Enter New Category Name"
                className="w-full mb-4 p-2 border border-gray-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
              />
            )}

            <input
              type="text"
              placeholder="Enter Description"
              className="w-full mb-4 p-2 border border-gray-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowCategoryDialog(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={() => handleCategory()}
                className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 disabled:opacity-50"
                disabled={
                  (!addingNewCategory && !selectedCategory) ||
                  (addingNewCategory && !newCategory) ||
                  !description
                }
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
