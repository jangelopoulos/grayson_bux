import { Navigate, useLocation } from "react-router-dom";
import { useApp } from "../context/AppContext";

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { auth } = useApp();
  const location = useLocation();
  if (!auth) return <Navigate to="/login" replace />;
  if (location.pathname !== "/quiz" && !sessionStorage.getItem("bucks_quiz_done")) {
    return <Navigate to="/quiz" replace />;
  }
  if (adminOnly && auth.role !== "admin") return <Navigate to="/itinerary" replace />;
  return children;
}
