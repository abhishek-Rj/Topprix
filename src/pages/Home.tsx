import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../context/firebaseProvider";
import { useTranslation } from "react-i18next";
import Navigation from "../components/navigation";
import Loader from "../components/loading";

export default function Home() {
    const [userExists, setUserExists] = useState<boolean | null>(null);
    const [userRole, setUserRole] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
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
                        setUserRole(userData.role);
                        // Store role but don't redirect
                    } else {
                        console.log("No user document found");
                    }
                } catch (error) {
                    console.error("Error fetching user data:", error);
                }
            } else {
                setUserExists(false);
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

            <main className="pt-20">
                <div className="container mx-auto px-4 py-12">
                    {/* Show different content based on authentication */}
                    {userExists ? (
                        <div className="text-center">
                            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                                {t("home.welcomeBack")}
                            </h1>
                            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                                {userRole === "admin"
                                    ? t("home.adminMessage")
                                    : t("home.userMessage")}
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <button
                                    onClick={() =>
                                        navigate(
                                            userRole === "admin"
                                                ? "/admin-dashboard"
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
                                    {t("home.exploreDeals")}
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
            </main>
        </div>
    );
}
