import { useEffect, useState } from "react";
import { auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import { AuthContext } from "./AuthContext";

export const AuthProvider = ({ children }) => {
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [role, setRole] = useState("free");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    return onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          // 🔥 force refresh to get new custom claims
          await user.getIdToken(true);

          const token = await user.getIdTokenResult();
          console.log(token);
          

          setRole(token.claims.role || "free");
          setFirebaseUser(user);
        } catch (err) {
          console.error("Failed to refresh ID token:", err);
        }
      } else {
        setFirebaseUser(null);
        setRole("free");
      }

      setLoading(false);
    });
  }, []);

  return (
    <AuthContext.Provider value={{ firebaseUser, role, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
