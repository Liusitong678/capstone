import { signOut } from "firebase/auth";
import { auth } from "./firebase";

export const logout = async () => {
    try {
        await signOut(auth);
    } catch (err) {
        console.error("Logout failed:", err);
    }
};
