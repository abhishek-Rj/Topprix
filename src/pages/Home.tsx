import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../context/firebaseProvider";
import { useEffect, useState } from "react";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { db } from "../context/firebaseProvider";
import { useTranslation } from "react-i18next";

export default function Home() {
    const [userRole, setUserRole] = useState<string | null>(null);
    const { t } = useTranslation();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                console.log("User is signed in", user);

                try {
                    const userDocRef = doc(db, "users", user.uid);
                    const userDoc = await getDoc(userDocRef);

                    if (userDoc.exists()) {
                        const userData = userDoc.data();
                        const role = userData.role;
                        setUserRole(role);
                        console.log("User role:", role);
                    } else {
                        console.log("No user document found");
                    }
                } catch (error) {
                    console.error("Error fetching user role:", error);
                }
            } else {
                console.log("User is signed out");
                setUserRole(null);
            }
        });

        return () => unsubscribe();
    }, [db]);
    return (
        <>
            <div>
                <h1>{t("shortDescription")}</h1>
            </div>
        </>
    );
}
