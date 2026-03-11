import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import type { JSX } from "react";

interface LoginRouteProps {
  children: JSX.Element;
}

const LoginRoute = ({ children }: LoginRouteProps) => {
  const token = useAuthStore((state) => state.token);

  
  if (token) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
};

export default LoginRoute;