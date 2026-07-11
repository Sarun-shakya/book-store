import { createContext, useContext, useEffect, useState } from "react";
import API from "../api/axios";
import { toast } from "react-toastify";


const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchProfile = async () => {
        try {
            const res = await API.get("/users/profile", {
                withCredentials: true,
            });

            setUser(res.data.data);
        } catch (err) {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    const login = async (email, password, navigate, isAdminLogin = false) => {
        try {
            const res = await API.post(
                "/users/login",
                { email, password },
                { withCredentials: true }
            );

            const loggedUser = res.data.data;

            if (isAdminLogin && loggedUser.role !== "admin") {
                toast.error("Not authorized as admin");
                return;
            }

            setUser(loggedUser);
            toast.success(res.data.message);

            if (loggedUser.role === "admin") {
                navigate("/admin/dashboard");
            } else {
                navigate("/");
            }

        } catch (err) {
            toast.error(err.response?.data?.message || "Login failed");
        }
    };

    const signup = async (formData, navigate) => {
        try {
            const res = await API.post("/users/signup", formData, {
                headers: { "Content-Type": "multipart/form-data" },
                withCredentials: true,
            });

            toast.success(res.data.message);
            navigate("/login");
        } catch (err) {
            toast.error(err.response?.data?.message || "Signup failed");
        }
    };

    const logout = async () => {
        const confirmed = window.confirm(
      `Are you sure you want to logout`
    );
    if(!confirmed) return;
        try {
            await API.post("/users/logout", {}, { withCredentials: true });
            setUser(null);
            toast.success("Logged out successfully");
        } catch (err) {
            toast.error("Logout failed");
        }
    };

    const updateProfile = async (data) => {
        try {
            const res = await API.put("/users/update-profile", data, {
                headers: { "Content-Type": "multipart/form-data" },
                withCredentials: true,
            });

            setUser(res.data.data);
            toast.success(res.data.message);
        } catch (err) {
            toast.error(err.response?.data?.message || "Update failed");
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                setUser,
                loading,
                login,
                signup,
                logout,
                updateProfile,
                isLoggedIn: !!user,
                isAdmin: user?.role === "admin",
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);