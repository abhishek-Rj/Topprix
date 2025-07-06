import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "../components/navigation";
import Loader from "../components/loading";
import useAuthenticate from "../hooks/authenticationt";
import baseUrl from "../hooks/baseurl";
import { toast } from "react-toastify";
import { HiPlus, HiTrash, HiCheck, HiX } from "react-icons/hi";
import Footer from "@/components/Footer";

interface ShoppingListItem {
  id: string;
  name: string;
  quantity: number;
  isChecked: boolean;
  flyerItemId?: string;
}

interface ShoppingList {  
  id: string;
  title: string;
  userId: string;
  items: ShoppingListItem[];
  createdAt: string;
  updatedAt: string;
}

export default function ShoppingList() {
  const { user, userRole, loading } = useAuthenticate();
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | null>(null)
  const [shoppingLists, setShoppingLists] = useState<ShoppingList[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [selectedList, setSelectedList] = useState<ShoppingList | null>(null);
  const [newListTitle, setNewListTitle] = useState("");
  const [newItemName, setNewItemName] = useState("");
  const [newItemQuantity, setNewItemQuantity] = useState(1);

  if (user === null) {
    navigate("/login");
  }

  if (userRole == "ADMIN" || userRole == "RETAILER") {
    navigate("/not-found");
  }

  // Fetch backend user ID on mount
  useEffect(() => {
    const fetchUserId = async () => {
      if (!user?.email) return;
      
      try {
        const response = await fetch(`${baseUrl}user/${user.email}`);
        if (!response.ok) {
          toast.error("Couldn't fetch user data");
          throw new Error("Couldn't fetch user data");
        }
        const userData = await response.json();
        const userIdentity = userData?.id;
        setUserId(userIdentity);
        
        // Only fetch shopping lists after we have the user ID
        if (userIdentity) {
          fetchShoppingLists(userIdentity);
        }
      } catch (error) {
        console.error("Error fetching user ID:", error);
      }
    };
    
    fetchUserId();
  }, [user?.email]);

  const fetchShoppingLists = async (userIdentity: string) => {
    if (!userIdentity) return;
    
    setIsLoading(true);
    try {
      const response = await fetch(`${baseUrl}api/users/${userIdentity}/shopping-lists?includeItems=true`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "user-email": user?.email || "",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setShoppingLists(data.shoppingLists || []);
      } else {
        throw new Error("Failed to fetch shopping lists");
      }
    } catch (error) {
      console.error("Error fetching shopping lists:", error);
      toast.error("Failed to load shopping lists");
    } finally {
      setIsLoading(false);
    }
  };

  const createShoppingList = async () => {
    if (!userId || !newListTitle.trim()) return;

    try {
      const response = await fetch(`${baseUrl}api/shopping-lists`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "user-email": user?.email || "",
        },
        body: JSON.stringify({
          title: newListTitle.trim(),
          userId: userId,
        }),
      });

      if (response.ok) {
        toast.success("Shopping list created successfully");
        setShowCreateModal(false);
        setNewListTitle("");
        fetchShoppingLists(userId);
      } else {
        throw new Error("Failed to create shopping list");
      }
    } catch (error) {
      console.error("Error creating shopping list:", error);
      toast.error("Failed to create shopping list");
    }
  };

  const deleteShoppingList = async (listId: string) => {
    if (!confirm("Are you sure you want to delete this shopping list?")) return;

    try {
      const response = await fetch(`${baseUrl}api/shopping-lists/${listId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "user-email": user?.email || "",
        },
      });

      if (response.ok) {
        toast.success("Shopping list deleted successfully");
        fetchShoppingLists(userId || "");
      } else {
        throw new Error("Failed to delete shopping list");
      }
    } catch (error) {
      console.error("Error deleting shopping list:", error);
      toast.error("Failed to delete shopping list");
    }
  };

  const addShoppingListItem = async () => {
    if (!selectedList || !newItemName.trim()) return;

    try {
      const response = await fetch(`${baseUrl}api/shopping-lists/${selectedList.id}/items`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "user-email": user?.email || "",
        },
        body: JSON.stringify({
          name: newItemName.trim(),
          quantity: newItemQuantity,
        }),
      });

      if (response.ok) {
        toast.success("Item added successfully");
        setShowAddItemModal(false);
        setNewItemName("");
        setNewItemQuantity(1);
        fetchShoppingLists(userId || "");
      } else {
        throw new Error("Failed to add item");
      }
    } catch (error) {
      console.error("Error adding item:", error);
      toast.error("Failed to add item");
    }
  };

  const updateShoppingListItem = async (itemId: string, updates: Partial<ShoppingListItem>) => {
    try {
      const response = await fetch(`${baseUrl}api/shopping-list-items/${itemId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "user-email": user?.email || "",
        },
        body: JSON.stringify(updates),
      });

      if (response.ok) {
        toast.success("Item updated successfully");
        fetchShoppingLists(userId || "");
      } else {
        throw new Error("Failed to update item");
      }
    } catch (error) {
      console.error("Error updating item:", error);
      toast.error("Failed to update item");
    }
  };

  const deleteShoppingListItem = async (itemId: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return;

    try {
      const response = await fetch(`${baseUrl}api/shopping-list-items/${itemId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "user-email": user?.email || "",
        },
      });

      if (response.ok) {
        toast.success("Item deleted successfully");
        fetchShoppingLists(userId || "");
      } else {
        throw new Error("Failed to delete item");
      }
    } catch (error) {
      console.error("Error deleting item:", error);
      toast.error("Failed to delete item");
    }
  };

  const toggleItemChecked = (item: ShoppingListItem) => {
    updateShoppingListItem(item.id, { isChecked: !item.isChecked });
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
    <div className="min-h-screen flex flex-col bg-yellow-50">
      <div className="fixed top-0 left-0 right-0 z-50">
        <Navigation />
      </div>
      
      <main className="flex-1 pt-20 pb-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 bg-yellow-100 border border-yellow-200 rounded-xl px-4 py-3 shadow-inner">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                My Shopping Lists
              </h1>
              <button
                onClick={() => setShowCreateModal(true)}
                className="w-full sm:w-auto px-5 py-2 bg-yellow-500 hover:bg-yellow-700 hover:scale-105 text-white rounded-md transition flex items-center gap-2"
              >
                <HiPlus size={20} />
                Create New List
              </button>
            </div>

            {/* Loading State */}
            {isLoading ? (
              <div className="flex items-center justify-center py-16">
                <Loader />
              </div>
            ) : shoppingLists.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {shoppingLists.map((list) => (
                  <div
                    key={list.id}
                    className="bg-white border border-gray-200 rounded-xl shadow-lg hover:shadow-xl transition-shadow p-6"
                  >
                    {/* List Header */}
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-lg font-semibold text-gray-900 truncate">
                        {list.title}
                      </h3>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setSelectedList(list);
                            setShowAddItemModal(true);
                          }}
                          className="p-1 text-yellow-600 hover:text-yellow-800 hover:bg-yellow-50 rounded"
                          title="Add Item"
                        >
                          <HiPlus size={16} />
                        </button>
                        <button
                          onClick={() => deleteShoppingList(list.id)}
                          className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
                          title="Delete List"
                        >
                          <HiTrash size={16} />
                        </button>
                      </div>
                    </div>

                    {/* Items */}
                    <div className="space-y-2 mb-4">
                      {list.items.length > 0 ? (
                        list.items.map((item) => (
                          <div
                            key={item.id}
                            className={`flex items-center gap-3 p-2 rounded-lg border ${
                              item.isChecked
                                ? "bg-green-50 border-green-200"
                                : "bg-gray-50 border-gray-200"
                            }`}
                          >
                            <button
                              onClick={() => toggleItemChecked(item)}
                              className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center ${
                                item.isChecked
                                  ? "bg-green-500 border-green-500 text-white"
                                  : "border-gray-300 hover:border-green-400"
                              }`}
                            >
                              {item.isChecked && <HiCheck size={12} />}
                            </button>
                            <span
                              className={`flex-1 text-sm ${
                                item.isChecked
                                  ? "line-through text-gray-500"
                                  : "text-gray-700"
                              }`}
                            >
                              {item.name}
                            </span>
                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                              Qty: {item.quantity}
                            </span>
                            <button
                              onClick={() => deleteShoppingListItem(item.id)}
                              className="text-red-500 hover:text-red-700 p-1"
                            >
                              <HiX size={14} />
                            </button>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-500 text-sm text-center py-4">
                          No items yet
                        </p>
                      )}
                    </div>

                    {/* List Footer */}
                    <div className="text-xs text-gray-500 border-t pt-2">
                      Created: {new Date(list.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="text-gray-400 mb-4">
                  <HiPlus size={48} className="mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No shopping lists yet
                </h3>
                <p className="text-gray-500 mb-4">
                  Create your first shopping list to get started
                </p>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-md transition"
                >
                  Create Your First List
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Create List Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Create New Shopping List
            </h3>
            <input
              type="text"
              value={newListTitle}
              onChange={(e) => setNewListTitle(e.target.value)}
              placeholder="Enter list title..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              onKeyPress={(e) => e.key === "Enter" && createShoppingList()}
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setNewListTitle("");
                }}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={createShoppingList}
                disabled={!newListTitle.trim()}
                className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-300 text-white rounded-md transition"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Item Modal */}
      {showAddItemModal && selectedList && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Add Item to "{selectedList.title}"
            </h3>
            <div className="space-y-4">
              <input
                type="text"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                placeholder="Item name..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                onKeyPress={(e) => e.key === "Enter" && addShoppingListItem()}
              />
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700">Quantity:</label>
                <input
                  type="number"
                  value={newItemQuantity}
                  onChange={(e) => setNewItemQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  min="1"
                  className="w-20 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => {
                  setShowAddItemModal(false);
                  setSelectedList(null);
                  setNewItemName("");
                  setNewItemQuantity(1);
                }}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={addShoppingListItem}
                disabled={!newItemName.trim()}
                className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-300 text-white rounded-md transition"
              >
                Add Item
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
} 