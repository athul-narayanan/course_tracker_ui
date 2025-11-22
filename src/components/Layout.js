import React from "react";
import Header from "./header/Header";

const HEADER_HEIGHT = 72;

export default function AppLayout({ children }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5f6fa",
        overflowX: "hidden",
      }}
    >
      <Header />
      <div
        style={{
          paddingTop: HEADER_HEIGHT,
          paddingInline: "1rem",
          boxSizing: "border-box",
        }}
      >
        {children}
      </div>
    </div>
  );
}
