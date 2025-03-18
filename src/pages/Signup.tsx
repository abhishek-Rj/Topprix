import React, { useState } from "react";
import { useFirebase } from "../context/firebaseProvider";

export default function Signup() {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [userDetails, setUserDetails] = useState<any>(null);
    const { signInUserWithEmailAndPassword } = useFirebase();

    const handleSignUp = async () => {
        try {
            await signInUserWithEmailAndPassword(email, password);
            setUserDetails({ email, password });
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div>
            <label>Email</label>
            <input
                className="border-2 rounded-lg border-gray-300"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <label>Password</label>
            <input
                className="border-2 rounded-lg border-gray-300"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={handleSignUp}>Sign Up</button>
            {userDetails && (
                <div>
                    <p>Email: {userDetails.email}</p>
                    <p>Password: {userDetails.password}</p>
                </div>
            )}
        </div>
    );
}
