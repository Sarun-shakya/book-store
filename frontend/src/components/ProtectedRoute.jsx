import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/authContext";

const ProtectedRoute = ({ children }) => {
    const { isLoggedIn, loading, isAdmin } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-lg font-medium">Loading...</p>
            </div>
        );
    }

    // Redirect if not logged in
    if (!isLoggedIn || isAdmin) {
        return (
            <Navigate
                to="/login"
                state={{ from: location }}
                replace
            />
        );
    }

    return children;
};

export default ProtectedRoute;