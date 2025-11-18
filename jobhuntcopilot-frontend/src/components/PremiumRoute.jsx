import { useAuth } from "../firebase/useAuth";
import { Navigate } from "react-router-dom";

export default function PremiumRoute({ children }) {
  const { firebaseUser, role, loading } = useAuth();

  if (loading) return null;

  if (!firebaseUser) return <Navigate to="/login" replace />;

  // Allow premium or admin
  if (role === "premium" || role === "admin") return children;

  // Free users go to upgrade page
  return <Navigate to="/upgrade" replace />;
}
