import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

interface AdminSidebarContextType {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const AdminSidebarContext = createContext<AdminSidebarContextType | undefined>(
  undefined
);

export const useAdminSidebar = () => {
  const context = useContext(AdminSidebarContext);
  if (context === undefined) {
    throw new Error(
      "useAdminSidebar must be used within an AdminSidebarProvider"
    );
  }
  return context;
};

interface AdminSidebarProviderProps {
  children: ReactNode;
}

export const AdminSidebarProvider = ({
  children,
}: AdminSidebarProviderProps) => {
  // Initialize state from localStorage or default to false
  const [isOpen, setIsOpen] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("adminSidebarOpen");
      return saved ? JSON.parse(saved) : false;
    }
    return false;
  });

  // Save to localStorage whenever isOpen changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("adminSidebarOpen", JSON.stringify(isOpen));
    }
  }, [isOpen]);

  return (
    <AdminSidebarContext.Provider value={{ isOpen, setIsOpen }}>
      {children}
    </AdminSidebarContext.Provider>
  );
};
