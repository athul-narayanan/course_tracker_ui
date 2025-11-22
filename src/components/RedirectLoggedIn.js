import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export default function RedirectIfLoggedIn({ children }) {
  const { token } = useSelector((state) => state.auth);

  if (token) {
    return <Navigate to="/" replace />;
  }

  return children;
}
