import React, { useMemo, useState, useEffect } from "react";
import { TextField, MenuItem, Button } from "@mui/material";
import { useLocation, Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import AppLayout from "../../components/Layout";
import { colors } from "../../theme/colors";

const HEADER_HEIGHT = 64;
const FILTER_HEIGHT = 120;

const universities = [
  { id: "u1", name: "Algoma University" },
  { id: "u2", name: "University of Toronto" },
  { id: "u3", name: "University of Waterloo" },
];

const fields = [
  { id: "f1", name: "Computer Science & IT" },
  { id: "f2", name: "Business & Management" },
  { id: "f3", name: "Life Sciences" },
  { id: "f4", name: "Psychology & Social Science" },
];

const specializations = [
  { id: "s1", fieldId: "f1", name: "Software Engineering" },
  { id: "s2", fieldId: "f1", name: "Data Science" },
  { id: "s3", fieldId: "f2", name: "MBA" },
  { id: "s4", fieldId: "f2", name: "Finance" },
  { id: "s5", fieldId: "f3", name: "Biology" },
  { id: "s6", fieldId: "f4", name: "Clinical Psychology" },
];

const allCourses = [
  {
    id: "c1",
    name: "BSc Computer Science",
    universityId: "u1",
    fieldId: "f1",
    specializationId: "s1",
    level: "Bachelors",
    duration: "3 Years",
  },
  {
    id: "c2",
    name: "MBA Business Management",
    universityId: "u2",
    fieldId: "f2",
    specializationId: "s3",
    level: "Masters",
    duration: "2 Years",
  },
  {
    id: "c3",
    name: "MSc Data Science",
    universityId: "u3",
    fieldId: "f1",
    specializationId: "s2",
    level: "Masters",
    duration: "2 Years",
  },
  {
    id: "c4",
    name: "BSc Biology",
    universityId: "u1",
    fieldId: "f3",
    specializationId: "s5",
    level: "Bachelors",
    duration: "3 Years",
  },
  {
    id: "c5",
    name: "BA Clinical Psychology",
    universityId: "u1",
    fieldId: "f4",
    specializationId: "s6",
    level: "Bachelors",
    duration: "3 Years",
  },
];

const menuProps = {
  disablePortal: false,
  disableScrollLock: true,
  container: () => document.body,
  PaperProps: {
    elevation: 6,
    style: { zIndex: 9999 },
  },
};

export default function CourseResults() {
  const location = useLocation();

  const initialFilters = location.state?.filters || {
    universityId: "",
    fieldId: "",
    specializationId: "",
    level: "",
    duration: "",
  };

  const subscribeRequested = location.state?.subscribe || false;

  const [filters, setFilters] = useState(initialFilters);
  const [results, setResults] = useState([]);

  const visibleSpecializations = filters.fieldId
    ? specializations.filter((s) => s.fieldId === filters.fieldId)
    : specializations;

  const applyFilter = useMemo(
    () => () => {
      let f = allCourses;
      if (filters.universityId)
        f = f.filter((c) => c.universityId === filters.universityId);
      if (filters.fieldId) f = f.filter((c) => c.fieldId === filters.fieldId);
      if (filters.specializationId)
        f = f.filter((c) => c.specializationId === filters.specializationId);
      if (filters.level) f = f.filter((c) => c.level === filters.level);
      if (filters.duration)
        f = f.filter((c) => c.duration === filters.duration);
      setResults(f);
    },
    [filters]
  );

  useEffect(() => {
    applyFilter();
  }, [applyFilter]);

  useEffect(() => {
    if (subscribeRequested) {
      toast.success("Subscription preferences saved.");
    }
  }, [subscribeRequested]);

  const onSubscribe = () => {
    toast.success("Subscription updated for these filters.");
  };

  return (
    <AppLayout>
      <div
        style={{
          position: "fixed",
          top: HEADER_HEIGHT,
          left: 0,
          right: 0,
          zIndex: 1200,
          background: "#f5f6fa",
          padding: "0.35rem 0 0.55rem 0",
          boxShadow: "0 4px 10px rgba(15,23,42,0.08)",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: "min(1180px, 100% - 2rem)",
            background: "linear-gradient(90deg,#4e6dfb,#63b5ff)",
            padding: "0.65rem 1.3rem 0.8rem 1.3rem",
            borderRadius: "14px",
            boxShadow: "0 4px 10px rgba(15,23,42,0.25)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "0.35rem",
            }}
          >
            <span
              style={{
                color: "#fff",
                fontSize: "1.15rem",
                fontWeight: 700,
              }}
            >
              Search Filters
            </span>

            <Button
              component={Link}
              to="/"
              sx={{
                marginLeft: "auto",
                color: "white",
                textTransform: "none",
                fontWeight: 500,
                fontSize: "0.85rem",
                textDecoration: "underline",
                padding: 0,
                minWidth: 0,
              }}
            >
              Back to main search
            </Button>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(5, minmax(0,1fr))",
              gap: "0.6rem",
              alignItems: "center",
            }}
          >
            <TextField
              label="University"
              select
              size="small"
              variant="filled"
              value={filters.universityId}
              onChange={(e) =>
                setFilters({ ...filters, universityId: e.target.value })
              }
              sx={{ background: "white", borderRadius: "6px" }}
              SelectProps={{ MenuProps: menuProps }}
            >
              <MenuItem value="">Any</MenuItem>
              {universities.map((u) => (
                <MenuItem key={u.id} value={u.id}>
                  {u.name}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              label="Field"
              select
              size="small"
              variant="filled"
              value={filters.fieldId}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  fieldId: e.target.value,
                  specializationId: "",
                })
              }
              sx={{ background: "white", borderRadius: "6px" }}
              SelectProps={{ MenuProps: menuProps }}
            >
              <MenuItem value="">Any</MenuItem>
              {fields.map((f) => (
                <MenuItem key={f.id} value={f.id}>
                  {f.name}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              label="Specialization"
              select
              size="small"
              variant="filled"
              value={filters.specializationId}
              onChange={(e) =>
                setFilters({ ...filters, specializationId: e.target.value })
              }
              sx={{ background: "white", borderRadius: "6px" }}
              SelectProps={{ MenuProps: menuProps }}
            >
              <MenuItem value="">Any</MenuItem>
              {visibleSpecializations.map((s) => (
                <MenuItem key={s.id} value={s.id}>
                  {s.name}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              label="Level"
              select
              size="small"
              variant="filled"
              value={filters.level}
              onChange={(e) =>
                setFilters({ ...filters, level: e.target.value })
              }
              sx={{ background: "white", borderRadius: "6px" }}
              SelectProps={{ MenuProps: menuProps }}
            >
              <MenuItem value="">Any</MenuItem>
              <MenuItem value="Bachelors">Bachelors</MenuItem>
              <MenuItem value="Masters">Masters</MenuItem>
            </TextField>

            <TextField
              label="Duration"
              select
              size="small"
              variant="filled"
              value={filters.duration}
              onChange={(e) =>
                setFilters({ ...filters, duration: e.target.value })
              }
              sx={{ background: "white", borderRadius: "6px" }}
              SelectProps={{ MenuProps: menuProps }}
            >
              <MenuItem value="">Any</MenuItem>
              <MenuItem value="1 Year">1 Year</MenuItem>
              <MenuItem value="2 Years">2 Years</MenuItem>
              <MenuItem value="3 Years">3 Years</MenuItem>
            </TextField>
          </div>

          <div
            style={{
              display: "flex",
              gap: "0.7rem",
              marginTop: "0.6rem",
            }}
          >
            <Button
              variant="contained"
              onClick={applyFilter}
              sx={{
                background: "white",
                color: "#4e6dfb",
                fontWeight: 600,
                minWidth: "96px",
                paddingInline: "1.2rem",
                textTransform: "none",
                "&:hover": { background: "#eef1ff" },
              }}
            >
              Apply
            </Button>

            <Button
              variant="outlined"
              onClick={onSubscribe}
              sx={{
                borderColor: "white",
                color: "white",
                fontWeight: 600,
                minWidth: "120px",
                paddingInline: "1.2rem",
                textTransform: "none",
                "&:hover": {
                  borderColor: "white",
                  background: "rgba(255,255,255,0.15)",
                },
              }}
            >
              Subscribe
            </Button>
          </div>
        </div>
      </div>

      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          paddingTop: HEADER_HEIGHT + FILTER_HEIGHT,
          paddingBottom: "3rem",
        }}
      >
        {results.map((course) => {
          const uni = universities.find((u) => u.id === course.universityId);
          const field = fields.find((f) => f.id === course.fieldId);
          const spec = specializations.find(
            (s) => s.id === course.specializationId
          );

          return (
            <div
              key={course.id}
              style={{
                background: "#ffffff",
                borderRadius: "16px",
                padding: "1.4rem 1.6rem",
                marginBottom: "1rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                boxShadow: "0 8px 18px rgba(15,23,42,0.06)",
                border: "1px solid #e5e7eb",
              }}
            >
              <div style={{ maxWidth: "70%" }}>
                <div
                  style={{
                    fontSize: "1.2rem",
                    fontWeight: 700,
                    marginBottom: "0.4rem",
                    color: colors.textDark,
                  }}
                >
                  {course.name}
                </div>
                <div style={{ fontSize: "0.95rem", color: "#4b5563" }}>
                  <div>
                    <strong>University:</strong> {uni?.name}
                  </div>
                  <div>
                    <strong>Field:</strong> {field?.name}
                  </div>
                  <div>
                    <strong>Specialization:</strong> {spec?.name}
                  </div>
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-end",
                  gap: "0.5rem",
                }}
              >
                <div style={{ display: "flex", gap: "0.4rem" }}>
                  <span
                    style={{
                      padding: "0.15rem 0.55rem",
                      borderRadius: "999px",
                      background: "#eef2ff",
                      color: "#4338ca",
                      fontSize: "0.8rem",
                      fontWeight: 600,
                    }}
                  >
                    {course.level}
                  </span>
                  <span
                    style={{
                      padding: "0.15rem 0.55rem",
                      borderRadius: "999px",
                      background: "#ecfeff",
                      color: "#0f766e",
                      fontSize: "0.8rem",
                      fontWeight: 600,
                    }}
                  >
                    {course.duration}
                  </span>
                </div>

                <Button
                  size="small"
                  variant="contained"
                  sx={{
                    marginTop: "0.2rem",
                    background: colors.primary,
                    textTransform: "none",
                    fontWeight: 600,
                    fontSize: "0.85rem",
                    "&:hover": { background: "#1d4ed8" },
                  }}
                >
                  View details
                </Button>
              </div>
            </div>
          );
        })}

        {results.length === 0 && (
          <p style={{ fontStyle: "italic", marginTop: "1rem" }}>
            No matching programs found.
          </p>
        )}
      </div>
    </AppLayout>
  );
}
