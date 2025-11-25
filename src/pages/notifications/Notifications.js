import React, { useEffect, useState } from "react";
import { Paper, Button } from "@mui/material";
import AppLayout from "../../components/Layout";
import useFetch from "../hooks/useFetch";
import toast from "react-hot-toast";
import { colors } from "../../theme/colors";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function Notifications() {
  const navigate = useNavigate();

  const { data: notifData, fetchData: loadNotifications } = useFetch("/notifications", "GET");
  const { fetchData: markRead } = useFetch("/notifications/read", "GET", false);
  const user = useSelector((state) => state.auth.user);

  const [selected, setSelected] = useState(null);

  useEffect(() => {
    if (user) {
      loadNotifications(null, { email: user.email });
    }
  }, [user]);

  const handleAcknowledge = async (id) => {
    await markRead(null, { id });
    toast.success("Notification acknowledged");
    loadNotifications(null, { email: user.email });
  };

  const notifications = notifData || [];

  
  const sorted = [...notifications].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  return (
    <AppLayout>
      <div style={{ maxWidth: 800, margin: "0 auto", paddingBottom: "3rem" }}>
        
        <h2 style={{ marginBottom: "1.5rem", fontWeight: 700, color: colors.textDark }}>
          Notifications
        </h2>

        <Button 
          variant="outlined"
          sx={{ textTransform: "none", marginBottom: "1.5rem", fontWeight: 600 }}
          onClick={() => navigate(-1)}
        >
          ← Back to Results
        </Button>

        {sorted.length === 0 && (
          <p style={{ opacity: 0.6, marginTop: "1rem" }}>No notifications available.</p>
        )}

        {sorted.map((n) => (
          <Paper
            key={n.id}
            elevation={2}
            style={{
              padding: "1rem",
              marginBottom: "1rem",
              borderRadius: 12,
              background: n.Status === "new" ? "#fff7e6" : "white",
              borderLeft: n.Status === "new" ? "4px solid #ff9800" : "4px solid transparent",
            }}
          >
            <div style={{ fontWeight: 600, fontSize: "1rem" }}>
              {n.Message.length > 80 ? n.Message.slice(0, 80) + "..." : n.Message}
            </div>

            <div style={{ fontSize: "0.85rem", opacity: 0.7, marginTop: 4 }}>
              {new Date(n.CreatedAt).toLocaleString()}
            </div>

            <div style={{ marginTop: "1rem", display: "flex", gap: "1rem" }}>
              <Button
                variant="contained"
                sx={{ textTransform: "none", fontWeight: 600 }}
                onClick={() => setSelected(n)}
              >
                View
              </Button>

              {n.Status === "new" && (
                <Button
                  variant="outlined"
                  sx={{ textTransform: "none", fontWeight: 600 }}
                  onClick={() => handleAcknowledge(n.ID)}
                >
                  Acknowledge
                </Button>
              )}
            </div>
          </Paper>
        ))}

        {selected && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "rgba(0,0,0,0.4)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 2000,
            }}
          >
            <Paper
              elevation={3}
              style={{
                padding: "1.5rem",
                borderRadius: 12,
                maxWidth: 500,
                width: "90%",
              }}
            >
              <h3 style={{ marginBottom: "0.5rem" }}>Notification</h3>
              <p style={{ whiteSpace: "pre-wrap", marginBottom: "1rem" }}>
                {selected.Message}
              </p>

              <Button
                variant="contained"
                fullWidth
                sx={{ textTransform: "none", fontWeight: 600 }}
                onClick={() => setSelected(null)}
              >
                Close
              </Button>
            </Paper>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
