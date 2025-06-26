import { auth } from "@/context/firebaseProvider";

export default async function userLogout() {
    await auth.signOut();
    await new Promise((resolve) => setTimeout(resolve, 100));
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');
}