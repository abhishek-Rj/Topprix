import { useEffect, useState } from "react";
import baseUrl from "../../hooks/baseurl";
import AddCategoryDialog from "../../components/AddCategory";
import useAuthenticate from "@/hooks/authenticationt";
import { toast } from "react-toastify";

type Category = {
  id: string;
  name: string;
};

interface Props {
  selected: string[];
  onChange: (updated: string[]) => void;
}

export default function CategorySelector({ selected, onChange }: Props) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCat, setNewCat] = useState("");
  const [adding, setAdding] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { user, userRole } = useAuthenticate();

  useEffect(() => {
    if (dialogOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
  }, [dialogOpen]);

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
          setCategories(data.categories);
        } else {
          console.error("No categories found");
          throw new Error("No categories found");
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    })();
  }, []);

  const toggleCategory = (catId: string) => {
    if (selected.includes(catId)) {
      onChange(selected.filter((id) => id !== catId));
    } else {
      onChange([...selected, catId]);
    }
  };

  const handleAddNew = async () => {
    try {
      const addNewCategory = await fetch(`${baseUrl}categories`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "user-email" : `${user?.email}`,
        },
        body: JSON.stringify({ name: newCat }),
      });
      const data = await addNewCategory.json();
      if (data.category) {
        setCategories((prev) => [...prev, data.category]);
        onChange([...selected, data.category.id]);
        setNewCat("");
        setAdding(false);
        toast.success("Category added successfully!");
      }
    } catch (error) {
      toast.error("Error adding new category. Please try again.");
    }
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-bold text-gray-700">
        Select Categories <span className="text-red-600">*</span>
      </label>
      <div className="flex flex-wrap gap-1.5 sm:gap-2">
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => toggleCategory(cat.id)}
            className={`px-2 sm:px-4 py-1 hover:scale-105 rounded-full text-xs sm:text-sm border transition ${
              selected.includes(cat.id)
                ? userRole === "ADMIN" ? "bg-blue-600 text-white border-blue-600" : "bg-yellow-600 text-white border-yellow-600"
                : userRole === "ADMIN" ? "bg-white text-gray-700 border-gray-300 hover:bg-blue-50" : "bg-white text-gray-700 border-gray-300 hover:bg-yellow-50"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {adding ? (
        <div className="flex flex-col sm:flex-row gap-2 mt-2">
          <input
            value={newCat}
            onChange={(e) => setNewCat(e.target.value)}
            placeholder="New category"
            className={`px-3 py-2 border border-gray-300 rounded-md focus:ring-${userRole === "ADMIN" ? "blue" : "yellow"}-500 focus:border-${userRole === "ADMIN" ? "blue" : "yellow"}-500 w-full`}
          />
          <div className="flex gap-2">
            <button
              onClick={handleAddNew}
              className={`flex-1 sm:flex-none px-4 ${userRole === "ADMIN" ? "bg-blue-600 hover:bg-blue-700" : "bg-yellow-600 hover:bg-yellow-700"} text-white rounded-md`}
            >
              Add
            </button>
            <button
              onClick={() => {
                setAdding(false);
                setNewCat("");
              }}
              className="flex-1 sm:flex-none text-sm text-gray-500 hover:underline"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setDialogOpen(true)}
          className={`text-xs sm:text-sm ${userRole === "ADMIN" ? "text-blue-600" : "text-yellow-600"} hover:underline mt-2`}
        >
          + Add New Category
        </button>
      )}

      <AddCategoryDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onAdded={(newCategory) => {
          setCategories((prev) => [...prev, newCategory]);
          onChange([...selected, newCategory.id]);
        }}
      />
    </div>
  );
}
