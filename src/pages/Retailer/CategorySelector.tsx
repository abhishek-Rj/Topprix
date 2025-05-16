import { useEffect, useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../context/firebaseProvider";
import baseUrl from "../../hooks/baseurl";
import AddCategoryDialog from "../../components/AddCategory";

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
    if (!newCat.trim()) return;
    const docRef = await addDoc(collection(db, "categories"), {
      name: newCat.trim(),
    });
    const newCategory: Category = { id: docRef.id, name: newCat.trim() };
    setCategories([...categories, newCategory]);
    onChange([...selected, docRef.id]);
    setNewCat("");
    setAdding(false);
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">
        Categories
      </label>
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => toggleCategory(cat.id)}
            className={`px-4 py-1 rounded-full text-sm border transition ${
              selected.includes(cat.id)
                ? "bg-yellow-600 text-white border-yellow-600"
                : "bg-white text-gray-700 border-gray-300 hover:bg-yellow-50"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {adding ? (
        <div className="flex gap-2 mt-2">
          <input
            value={newCat}
            onChange={(e) => setNewCat(e.target.value)}
            placeholder="New category"
            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-yellow-500 focus:border-yellow-500 w-full"
          />
          <button
            onClick={handleAddNew}
            className="px-4 bg-yellow-600 text-white rounded-md hover:bg-yellow-700"
          >
            Add
          </button>
          <button
            onClick={() => {
              setAdding(false);
              setNewCat("");
            }}
            className="text-sm text-gray-500 hover:underline"
          >
            Cancel
          </button>
        </div>
      ) : (
        <button
          onClick={() => setDialogOpen(true)}
          className="text-sm text-yellow-600 hover:underline mt-2"
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
