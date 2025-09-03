import { useEffect, useState } from "react";
import baseUrl from "../../hooks/baseurl";
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
  const { userRole } = useAuthenticate();

  useEffect(() => {
    (async () => {
      try {
        const resp = await fetch(`${baseUrl}categories/with-subcategories`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        const data = await resp.json();
        const source = data.categories || data || [];
        const flattened = Array.isArray(source)
          ? source.flatMap((cat: any) =>
              (cat.subcategories || []).map((sub: any) => ({
                id: sub.id,
                name: sub.name,
              }))
            )
          : [];
        setCategories(flattened);
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
                ? userRole === "ADMIN"
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-yellow-600 text-white border-yellow-600"
                : userRole === "ADMIN"
                ? "bg-white text-gray-700 border-gray-300 hover:bg-blue-50"
                : "bg-white text-gray-700 border-gray-300 hover:bg-yellow-50"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>
    </div>
  );
}
