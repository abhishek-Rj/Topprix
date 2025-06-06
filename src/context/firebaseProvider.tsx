/// <reference types="vite/client" />

import { initializeApp } from "firebase/app";
import React from "react";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  deleteUser,
  EmailAuthProvider,
  reauthenticateWithCredential,
  reauthenticateWithPopup,
  FacebookAuthProvider,
} from "firebase/auth";
import { createContext, useContext } from "react";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { getStorage } from "firebase/storage";

type FirebaseContextType = {
  signInWithGoogle: () => Promise<any>;
  logInWithEmailandPassword: (email: string, password: string) => Promise<any>;
  signUpUserWithEmailAndPassword: (
    name: string,
    email: string,
    phone: string,
    password: string,
    role: string
  ) => Promise<any>;
  signInWithFacebook: () => Promise<any>;
  deleteAccountwithCredentials: (password: string) => Promise<any>;
  deleteAccountwithProviders: (provider: string) => Promise<any>;
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
export const storage = getStorage(firebaseApp);
export const googleProvider = new GoogleAuthProvider();
export const facebookProvider = new FacebookAuthProvider();

const defaultContextValue: FirebaseContextType = {
  logInWithEmailandPassword: async () => {
    throw new Error("Function not implemented");
  },
  signUpUserWithEmailAndPassword: async () => {
    throw new Error("Function not implemented");
  },
  signInWithGoogle: async () => {
    throw new Error("Function not implemented");
  },
  signInWithFacebook: async () => {
    throw new Error("Function not implemented");
  },
  deleteAccountwithCredentials: async () => {
    throw new Error("Function not implemented");
  },
  deleteAccountwithProviders: async () => {
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
  const signUpUserWithEmailAndPassword = async (
    name: string,
    email: string,
    phone: string,
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
        phone,
        role,
      });
      return userCredential;
    } catch (error) {
      console.error("Error signing up: ", error);
      throw error;
    }
  };

  const logInWithEmailandPassword = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
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

  const signInWithFacebook = async () => {
    try {
      const userCredential = await signInWithPopup(auth, facebookProvider);
      const user = userCredential.user;
      return user;
    } catch (error) {
      return error;
    }
  };

  const deleteAccountwithCredentials = async (password: string) => {
    const user = auth.currentUser;
    const credential = EmailAuthProvider.credential(user?.email!, password);
    if (user) {
      try {
        await reauthenticateWithCredential(user, credential);
        await deleteUser(user);
        console.log("User deleted successfully");
      } catch (error) {
        console.error("Error deleting user: ", error);
      }
    } else {
      console.log("No user is currently signed in.");
    }
  };

  const deleteAccountwithProviders = async (provider: string) => {
    const user = auth.currentUser;
    if (user) {
      try {
        if (provider === "google") {
          await reauthenticateWithPopup(user, googleProvider);
        } else if (provider === "facebook") {
          await reauthenticateWithPopup(user, facebookProvider);
        }
        await deleteUser(user);
        console.log("User deleted successfully");
      } catch (error) {
        console.error("Error deleting user: ", error);
      }
    } else {
      console.log("No user is currently signed in.");
    }
  };
  return (
    <FirebaseContext.Provider
      value={{
        signUpUserWithEmailAndPassword,
        signInWithGoogle,
        logInWithEmailandPassword,
        deleteAccountwithCredentials,
        deleteAccountwithProviders,
        signInWithFacebook,
      }}
    >
      {children}
    </FirebaseContext.Provider>
  );
};
