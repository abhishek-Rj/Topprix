import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { updateDoc } from "firebase/firestore";
import { auth, db } from "../context/firebaseProvider";
import { useTranslation } from "react-i18next";
import Navigation from "../components/navigation";
import Loader from "../components/loading";

export default function Home() {
    const [userExists, setUserExists] = useState<boolean | null>(null);
    const [userRole, setUserRole] = useState<string | null>(null);
    const [locationInput, setLocationInput] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(true);
    const [showLocationModal, setShowLocationModal] = useState(false);
    const [userName, setUserName] = useState<string | null>(null);
    const { t } = useTranslation();
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setUserExists(true);

                try {
                    const userDoc = await getDoc(doc(db, "users", user.uid));

                    if (userDoc.exists()) {
                        const userData = userDoc.data();
                        setUserName(userData.name);
                        if (!userData.location) {
                            setShowLocationModal(true);
                        }
                        setUserRole(userData.role);
                        console.log(userData);
                    } else {
                        console.log("No user document found");
                    }
                } catch (error) {
                    console.error("Error fetching user data:", error);
                }
            } else {
                setUserExists(false);
                navigate("/login");
            }

            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen w-full bg-yellow-50">
                <Loader />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-yellow-50">
            <Navigation />

            {showLocationModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
                    <div className="bg-white p-6 rounded-xl shadow-lg max-w-md w-full mx-4">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">
                            {t("home.askLocationTitle")}
                        </h2>
                        <p className="text-sm text-gray-600 mb-4">
                            {t("home.askLocationMessage")}
                        </p>
                        <input
                            type="text"
                            placeholder={t("home.enterLocation")}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                            onChange={(e) => setLocationInput(e.target.value)}
                        />
                        <div className="flex justify-end space-x-2">
                            <button
                                onClick={() => setShowLocationModal(false)}
                                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 text-sm"
                            >
                                {t("cancel")}
                            </button>
                            <button
                                onClick={async () => {
                                    try {
                                        if (locationInput && auth.currentUser) {
                                            const updateUserResponse =
                                                await fetch(
                                                    `${
                                                        import.meta.env
                                                            .VITE_APP_BASE_URL
                                                    }user/update/${
                                                        auth.currentUser.email
                                                    }`,
                                                    {
                                                        method: "POST",
                                                        headers: {
                                                            "Content-Type":
                                                                "application/json",
                                                        },
                                                        body: JSON.stringify({
                                                            location:
                                                                locationInput,
                                                        }),
                                                    }
                                                );
                                            const data =
                                                await updateUserResponse.json();
                                            if (!data.user) {
                                                throw new Error(
                                                    "User update during db save failed"
                                                );
                                            }
                                            await updateDoc(
                                                doc(
                                                    db,
                                                    "users",
                                                    auth.currentUser.uid
                                                ),
                                                {
                                                    location: locationInput,
                                                }
                                            );
                                            setShowLocationModal(false);
                                        }
                                    } catch (error) {
                                        console.error(
                                            "Error updating user location:",
                                            error
                                        );
                                        setShowLocationModal(true);
                                    }
                                }}
                                className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 text-sm"
                            >
                                {t("confirm")}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <main className="pt-10">
                <div className="flex items-center justify-center min-h-[calc(100vh-5rem)]">
                    <div className="container mx-auto px-4 py-12">
                        {userExists ? (
                            <div className="text-center">
                                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                                    {t("home.welcomeBack")}
                                </h1>
                                <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                                    {userRole === "ADMIN"
                                        ? t("home.adminMessage")
                                        : userRole === "RETAILER"
                                        ? t("home.retailerMessage")
                                        : t("home.userMessage")}
                                    ! {userName}
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                    <button
                                        onClick={() =>
                                            navigate(
                                                userRole === "ADMIN"
                                                    ? "/admin-dashboard"
                                                    : userRole === "RETAILER"
                                                    ? "/retailer-dashboard"
                                                    : "/user-dashboard"
                                            )
                                        }
                                        className="px-6 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
                                    >
                                        {t("home.goDashboard")}
                                    </button>
                                    <button
                                        onClick={() => navigate("/deals")}
                                        className="px-6 py-3 bg-white text-yellow-600 border border-yellow-600 rounded-lg hover:bg-yellow-50 transition-colors"
                                    >
                                        {userRole === "ADMIN"
                                            ? t("home.manageDeals")
                                            : userRole === "RETAILER"
                                            ? t("home.createDeals")
                                            : t("home.exploreDeals")}
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <section className="text-center">
                                <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                                    {t("home.heading")}
                                </h1>
                                <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                                    {t("home.subheading")}
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                    <button
                                        onClick={() => navigate("/signup")}
                                        className="px-6 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
                                    >
                                        {t("home.getStarted")}
                                    </button>
                                    <button
                                        onClick={() => navigate("/deals")}
                                        className="px-6 py-3 bg-white text-yellow-600 border border-yellow-600 rounded-lg hover:bg-yellow-50 transition-colors"
                                    >
                                        {t("home.exploreDeals")}
                                    </button>
                                </div>
                            </section>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
