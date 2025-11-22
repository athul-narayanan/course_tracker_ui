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
  const { token } = useSelector((state) => state.auth);
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
        boxSizing: "border-box",
        borderBottom: "1px solid rgba(0,0,0,0.08)",
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 2000
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.6rem",
          cursor: "pointer"
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
            overflow: "hidden",
            textOverflow: "ellipsis",
            color: colors.textDark
          }}
        >
          Course Tracker
        </h3>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
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
                fontWeight: 600
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
              fontWeight: 600
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
