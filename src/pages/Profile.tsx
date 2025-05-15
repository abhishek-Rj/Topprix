import { useEffect, useState } from "react";
import { getDoc, doc, updateDoc } from "firebase/firestore";
import { db, auth } from "../context/firebaseProvider";
import Navigation from "../components/navigation";
import Loader from "../components/loading";
import { useTranslation } from "react-i18next";
import { TiDelete } from "react-icons/ti";
import { useFirebase } from "../context/firebaseProvider";
import { IoLocationOutline } from "react-icons/io5";
import {
  FiUser,
  FiMail,
  FiTag,
  FiEdit,
  FiSave,
  FiX,
  FiLogOut,
  FiClock,
  FiShield,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { deleteAccountwithCredentials, deleteAccountwithProviders } =
    useFirebase();
  const [user, setUser] = useState<any>(null);
  const [password, setPassword] = useState<string>("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);
  const [loader, setLoader] = useState<boolean>(true);
  const [editing, setEditing] = useState<boolean>(false);
  const [editedName, setEditedName] = useState<string>("");
  const [editedLocation, setEditedLocation] = useState<string>("");
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [accountCreatedDate, setAccountCreatedDate] = useState<Date | null>(
    null
  );

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      if (!currentUser) {
        navigate("/login");
        return;
      }

      try {
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUser(userData);
          setEditedLocation(userData.location || "");
          setEditedName(userData.name || "");

          if (userData.createdAt) {
            const createdAt = userData.createdAt.toDate
              ? userData.createdAt.toDate()
              : new Date(userData.createdAt);
            setAccountCreatedDate(createdAt);
          }
        } else {
          console.log("No user document found");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoader(false);
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleOnClickDelete = async () => {
    const currentUser = auth.currentUser;
    if (!currentUser) return;

    try {
      const userDelete = await fetch(
        `${import.meta.env.VITE_APP_BASE_URL}user/delete/${currentUser.email}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      let userDeleteFirebase: any = null;
      if (currentUser.providerData[0].providerId === "password") {
        userDeleteFirebase = await deleteAccountwithCredentials(password);
      } else if (currentUser.providerData[0].providerId === "google.com") {
        userDeleteFirebase = await deleteAccountwithProviders("google");
      } else {
        userDeleteFirebase = await deleteAccountwithProviders("facebook");
      }

      if (!userDelete.ok || !userDeleteFirebase) {
        throw new Error("Failed to delete user account");
      }
      navigate("/signup");
    } catch (error) {
      console.error("Error deleting user account:", error);
    }
  };
  const handleSave = async () => {
    const currentUser = auth.currentUser;
    if (!currentUser) return;

    setIsSaving(true);
    setError(null);

    try {
      const updateUser = await fetch(
        `${import.meta.env.VITE_APP_BASE_URL}user/update/${currentUser?.email}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: editedName,
            location: editedLocation,
          }),
        }
      );

      const data = await updateUser.json();
      if (!data.user) {
        throw new Error("Failed to update user data");
      }
      await updateDoc(doc(db, "users", currentUser.uid), {
        name: editedName,
        location: editedLocation,
      });
    } catch (error: any) {
      console.error("Error updating profile:", error);
      setError(error.message || "Failed to update profile");
    } finally {
      setIsSaving(false);
    }
    setEditing(false);
    window.location.reload();
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate("/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };

  if (loader) {
    return (
      <div className="min-h-screen w-full bg-yellow-50">
        <Navigation />
        <Loader />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-yellow-50">
      <Navigation />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-yellow-600 to-amber-500 rounded-t-xl py-8 px-6 sm:px-10 text-white shadow-md">
          <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg">
              <span className="text-yellow-600 text-4xl font-bold">
                {user?.name?.charAt(0) || user?.email?.charAt(0) || "?"}
              </span>
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-3xl font-bold">{user?.name || "User"}</h1>
              <p className="mt-1 text-yellow-100">{user?.email}</p>
              <div className="mt-3">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-800 text-white">
                  <FiTag className="mr-1" />
                  {user?.role === "ADMIN"
                    ? "Admin"
                    : user?.role === "RETAILER"
                    ? "Retailer"
                    : "Customer"}
                </span>
                {accountCreatedDate && (
                  <span className="ml-2 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-800 text-white">
                    <FiClock className="mr-1" />
                    {t("profile.memberSince")}: {formatDate(accountCreatedDate)}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Profile Content */}
        <div className="bg-white rounded-b-xl shadow-md">
          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
              <div className="flex">
                <div className="flex-1">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
                <button onClick={() => setError(null)} className="text-red-500">
                  <FiX />
                </button>
              </div>
            </div>
          )}

          <div className="p-6 sm:p-10">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">
                {t("profile.personalInfo")}
              </h2>
              <button
                onClick={() => setEditing(!editing)}
                className={`flex items-center text-sm font-medium ${
                  editing ? "text-red-500" : "text-yellow-600"
                }`}
              >
                {editing ? (
                  <>
                    <FiX className="mr-1" />
                    {t("profile.cancel")}
                  </>
                ) : (
                  <>
                    <FiEdit className="mr-1" />
                    {t("profile.edit")}
                  </>
                )}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-10">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("profile.name")}
                </label>
                {editing ? (
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiUser className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={editedName}
                      onChange={(e) => setEditedName(e.target.value)}
                      className="focus:ring-yellow-500 focus:border-yellow-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2 px-3 border"
                    />
                  </div>
                ) : (
                  <div className="flex items-center">
                    <FiUser className="text-gray-400 mr-2" />
                    <span className="text-gray-800">{user?.name || "—"}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("profile.email")}
                </label>
                <div className="flex items-center">
                  <FiMail className="text-gray-400 mr-2" />
                  <span className="text-gray-800">{user?.email}</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("profile.role")}
                </label>
                <div className="flex items-center">
                  <FiShield className="text-gray-400 mr-2" />
                  <span className="text-gray-800">
                    <span className="text-gray-800">
                      {user?.role === "ADMIN"
                        ? t("admin")
                        : user?.role === "RETAILER"
                        ? t("retailer")
                        : t("customer")}
                    </span>
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("profile.location")}
                </label>
                {editing ? (
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <IoLocationOutline className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={editedLocation}
                      onChange={(e) => setEditedLocation(e.target.value)}
                      className="focus:ring-yellow-500 focus:border-yellow-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2 px-3 border"
                    />
                  </div>
                ) : (
                  <div className="flex items-center">
                    <IoLocationOutline className="text-gray-400 mr-2" />
                    <span className="text-gray-800">
                      {user?.location || "—"}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {editing && (
              <div className="mt-6 flex justify-end">
                <button
                  onClick={handleSave}
                  disabled={isSaving || !editedName.trim()}
                  className={`flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                    isSaving || !editedName.trim()
                      ? "bg-yellow-300"
                      : "bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                  }`}
                >
                  <FiSave className="mr-2" />
                  {isSaving ? t("profile.saving") : t("profile.saveChanges")}
                </button>
              </div>
            )}
          </div>

          {/* Account Actions */}
          <div className="border-t space-y-4 border-gray-200 p-6 sm:p-10">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">
              {t("profile.accountActions")}
            </h2>

            <div className="space-y-4">
              <button
                onClick={handleLogout}
                className="flex items-center bg-slate-100 rounded-lg p-2 text-yellow-600 hover:text-yellow-800 hover:scale-105 transition duration-200"
              >
                <FiLogOut className="mr-2" />
                {t("logout")}
              </button>
            </div>
            <div className="space-y-4">
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="flex items-center hover:scale-105 bg-gray-100 rounded-lg p-2 text-red-600 hover:text-red-800 transition duration-200"
              >
                <TiDelete className="mr-2" />
                {t("profile.deleteAccount")}
              </button>

              {showDeleteConfirm && (
                <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/30 backdrop-blur-sm">
                  <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4 shadow-xl">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">
                      {t("profile.confirmDeleteTitle") ||
                        "Confirm Account Deletion"}
                    </h3>
                    <p className="text-sm text-gray-700 mb-4">
                      {t("profile.confirmDeleteText") ||
                        "Please enter your password to confirm account deletion. This action cannot be undone."}
                    </p>
                    <input
                      type="password"
                      placeholder={t("password") || "Enter your password"}
                      className="w-full px-3 py-2 mb-4 border rounded-md focus:outline-none focus:ring focus:ring-red-300"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <div className="flex justify-end gap-3">
                      <button
                        onClick={() => setShowDeleteConfirm(false)}
                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                      >
                        {t("cancel") || "Cancel"}
                      </button>
                      <button
                        onClick={handleOnClickDelete}
                        disabled={!password}
                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
                      >
                        {t("profile.confirmDeleteButton") || "Delete"}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
