import { useAuth } from "../contexts/AuthContext";
import { Navigate } from "react-router-dom";

export const ProtectedRoute = ({ children, allowedRoles }) => {
  const { currentUser, userData } = useAuth();

  if (!currentUser) return <Navigate to="/login" />;

  if (allowedRoles && !allowedRoles.includes(userData?.role)) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center">
        <h1 className="text-3xl font-bold text-red-600">⛔ Access Denied</h1>
        <p className="mt-2 text-lg text-gray-700">
          This page is restricted to <span className="font-semibold">{allowedRoles.join(", ")}</span> only.
        </p>
        <a
          href="/"
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Go Back Home
        </a>
      </div>
    );
  }

  return children;
};
