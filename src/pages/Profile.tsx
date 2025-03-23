import { useEffect, useState } from "react";
import { getDoc, doc, updateDoc } from "firebase/firestore";
import { db, auth } from "../context/firebaseProvider";
import Navigation from "../components/navigation";
import Loader from "../components/loading";
import { useTranslation } from "react-i18next";
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
    const [user, setUser] = useState<any>(null);
    const [loader, setLoader] = useState<boolean>(true);
    const [editing, setEditing] = useState<boolean>(false);
    const [editedName, setEditedName] = useState<string>("");
    const [isSaving, setIsSaving] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [accountCreatedDate, setAccountCreatedDate] = useState<Date | null>(
        null
    );

    useEffect(() => {
        const currentUser = auth.currentUser;
        if (!currentUser) {
            navigate("/login");
            return;
        }

        const fetchUser = async () => {
            try {
                const userDoc = await getDoc(doc(db, "users", currentUser.uid));
                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    setUser(userData);
                    setEditedName(userData.name || "");

                    // If there's a createdAt field, convert it to a Date
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
        };

        fetchUser();
    }, [navigate]);

    const handleSave = async () => {
        if (!auth.currentUser) return;

        setIsSaving(true);
        setError(null);

        try {
            await updateDoc(doc(db, "users", auth.currentUser.uid), {
                name: editedName,
            });

            setUser({
                ...user,
                name: editedName,
            });

            setEditing(false);
        } catch (error: any) {
            console.error("Error updating profile:", error);
            setError(error.message || "Failed to update profile");
        } finally {
            setIsSaving(false);
        }
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
                                {user?.name?.charAt(0) ||
                                    user?.email?.charAt(0) ||
                                    "?"}
                            </span>
                        </div>
                        <div className="flex-1 text-center sm:text-left">
                            <h1 className="text-3xl font-bold">
                                {user?.name || "User"}
                            </h1>
                            <p className="mt-1 text-yellow-100">
                                {user?.email}
                            </p>
                            <div className="mt-3">
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-800 text-white">
                                    <FiTag className="mr-1" />
                                    {user?.role === "admin"
                                        ? "Business Owner"
                                        : "Customer"}
                                </span>
                                {accountCreatedDate && (
                                    <span className="ml-2 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-800 text-white">
                                        <FiClock className="mr-1" />
                                        {t("profile.memberSince")}:{" "}
                                        {formatDate(accountCreatedDate)}
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
                                    <p className="text-sm text-red-700">
                                        {error}
                                    </p>
                                </div>
                                <button
                                    onClick={() => setError(null)}
                                    className="text-red-500"
                                >
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
                                            onChange={(e) =>
                                                setEditedName(e.target.value)
                                            }
                                            className="focus:ring-yellow-500 focus:border-yellow-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2 px-3 border"
                                        />
                                    </div>
                                ) : (
                                    <div className="flex items-center">
                                        <FiUser className="text-gray-400 mr-2" />
                                        <span className="text-gray-800">
                                            {user?.name || "—"}
                                        </span>
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    {t("profile.email")}
                                </label>
                                <div className="flex items-center">
                                    <FiMail className="text-gray-400 mr-2" />
                                    <span className="text-gray-800">
                                        {user?.email}
                                    </span>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    {t("profile.role")}
                                </label>
                                <div className="flex items-center">
                                    <FiShield className="text-gray-400 mr-2" />
                                    <span className="text-gray-800">
                                        {user?.role === "admin"
                                            ? t("profile.businessOwner")
                                            : t("profile.customer")}
                                    </span>
                                </div>
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
                                    {isSaving
                                        ? t("profile.saving")
                                        : t("profile.saveChanges")}
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Account Actions */}
                    <div className="border-t border-gray-200 p-6 sm:p-10">
                        <h2 className="text-xl font-semibold text-gray-800 mb-6">
                            {t("profile.accountActions")}
                        </h2>

                        <div className="space-y-4">
                            <button
                                onClick={handleLogout}
                                className="flex items-center text-red-600 hover:text-red-800 transition-colors duration-200"
                            >
                                <FiLogOut className="mr-2" />
                                {t("profile.logout")}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
