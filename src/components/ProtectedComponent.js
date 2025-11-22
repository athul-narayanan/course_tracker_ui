import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import AppLayout from "./AppLayout";

export default function ProtectedLayout({ children }) {
  const { token } = useSelector((state) => state.auth);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <AppLayout>{children}</AppLayout>;
}
