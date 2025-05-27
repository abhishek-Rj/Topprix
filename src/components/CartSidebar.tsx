import { useState } from "react";
import { HiShoppingCart, HiX, HiTrash } from "react-icons/hi";
import { motion, AnimatePresence } from "framer-motion";

interface CartItem {
  id: number;
  title: string;
  store: string;
  type: "coupon" | "flyer";
  discount?: string;
  code?: string;
  description?: string;
}

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartSidebar({ isOpen, onClose }: CartSidebarProps) {
  // Mock data for cart items
  const [cartItems] = useState<CartItem[]>([
    {
      id: 1,
      title: "Summer Sale",
      store: "Fashion Store",
      type: "coupon",
      discount: "50% OFF",
      code: "SUMMER50",
    },
    {
      id: 2,
      title: "Tech Expo 2024",
      store: "Tech Store",
      type: "flyer",
      description: "Latest gadgets and deals",
    },
    {
      id: 3,
      title: "Tech Expo 2024",
      store: "Tech Store",
      type: "flyer",
      description: "Latest gadgets and deals",
    },
    {
      id: 4,
      title: "Tech Expo 2024",
      store: "Tech Store",
      type: "flyer",
      description: "Latest gadgets and deals",
    },
    {
      id: 5,
      title: "Tech Expo 2024",
      store: "Tech Store",
      type: "flyer",
      description: "Latest gadgets and deals",
    },
    {
      id: 6,
      title: "Tech Expo 2024",
      store: "Tech Store",
      type: "flyer",
      description: "Latest gadgets and deals",
    },
    {
      id: 7,
      title: "Tech Expo 2024",
      store: "Tech Store",
      type: "flyer",
      description: "Latest gadgets and deals",
    },
  ]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black z-40"
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 20 }}
            className="fixed right-0 top-0 h-full w-96 bg-white shadow-xl z-50"
          >
            <div className="h-full flex flex-col">
              {/* Header */}
              <div className="p-4 border-b flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <HiShoppingCart className="w-6 h-6 text-yellow-600" />
                  <h2 className="text-xl font-semibold">Your Cart</h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-full transition"
                >
                  <HiX className="w-6 h-6" />
                </button>
              </div>

              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto p-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="bg-gray-50 rounded-lg p-4 mb-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold">{item.title}</h3>
                        <p className="text-sm text-gray-600">{item.store}</p>
                      </div>
                      <button
                        onClick={() => {
                          /* Remove from cart logic */
                        }}
                        className="p-1 hover:text-red-500 transition-colors"
                      >
                        <HiTrash className="w-5 h-5" />
                      </button>
                    </div>
                    {item.type === "coupon" ? (
                      <div className="text-sm">
                        <span className="text-yellow-600 font-medium">
                          {item.discount}
                        </span>
                        <span className="text-gray-500 ml-2">
                          Code: {item.code}
                        </span>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-600">
                        {item.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="p-4 border-t">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-600">Total Items:</span>
                  <span className="font-semibold">{cartItems.length}</span>
                </div>
                <button
                  onClick={() => {
                    /* Checkout logic */
                  }}
                  className="w-full bg-yellow-500 text-white py-3 rounded-lg hover:bg-yellow-600 transition"
                >
                  Checkout
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
