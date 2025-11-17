import { useAuth } from "../firebase/useAuth";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const { firebaseUser, loading } = useAuth();

  // show nothing until Firebase finishes loading
  if (loading) return null;

  // not logged in → redirect
  if (!firebaseUser) return <Navigate to="/login" replace />;

  return children;
}
