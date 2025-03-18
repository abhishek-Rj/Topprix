/// <reference types="vite/client" />

import { initializeApp } from "firebase/app";
import React from "react";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { createContext, useContext } from "react";

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
const auth = getAuth(firebaseApp);

export const FirebaseContext = createContext({});

export const useFirebase = () => {
    return useContext(FirebaseContext);
};

export const FirebaseProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const signInUserWithEmailAndPassword = async (
        email: string,
        password: string
    ) => {
        try {
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );
            return userCredential.user;
        } catch (error) {
            return error;
        }
    };
    return (
        <FirebaseContext.Provider value={{ signInUserWithEmailAndPassword }}>
            {children}
        </FirebaseContext.Provider>
    );
};
