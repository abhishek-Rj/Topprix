/// <reference types="vite/client" />

import { initializeApp } from "firebase/app";
import React from "react";
import {
    getAuth,
    createUserWithEmailAndPassword,
    updateProfile,
    GoogleAuthProvider,
    signInWithPopup,
} from "firebase/auth";
import { createContext, useContext } from "react";
import { getFirestore, doc, setDoc } from "firebase/firestore";

type FirebaseContextType = {
    signInWithGoogle: () => Promise<any>;
    signInUserWithEmailAndPassword: (
        name: string,
        email: string,
        password: string,
        role: string
    ) => Promise<any>;
};

const firebaseConfig = {
    apiKey: import.meta.env.VITE_APP_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_APP_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_APP_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_APP_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_APP_FIREBASE_MEASUREMENT_ID,
};

const firebaseApp = initializeApp(firebaseConfig);
export const auth = getAuth(firebaseApp);
export const db = getFirestore(firebaseApp);
export const googleProvider = new GoogleAuthProvider();

const defaultContextValue: FirebaseContextType = {
    signInUserWithEmailAndPassword: async () => {
        throw new Error("Function not implemented");
    },
    signInWithGoogle: async () => {
        throw new Error("Function not implemented");
    },
};

export const FirebaseContext =
    createContext<FirebaseContextType>(defaultContextValue);

export const useFirebase = () => {
    return useContext(FirebaseContext);
};

export const FirebaseProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const signInUserWithEmailAndPassword = async (
        name: string,
        email: string,
        password: string,
        role: string
    ) => {
        try {
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );
            const user = userCredential.user;

            await updateProfile(user, {
                displayName: name,
            });

            await setDoc(doc(db, "users", user.uid), {
                name,
                email,
                role,
            });
            return user;
        } catch (error) {
            return error;
        }
    };

    const signInWithGoogle = async () => {
        try {
            const userCredential = await signInWithPopup(auth, googleProvider);
            const user = userCredential.user;
            return user;
        } catch (error) {
            return error;
        }
    };
    return (
        <FirebaseContext.Provider
            value={{ signInUserWithEmailAndPassword, signInWithGoogle }}
        >
            {children}
        </FirebaseContext.Provider>
    );
};
