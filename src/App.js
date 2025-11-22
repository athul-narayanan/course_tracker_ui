import './App.css';
import Signup from './pages/signup/Signup';
import Login from './pages/login/Login';
import CourseSearch from './pages/course-search/CourseSerach';
import { Routes, Route } from "react-router-dom";
import { Toaster } from 'react-hot-toast';
import useAuthCheck from './pages/hooks/useAuthCheck';
import RedirectIfLoggedIn from "./components/RedirectLoggedIn";
import CourseResults from "./pages/course-result/CourseResult"

function App() {
  useAuthCheck();

  return (
    <>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#fff",
            color: "#333",
            fontSize: "1.2rem",
            padding: "16px",
            borderRadius: "12px",
            boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
          },
          success: {
            iconTheme: {
              primary: "#4CAF50",
              secondary: "#fff",
            },
          },
          error: {
            style: {
              background: "#ffe6e6",
              color: "#b71c1c",
              border: "1px solid #f5c2c2",
            },
          },
        }}
      />

      <Routes>
        <Route
          path="/login"
          element={
            <RedirectIfLoggedIn>
              <Login />
            </RedirectIfLoggedIn>
          }
        />

        <Route
          path="/signup"
          element={
            <RedirectIfLoggedIn>
              <Signup />
            </RedirectIfLoggedIn>
          }
        />

        <Route path="/" element={<CourseSearch />} />
        <Route path="/courses" element={<CourseResults />} />
      </Routes>
    </>
  );
}

export default App;
