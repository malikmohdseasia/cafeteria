import { Navigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import type { JSX } from "react";

interface ProtectedRouteProps {
  children: JSX.Element;
  allowedRoles?: string[];   
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const token = useAuthStore((state) => state.token);
  const role = useAuthStore((state) => state.role);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role || "")) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;