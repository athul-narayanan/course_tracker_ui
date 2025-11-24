import React from "react";
import NotificationsIcon from "@mui/icons-material/Notifications";
import LogoutIcon from "@mui/icons-material/Logout";
import LoginIcon from "@mui/icons-material/Login";
import Badge from "@mui/material/Badge";
import { useDispatch, useSelector } from "react-redux";
import { clearAuth } from "../../store/auth/authSlice";
import { colors } from "../../theme/colors";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { token, user } = useSelector((state) => state.auth);
  const role = user?.role;
  const isAdmin = role === "Admin";

  const notifications = useSelector((state) => state.notifications?.items || []);

  const handleLogout = () => {
    dispatch(clearAuth());
    navigate("/");
  };

  const goToNotifications = () => {
    if (!token) return navigate("/login");
    navigate("/notifications");
  };

  const goToLogin = () => navigate("/login");

  return (
    <div
      style={{
        width: "100%",
        padding: "0.6rem 1rem",
        background: "rgba(255,255,255,0.9)",
        backdropFilter: "blur(10px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        rowGap: "0.4rem",
        boxSizing: "border-box",
        borderBottom: "1px solid rgba(0,0,0,0.08)",
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 2000,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.6rem",
          cursor: "pointer",
          flexShrink: 0,
        }}
        onClick={() => navigate("/")}
      >
        <img
          src="/course_tracker.png"
          alt="Logo"
          style={{ width: 38, height: 38, borderRadius: 8 }}
        />

        <h3
          style={{
            margin: 0,
            fontSize: "1.1rem",
            fontWeight: 700,
            whiteSpace: "nowrap",
            color: colors.textDark,
          }}
        >
          Course Tracker
        </h3>
      </div>

      {isAdmin && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1.2rem",
            fontSize: "0.95rem",
            fontWeight: 600,
            flexWrap: "wrap",
            maxWidth: "100%",
          }}
        >
          <span
            onClick={() => navigate("/")}
            style={{
              cursor: "pointer",
              color: colors.primary,
              whiteSpace: "nowrap",
            }}
          >
            Search Courses
          </span>

          <span
            onClick={() => navigate("/manage-courses")}
            style={{
              cursor: "pointer",
              color: colors.primary,
              whiteSpace: "nowrap",
            }}
          >
            Manage Courses
          </span>
        </div>
      )}

      <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexShrink: 0 }}>
        {token ? (
          <>
            <Badge badgeContent={notifications.length} color="error">
              <NotificationsIcon
                onClick={goToNotifications}
                style={{ fontSize: 27, cursor: "pointer" }}
              />
            </Badge>

            <div
              onClick={handleLogout}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.4rem",
                padding: "0.35rem 0.7rem",
                background: colors.secondary,
                color: "white",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "0.85rem",
                fontWeight: 600,
              }}
            >
              <LogoutIcon style={{ fontSize: 18 }} />
              Logout
            </div>
          </>
        ) : (
          <div
            onClick={goToLogin}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.4rem",
              padding: "0.35rem 0.9rem",
              borderRadius: "8px",
              border: `1.5px solid ${colors.primary}`,
              color: colors.primary,
              cursor: "pointer",
              fontSize: "0.9rem",
              fontWeight: 600,
            }}
          >
            <LoginIcon style={{ fontSize: 18 }} />
            Login
          </div>
        )}
      </div>
    </div>
  );
}
