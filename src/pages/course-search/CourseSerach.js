import React, { useEffect } from "react";
import { TextField, Button, MenuItem, CircularProgress } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import { useNavigate } from "react-router-dom";
import { colors } from "../../theme/colors";
import AppLayout from "../../components/Layout";
import useFetch from "../hooks/useFetch";
import { useSelector, useDispatch } from "react-redux";
import {
  setUniversities,
  setFields,
  setSpecializations,
} from "../../store/auth/lookupsSlice";
import { setFilters } from "../../store/auth/filterSlice";

export default function CourseSearch() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const filters = useSelector((state) => state.filters);
  const lookups = useSelector((state) => state.lookups);

  const levels = ["Bachelors", "Masters"];
  const durations = ["1 Year", "2 Years", "3 Years"];

  const { data: uniData, loading: uniLoading, fetchData: loadUniversities } = useFetch("/universities", "GET");
  const { data: fieldData, loading: fieldLoading, fetchData: loadFields } = useFetch("/fields", "GET");
  const { data: specData, loading: specLoading, fetchData: loadSpecializations } = useFetch("/specializations", "GET");

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
    if (filters.fieldId) {
      if (!lookups.specializations[filters.fieldId])
        loadSpecializations(null, { fieldId: filters.fieldId });
    }
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
  }, [specData]);

  const updateFilters = (updated) => dispatch(setFilters({ ...filters, ...updated }));
  const onSearch = () => navigate("/courses", { state: { filters } });
  const onSubscribe = () => navigate("/courses", { state: { filters, subscribe: true } });

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
            options={lookups.universities}
            loading={uniLoading}
            getOptionLabel={(o) => o.name}
            onChange={(e, v) => updateFilters({ universityId: v ? v.id : "" })}
            value={lookups.universities.find((u) => u.id === filters.universityId) || null}
            renderInput={(params) => (
              <TextField
                {...params}
                label="University"
                placeholder="Search..."
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {uniLoading ? <CircularProgress size={16} /> : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
          />

          <Autocomplete
            options={lookups.fields}
            loading={fieldLoading}
            getOptionLabel={(o) => o.name}
            onChange={(e, v) =>
              updateFilters({
                fieldId: v ? Number(v.id) : null,
                specializationId: "",
              })
            }
            value={lookups.fields.find((f) => f.id === filters.fieldId) || null}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Field of Study"
                placeholder="Search..."
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {fieldLoading ? <CircularProgress size={16} /> : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
          />

          <Autocomplete
            options={lookups.specializations[filters.fieldId] || []}
            loading={specLoading}
            getOptionLabel={(o) => o.name}
            onChange={(e, v) => updateFilters({ specializationId: v ? v.id : "" })}
            value={
              (lookups.specializations[filters.fieldId] || []).find(
                (s) => s.id === filters.specializationId
              ) || null
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label="Specialization"
                placeholder="Search..."
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {specLoading ? <CircularProgress size={16} /> : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
          />

          <Autocomplete
            options={levels}
            value={filters.level || null}
            onChange={(e, v) => updateFilters({ level: v || "" })}
            renderInput={(params) => <TextField {...params} label="Level" />}
          />

          <TextField
            label="Duration"
            select
            fullWidth
            value={filters.duration}
            onChange={(e) => updateFilters({ duration: e.target.value })}
          >
            <MenuItem value="">Any</MenuItem>
            {durations.map((d) => (
              <MenuItem key={d} value={d}>{d}</MenuItem>
            ))}
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
