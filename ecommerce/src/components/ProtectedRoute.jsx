import { Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";

import { AuthContext } from "../context/AuthContext";

function ProtectedRoute({ adminOnly = false }) {
  const {
    user,
    loading,
  } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  // Not logged in
  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  // Admin-only route
  if (
    adminOnly &&
    user.role !== "admin"
  ) {
    return (
      <Navigate
        to="/"
        replace
      />
    );
  }

  return <Outlet />;
}

export default ProtectedRoute;