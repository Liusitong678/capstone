import { useEffect, useState } from "react";
import { auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import { AuthContext } from "./AuthContext";

// Utility: fetch with token
async function apiGet(url, token) {
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error(`GET ${url} failed`);
  return res.json();
}

export const AuthProvider = ({ children }) => {
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [role, setRole] = useState("free");
  const [profile, setProfile] = useState(null); // MongoDB profile
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    return onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          // Always refresh ID token → gets fresh custom claims
          await user.getIdToken(true);

          const token = await user.getIdTokenResult();
          const userRole = token.claims.role || "free";
          setRole(userRole);
          setFirebaseUser(user);

          // ------- Fetch MongoDB Profile --------
          try {
            const userProfile = await apiGet("/api/users/me", token.token);
            setProfile(userProfile.user);
          } catch (profileErr) {
            console.warn("Profile not found, probably new user:" , profileErr);
            setProfile(null);
          }

        } catch (err) {
          console.error("Failed to refresh Firebase token:", err);
        }

      } else {
        setFirebaseUser(null);
        setRole("free");
        setProfile(null);
      }

      setLoading(false);
    });
  }, []);

  return (
    <AuthContext.Provider value={{ firebaseUser, role, profile, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
