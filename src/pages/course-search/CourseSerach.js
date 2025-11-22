import React, { useState, useEffect } from "react";
import { TextField, Button, MenuItem, CircularProgress } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import { useNavigate } from "react-router-dom";
import { colors } from "../../theme/colors";
import AppLayout from "../../components/Layout";

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

export default function CourseSearch() {
  const navigate = useNavigate();

  const [filters, setFilters] = useState({
    universityId: "",
    fieldId: "",
    specializationId: "",
    level: "",
    duration: "",
  });

  const [loading, setLoading] = useState(false);

  const visibleSpecializations = filters.fieldId
    ? specializations.filter(s => s.fieldId === filters.fieldId)
    : specializations;

  const onSearch = () => {
    navigate("/courses", { state: { filters } });
  };

  const onSubscribe = () => {
    navigate("/courses", { state: { filters, subscribe: true } });
  };

  return (
    <AppLayout>
      <div
        style={{
          width: "100%",
          height: "260px",
          backgroundImage: `url("https://images.unsplash.com/photo-1460518451285-97b6aa326961?q=80&w=1600")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
          fontSize: "2.2rem",
          fontWeight: 700,
          textShadow: "0 3px 10px rgba(0,0,0,0.4)",
        }}
      >
        Find Courses Across Universities
      </div>

      <div
        style={{
          background: "#fff",
          padding: "2rem",
          borderRadius: "16px",
          maxWidth: "950px",
          width: "90%",
          margin: "-50px auto 3rem auto",
          boxShadow: "0 6px 20px rgba(0,0,0,0.12)",
        }}
      >
        <h2 style={{ marginBottom: "1.5rem" }}>Search Programs</h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "1rem",
            marginBottom: "1.5rem",
          }}
        >

          <Autocomplete
            options={universities}
            getOptionLabel={(o) => o.name}
            onChange={(e, v) =>
              setFilters({ ...filters, universityId: v ? v.id : "" })
            }
            renderInput={(params) => (
              <TextField {...params} label="University" placeholder="Search..." />
            )}
          />

          <Autocomplete
            options={fields}
            getOptionLabel={(o) => o.name}
            onChange={(e, v) =>
              setFilters({
                ...filters,
                fieldId: v ? v.id : "",
                specializationId: "",
              })
            }
            renderInput={(params) => (
              <TextField {...params} label="Field of Study" placeholder="Search..." />
            )}
          />

          <Autocomplete
            options={visibleSpecializations}
            getOptionLabel={(o) => o.name}
            onChange={(e, v) =>
              setFilters({ ...filters, specializationId: v ? v.id : "" })
            }
            renderInput={(params) => (
              <TextField {...params} label="Specialization" placeholder="Search..." />
            )}
          />

          <Autocomplete
            options={["Bachelors", "Masters"]}
            onChange={(e, v) => setFilters({ ...filters, level: v || "" })}
            renderInput={(params) => (
              <TextField {...params} label="Level" placeholder="Type..." />
            )}
          />

          <TextField
            label="Duration"
            select
            fullWidth
            value={filters.duration}
            onChange={(e) => setFilters({ ...filters, duration: e.target.value })}
          >
            <MenuItem value="">Any</MenuItem>
            <MenuItem value="1 Year">1 Year</MenuItem>
            <MenuItem value="2 Years">2 Years</MenuItem>
            <MenuItem value="3 Years">3 Years</MenuItem>
          </TextField>

        </div>

        <div style={{ display: "flex", gap: "1rem" }}>
          <Button
            variant="contained"
            style={{ background: colors.primary }}
            onClick={onSearch}
          >
            Search
          </Button>

          <Button variant="outlined" onClick={onSubscribe}>
            Subscribe
          </Button>
        </div>
      </div>
    </AppLayout>
  );
}
