import React, { useState, useEffect } from "react";
import { TextField, MenuItem, Button, CircularProgress } from "@mui/material";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import AppLayout from "../../components/Layout";
import { colors } from "../../theme/colors";
import { useSelector, useDispatch } from "react-redux";
import { setFilters } from "../../store/auth/filterSlice";
import { setUniversities, setFields, setSpecializations } from "../../store/auth/lookupsSlice";
import useFetch from "../hooks/useFetch";

const HEADER_HEIGHT = 64;
const FILTER_HEIGHT = 130;

const menuProps = {
  disablePortal: false,
  disableScrollLock: true,
  container: () => document.body,
  PaperProps: { elevation: 6, style: { zIndex: 9999 } },
};

export default function CourseResults() {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state?.auth?.user);

  const lookups = useSelector((state) => state.lookups);
  const savedFilters = useSelector((state) => state.filters);
  const initialFilters = location.state?.filters || savedFilters;
  const subscribeRequested = location.state?.subscribe || false;

  const [filters, setFiltersLocal] = useState(initialFilters);
  const [courses, setCourses] = useState([]);
  const [page, setPage] = useState(1);

  const { data, loading, fetchData } = useFetch("/universities/search", "GET");
  const { data: uniData, fetchData: loadUniversities } = useFetch("/universities", "GET");
  const { data: fieldData, fetchData: loadFields } = useFetch("/fields", "GET");
  const { data: specData, fetchData: loadSpecializations } = useFetch("/specializations", "GET");
  const { fetchData: saveSub } = useFetch("/subscription", "POST", false);

  const cleanNull = (obj) => {
    const cleaned = { ...obj };
    Object.keys(cleaned).forEach((key) => {
      if (cleaned[key] === "" || cleaned[key] === undefined) cleaned[key] = null;
    });
    return cleaned;
  };

  const subscribeApi = (body) => {
    if (!user?.email) return toast.error("Login required to subscribe");
    saveSub(cleanNull(body));
    toast.success("Subscribed for updates.");
  };

  const fetchCourses = (f = filters, p = 1) => {
    const params = {};
    if (f.universityId) params.universityId = f.universityId;
    if (f.fieldId) params.fieldId = f.fieldId;
    if (f.specializationId) params.specializationId = f.specializationId;
    if (f.level) params.level = f.level;
    if (f.duration) params.duration = f.duration;
    params.page = p;
    params.limit = 8;
    fetchData(null, params);
  };

  useEffect(() => {
    if (!lookups.universities.length) loadUniversities();
    if (!lookups.fields.length) loadFields();
    fetchCourses(initialFilters, 1);
  }, []);

  useEffect(() => {
    if (uniData?.data) dispatch(setUniversities(uniData.data));
  }, [uniData, dispatch]);

  useEffect(() => {
    if (fieldData?.data) dispatch(setFields(fieldData.data));
  }, [fieldData, dispatch]);

  useEffect(() => {
    if (filters.fieldId) loadSpecializations(null, { fieldId: filters.fieldId });
  }, [filters.fieldId]);

  useEffect(() => {
    if (specData?.data && filters.fieldId) {
      dispatch(
        setSpecializations({
          fieldId: filters.fieldId,
          list: specData.data,
        })
      );
    }
  }, [specData, filters.fieldId, dispatch]);

  useEffect(() => {
    if (!data) return;
    if (!data.data || !Array.isArray(data.data) || data.data.length === 0) {
      setCourses([]);
      return;
    }
    if (page === 1) setCourses(data.data);
    else setCourses((prev) => [...prev, ...data.data]);
  }, [data, page]);

  useEffect(() => {
    if (subscribeRequested) toast.success("Subscription preferences saved.");
  }, [subscribeRequested]);

  const updateFilterEverywhere = (obj) => {
    const newFilters = { ...filters, ...obj };
    setFiltersLocal(newFilters);
    dispatch(setFilters(newFilters));
    setPage(1);
    fetchCourses(newFilters, 1);
  };

  const onSubscribeMain = () =>
    subscribeApi(
      cleanNull({
        userEmail: user?.email,
        universityId: filters.universityId,
        fieldId: filters.fieldId,
        specializationId: filters.specializationId,
        level: filters.level,
        duration: filters.duration,
      })
    );

  const visibleSpecializations = filters.fieldId
    ? lookups.specializations?.[filters.fieldId] || []
    : [];
  const levels = ["Bachelors", "Masters", "PG Diploma"];
  const durations = ["1 Year", "16 Months", "20 Months", "2 Years", "3 Years", "4 Years"];

  const topPadding =
    window.innerWidth <= 768
      ? HEADER_HEIGHT + FILTER_HEIGHT + 30
      : HEADER_HEIGHT / 2 + FILTER_HEIGHT;

  return (
    <AppLayout>
      <div
        style={{
          position: "fixed",
          top: HEADER_HEIGHT,
          left: 0,
          right: 0,
          zIndex: 1000,
          background: "linear-gradient(90deg,#4e6dfb,#63b5ff)",
          padding: "0.9rem 1rem 1rem 1rem",
          boxShadow: "0 4px 10px rgba(0,0,0,0.12)",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: "min(1400px, 100% - 2rem)",
            display: "flex",
            flexDirection: "column",
            gap: "0.75rem",
            color: "white",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <span style={{ fontSize: "1.2rem", fontWeight: 700 }}>Search Filters</span>
            <Button
              onClick={onSubscribeMain}
              sx={{
                color: "white",
                border: "1px solid rgba(255,255,255,0.7)",
                textTransform: "none",
                fontWeight: 500,
                fontSize: "0.85rem",
                borderRadius: "999px",
                padding: "0.15rem 0.9rem",
              }}
            >
              Subscribe
            </Button>
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
              }}
            >
              Back to main search
            </Button>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(5,1fr)",
              gap: "0.7rem",
            }}
          >
            <TextField
              label="University"
              select
              size="small"
              variant="filled"
              value={filters.universityId || ""}
              onChange={(e) => updateFilterEverywhere({ universityId: e.target.value || "" })}
              sx={{ background: "white", borderRadius: "6px" }}
              SelectProps={{ MenuProps: menuProps }}
            >
              <MenuItem value="">Any</MenuItem>
              {lookups.universities.map((u) => (
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
              value={filters.fieldId || ""}
              onChange={(e) =>
                updateFilterEverywhere({
                  fieldId: e.target.value || "",
                  specializationId: "",
                })
              }
              sx={{ background: "white", borderRadius: "6px" }}
              SelectProps={{ MenuProps: menuProps }}
            >
              <MenuItem value="">Any</MenuItem>
              {lookups.fields.map((f) => (
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
              value={filters.specializationId || ""}
              onChange={(e) => updateFilterEverywhere({ specializationId: e.target.value || "" })}
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
              value={filters.level || ""}
              onChange={(e) => updateFilterEverywhere({ level: e.target.value || "" })}
              sx={{ background: "white", borderRadius: "6px" }}
              SelectProps={{ MenuProps: menuProps }}
            >
              <MenuItem value="">Any</MenuItem>
              {levels.map((l) => (
                <MenuItem key={l} value={l}>
                  {l}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              label="Duration"
              select
              size="small"
              variant="filled"
              value={filters.duration || ""}
              onChange={(e) => updateFilterEverywhere({ duration: e.target.value || "" })}
              sx={{ background: "white", borderRadius: "6px" }}
              SelectProps={{ MenuProps: menuProps }}
            >
              <MenuItem value="">Any</MenuItem>
              {durations.map((d) => (
                <MenuItem key={d} value={d}>
                  {d}
                </MenuItem>
              ))}
            </TextField>
          </div>
        </div>
      </div>

      <div style={{ paddingTop: topPadding, paddingBottom: "4rem" }}>
        <div
          style={{
            maxWidth: "1400px",
            margin: "0 auto",
            display: courses.length > 0 ? "grid" : "block",
            gridTemplateColumns:
              courses.length > 0 ? "repeat(auto-fit, minmax(600px, 1fr))" : "none",
            gap: "1.5rem",
          }}
        >
          {courses.length === 0 && !loading && (
            <div
              style={{
                textAlign: "center",
                marginTop: "3rem",
                fontSize: "1.15rem",
                color: "#333",
                fontWeight: 500,
              }}
            >
              No matching programs found
              <div style={{ marginTop: "0.5rem" }}>
                <Button
                  variant="contained"
                  onClick={() =>
                    subscribeApi(
                      cleanNull({
                        userEmail: user?.email,
                        universityId: filters.universityId,
                        fieldId: filters.fieldId,
                        specializationId: filters.specializationId,
                        level: filters.level,
                        duration: filters.duration,
                      })
                    )
                  }
                  sx={{ fontWeight: 600 }}
                >
                  Subscribe for updates
                </Button>
              </div>
            </div>
          )}

          {courses.map((c) => (
            <div
              key={c.id}
              style={{
                background: "#fff",
                borderRadius: "16px",
                padding: "1.8rem 2rem",
                boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
                border: "1px solid #e5e7eb",
              }}
            >
              <div
                style={{
                  fontSize: "1.3rem",
                  fontWeight: 700,
                  marginBottom: "0.4rem",
                }}
              >
                {c.name}
              </div>
              <div style={{ fontSize: "0.95rem", color: "#444" }}>
                <div>
                  <strong>University:</strong> {c.university}
                </div>
                <div>
                  <strong>Field:</strong> {c.field}
                </div>
                <div>
                  <strong>Specialization:</strong> {c.specialization}
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginTop: "1rem",
                }}
              >
                <div style={{ display: "flex", gap: "0.4rem" }}>
                  <span
                    style={{
                      padding: "0.25rem 0.65rem",
                      borderRadius: "999px",
                      background: "#eef2ff",
                      color: "#4338ca",
                      fontSize: "0.85rem",
                      fontWeight: 600,
                    }}
                  >
                    {c.level}
                  </span>
                  <span
                    style={{
                      padding: "0.25rem 0.65rem",
                      borderRadius: "999px",
                      background: "#ecfeff",
                      color: "#0f766e",
                      fontSize: "0.85rem",
                      fontWeight: 600,
                    }}
                  >
                    {c.duration}
                  </span>
                </div>

                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() =>
                      subscribeApi(
                        cleanNull({
                          userEmail: user?.email,
                          universityId: c.universityId,
                          fieldId: c.fieldId,
                          specializationId: c.specializationId,
                          level: c.level,
                          duration: c.duration,
                        })
                      )
                    }
                    sx={{
                      textTransform: "none",
                      fontWeight: 600,
                      borderColor: colors.primary,
                      color: colors.primary,
                      "&:hover": { borderColor: "#1d4ed8", color: "#1d4ed8" },
                    }}
                  >
                    Subscribe
                  </Button>

                  <Button
                    size="small"
                    variant="contained"
                    onClick={() => navigate(`/course/${c.id}`)}
                    sx={{
                      background: colors.primary,
                      textTransform: "none",
                      fontWeight: 600,
                      "&:hover": { background: "#1d4ed8" },
                    }}
                  >
                    View details
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {courses.length > 0 && data?.pages > page && (
          <div style={{ textAlign: "center", marginTop: "2rem" }}>
            <Button
              variant="contained"
              disabled={loading}
              onClick={() => {
                const next = page + 1;
                setPage(next);
                fetchCourses(filters, next);
              }}
              sx={{ textTransform: "none", padding: "0.5rem 1.5rem", fontWeight: 600 }}
            >
              {loading ? (
                <CircularProgress size={20} sx={{ color: "white" }} />
              ) : (
                "Load More"
              )}
            </Button>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
