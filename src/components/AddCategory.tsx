import { useEffect, useState } from "react";
import baseUrl from "../hooks/baseurl";
import { toast } from "react-toastify";
import useAuthenticate from "../hooks/authenticationt";

interface Props {
  open: boolean;
  onClose: () => void;
  onAdded: (newCategory: { id: string; name: string }) => void;
}

export default function AddCategoryDialog({ open, onClose }: Props) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<any>();
  const [loading, setLoading] = useState(false);
  const { user } = useAuthenticate();

  useEffect(() => {
    (async () => {
      try {
        const response = await fetch(`${baseUrl}categories`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        if (data.categories) {
          setCategory(data.categories);
        } else {
          console.error("No categories found");
          throw new Error("No categories found");
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    })();
  }, []);

  const handleAdd = async () => {
    setLoading(true);
    if (category.map((cat: any) => cat.name).includes(name)) {
      setLoading(false);
      toast.error("Category already exists");
      return;
    }
    try {
      const newCategory = await fetch(`${baseUrl}category`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "user-email": user?.email,
        },
        body: JSON.stringify({
          name,
          description,
        }),
      });
      const data = await newCategory.json();
      if (!data.category) {
        toast.error("Category creation failed");
        throw new Error("Category creation failed");
      }
      toast.success("Category created successfully");
      window.location.reload();
    } catch (error) {
      console.error("Error creating category:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md mx-4">
        <h2 className="text-lg font-semibold mb-4 text-gray-900">
          Add New Category
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category Name
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500"
              placeholder="e.g., Electronics"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description (optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500"
              placeholder="Short description..."
            />
          </div>
        </div>

        <div className="flex justify-end mt-6 gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            onClick={handleAdd}
            disabled={loading}
            className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 disabled:opacity-60"
          >
            {loading ? "Adding..." : "Add Category"}
          </button>
        </div>
      </div>
    </div>
  );
}
