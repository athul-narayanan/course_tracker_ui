import React, { useState, useEffect, use } from "react";
import { TextField, MenuItem, Button, Paper } from "@mui/material";
import AppLayout from "../../components/Layout";
import { useSelector, useDispatch } from "react-redux";
import { setUniversities, setFields, setSpecializations } from "../../store/auth/lookupsSlice";
import { colors } from "../../theme/colors";
import useFetch from "../hooks/useFetch";
import toast from "react-hot-toast";

export default function ManageCourses() {
  const dispatch = useDispatch();
  const lookups = useSelector((state) => state.lookups);

  const [fileToUpload, setFileToUpload] = useState(null);

  const { data: uniData, fetchData: loadUniversities } = useFetch("/universities", "GET");
  const { data: fieldData, fetchData: loadFields } = useFetch("/fields", "GET");
  const { data: specData, fetchData: loadSpecializations } = useFetch("/specializations", "GET");

  const { fetchData: addCourse, data: addedCourse, error: addCourseError } = useFetch("/universities/add", "POST", false);
  const { fetchData: uploadFile, data: uploadFileData, error: uploadFileError } = useFetch("/universities/upload", "POST", false);

  const [activeTab, setActiveTab] = useState("add");

  const [form, setForm] = useState({
    name: "",
    universityId: null,
    fieldId: null,
    specializationId: null,
    level: null,
    duration: null,
    courseLink: "",
  });

  const [validation, setValidation] = useState({
    linkError: "",
  });

  const levels = ["Bachelors", "Masters", "PG Diploma"];
  const durations = ["1 Year", "16 Months", "20 Months", "2 Years", "3 Years", "4 Years"];

  useEffect(() => {
    if (!lookups.universities.length) loadUniversities();
    if (!lookups.fields.length) loadFields();
  }, []);

  useEffect(() => {
    if (addedCourse && !addCourseError) {
      toast.success("Course added successfully");
      setForm({
        name: "",
        universityId: null,
        fieldId: null,
        specializationId: null,
        level: null,
        duration: null,
        courseLink: "",
      });
    }
  }, [addedCourse, addCourseError]);

  useEffect(() => { 
    if (uploadFileData && !uploadFileError) {
      toast.success("File uploaded successfully");
      setFileToUpload(null);
    }
  }, [uploadFileData, uploadFileError]);

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

  const visibleSpecializations = form.fieldId ? lookups.specializations?.[form.fieldId] || [] : [];

  const validateLink = (value) => {
    if (!value.startsWith("http://") && !value.startsWith("https://")) {
      setValidation({ ...validation, linkError: "Valid link must start with http:// or https://" });
    } else {
      setValidation({ ...validation, linkError: "" });
    }
  };

  const handleInput = (key, value) => {
    const cleanVal =
      value === "" ? "" : isNaN(value) || ["courseLink", "name"].includes(key) ? value : Number(value);

    setForm((prev) => {
      const updated = { ...prev, [key]: cleanVal };

      if (key === "fieldId") updated.specializationId = null;

      if (key === "courseLink") validateLink(cleanVal);

      return updated;
    });
  };

  const isDisabled =
    !form.name ||
    !form.universityId ||
    !form.fieldId ||
    !form.specializationId ||
    !form.level ||
    !form.duration ||
    !form.courseLink ||
    validation.linkError !== "";

  const handleAddCourse = () => {
    if (isDisabled) {
      toast.error(validation.linkError || "All fields are mandatory");
      return;
    }
    addCourse(form);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const body = new FormData();
    body.append("file", file);
    uploadFile(body);
    toast.success("Upload started");
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

            <TextField
              label="Course Link"
              fullWidth
              value={form.courseLink}
              onChange={(e) => handleInput("courseLink", e.target.value)}
              sx={{ marginBottom: "1rem" }}
              error={!!validation.linkError}
              helperText={validation.linkError}
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
              disabled={isDisabled}
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

            <input
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                setFileToUpload(file);
                toast.success("File selected. Click Upload to proceed.");
              }}
            />

            <Button
              variant="contained"
              sx={{ marginTop: "1rem", fontWeight: 600 }}
              onClick={() => {
                if (!fileToUpload) {
                  toast.error("No file selected");
                  return;
                }

                const body = new FormData();
                body.append("file", fileToUpload);
                uploadFile(body);
                toast.success("Upload started");
              }}
            >
              Upload File
            </Button>

            <p style={{ opacity: 0.6, fontSize: "0.85rem" }}>
              Insert course details in matching template.
            </p>
          </Paper>
        )}

      </div>
    </AppLayout>
  );
}
