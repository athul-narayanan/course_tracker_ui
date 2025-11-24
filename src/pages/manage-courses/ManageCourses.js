import React, { useState, useEffect } from "react";
import { TextField, MenuItem, Button, Paper } from "@mui/material";
import AppLayout from "../../components/Layout";
import { useSelector, useDispatch } from "react-redux";
import { setUniversities, setFields, setSpecializations } from "../../store/auth/lookupsSlice";
import { colors } from "../../theme/colors";
import useFetch from "../hooks/useFetch";

export default function ManageCourses() {
  const dispatch = useDispatch();
  const lookups = useSelector((state) => state.lookups);

  const { data: uniData, fetchData: loadUniversities } = useFetch("/universities", "GET");
  const { data: fieldData, fetchData: loadFields } = useFetch("/fields", "GET");
  const { data: specData, fetchData: loadSpecializations } = useFetch("/specializations", "GET");

  const { fetchData: addCourse } = useFetch("/universities/add", "POST", false);
  const { fetchData: uploadFile } = useFetch("/universities/upload", "POST", false);

  const [activeTab, setActiveTab] = useState("add");
  const [form, setForm] = useState({
    name: "",
    universityId: null,
    fieldId: null,
    specializationId: null,
    level: null,
    duration: null,
  });

  const levels = ["Bachelors", "Masters", "PG Diploma"];
  const durations = ["1 Year", "16 Months", "20 Months", "2 Years", "3 Years", "4 Years"];

  useEffect(() => {
    if (!lookups.universities.length) loadUniversities();
    if (!lookups.fields.length) loadFields();
  }, []);

  useEffect(() => {
    if (uniData?.data) dispatch(setUniversities(uniData.data));
  }, [uniData]);

  useEffect(() => {
    if (fieldData?.data) dispatch(setFields(fieldData.data));
  }, [fieldData]);

  useEffect(() => {
    if (form.fieldId) loadSpecializations(null, { fieldId: form.fieldId });
  }, [form.fieldId]);

  useEffect(() => {
    if (specData?.data && form.fieldId) {
      dispatch(
        setSpecializations({
          fieldId: form.fieldId,
          list: specData.data,
        })
      );
    }
  }, [specData, form.fieldId]);

  const visibleSpecializations = form.fieldId
    ? lookups.specializations?.[form.fieldId] || []
    : [];

  const handleInput = (key, value) => {
    setForm({
      ...form,
      [key]: value === "" ? null : isNaN(value) ? value : Number(value),
    });
  };

  const handleAddCourse = () => {
    if (!form.name) return alert("Course name required");
    addCourse(form);
    alert("Course added");
  };

  const handleFileUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const body = new FormData();
    body.append("file", file);
    uploadFile(body);
    alert("Upload started");
  };

  return (
    <AppLayout>
      <div style={{ paddingTop: 0, paddingBottom: "3rem", maxWidth: 900, margin: "0 auto" }}>
        <h2 style={{ marginBottom: "1.2rem", fontWeight: 700, color: colors.textDark }}>
          Manage Courses
        </h2>

        <div style={{ display: "flex", gap: "1rem", marginBottom: "1.4rem" }}>
          <Button
            variant={activeTab === "add" ? "contained" : "outlined"}
            sx={{ textTransform: "none", fontWeight: 600 }}
            onClick={() => setActiveTab("add")}
          >
            Add Course Manually
          </Button>

          <Button
            variant={activeTab === "upload" ? "contained" : "outlined"}
            sx={{ textTransform: "none", fontWeight: 600 }}
            onClick={() => setActiveTab("upload")}
          >
            Upload Excel/CSV
          </Button>
        </div>

        {activeTab === "add" && (
          <Paper elevation={2} style={{ padding: "1.5rem", borderRadius: 12 }}>
            <TextField
              label="Course Name"
              fullWidth
              value={form.name}
              onChange={(e) => handleInput("name", e.target.value)}
              sx={{ marginBottom: "1rem" }}
            />

            <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: "1rem" }}>
              <TextField
                label="University"
                select
                fullWidth
                value={form.universityId ?? ""}
                onChange={(e) => handleInput("universityId", e.target.value)}
              >
                {lookups.universities.map((u) => (
                  <MenuItem key={u.id} value={u.id}>
                    {u.name}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                label="Field of Study"
                select
                fullWidth
                value={form.fieldId ?? ""}
                onChange={(e) => handleInput("fieldId", e.target.value)}
              >
                {lookups.fields.map((f) => (
                  <MenuItem key={f.id} value={f.id}>
                    {f.name}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                label="Specialization"
                select
                fullWidth
                value={form.specializationId ?? ""}
                onChange={(e) => handleInput("specializationId", e.target.value)}
              >
                {visibleSpecializations.map((s) => (
                  <MenuItem key={s.id} value={s.id}>
                    {s.name}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                label="Level"
                select
                fullWidth
                value={form.level ?? ""}
                onChange={(e) => handleInput("level", e.target.value)}
              >
                {levels.map((l) => (
                  <MenuItem key={l} value={l}>
                    {l}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                label="Duration"
                select
                fullWidth
                value={form.duration ?? ""}
                onChange={(e) => handleInput("duration", e.target.value)}
              >
                {durations.map((d) => (
                  <MenuItem key={d} value={d}>
                    {d}
                  </MenuItem>
                ))}
              </TextField>
            </div>

            <Button
              variant="contained"
              fullWidth
              sx={{ marginTop: "1.5rem", fontWeight: 600 }}
              onClick={handleAddCourse}
            >
              Add Course
            </Button>
          </Paper>
        )}

        {activeTab === "upload" && (
          <Paper elevation={2} style={{ padding: "1.5rem", borderRadius: 12 }}>
            <p style={{ marginBottom: 10, fontWeight: 500 }}>Upload .xlsx, .xls or .csv file</p>
            <input type="file" accept=".xlsx,.xls,.csv" onChange={handleFileUpload} />
            <p style={{ opacity: 0.6, fontSize: "0.85rem" }}>
              Insert course details in matching template.
            </p>
          </Paper>
        )}
      </div>
    </AppLayout>
  );
}
