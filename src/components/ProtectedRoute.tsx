import React from "react";
import { Redirect, Route, RouteProps } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

/**
 * Envuelve una <Route> de react-router-dom v5 y redirige a /login si no
 * hay sesión activa. Se usa igual que <Route> pero exige estar logueado.
 */
export default function ProtectedRoute({ children, ...rest }: RouteProps) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  return (
    <Route
      {...rest}
      render={() => (isAuthenticated ? (children as React.ReactNode) : <Redirect to="/login" />)}
    />
  );
}
