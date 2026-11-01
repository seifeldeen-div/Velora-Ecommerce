import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import LoadingState from "./LoadingState.jsx";

export default function ProtectedRoute({ admin = false, children }) {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) return <LoadingState label="Checking your account" />;
  if (!user) return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  if (admin && !user.isAdmin) return <Navigate to="/" replace />;
  return children;
}
