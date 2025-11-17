import React from "react";
import { useForm, Controller } from "react-hook-form";
import { TextField, Button } from "@mui/material";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { colors } from "../../theme/colors";
import useFetch from "../hooks/useFetch";
import Loader from "../../components/Loader";

const schema = yup.object({
  firstname: yup.string().required("First name required"),
  lastname: yup.string().required("Last name required"),
  email: yup.string().email("Invalid").required("Email required"),
  password: yup.string().required("Password required").min(4),
  confirmPassword: yup.string().required().oneOf([yup.ref("password")], "Doesn't match"),
});

const Signup = () => {

  const {
    handleSubmit,
    control,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema)
  });

  const { data, error, loading, fetchData } = useFetch("/user/signup", "POST", false);

  const onSubmit = (form) => {

    fetchData({
      firstname: form.firstname,
      lastname: form.lastname,
      email: form.email,
      password: form.password,
    });
  };

  return (
    <>
      <Loader loading={loading} />
      <div
        style={{
          boxSizing: "border-box",
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "1rem",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "420px",
            padding: "1.8rem",
            borderRadius: "16px",
            background: "rgba(255,255,255,0.82)",
            boxShadow: "0 6px 22px rgba(0,0,0,0.15)",
            backdropFilter: "blur(14px)",
          }}
        >
          <div style={{ textAlign: "center", marginBottom: "1rem" }}>
            <img
              src="/course_tracker.png"
              alt="Logo"
              style={{ width: 70, height: 70, borderRadius: 14 }}
            />
          </div>

          <h2
            style={{
              textAlign: "center",
              marginBottom: "1rem",
              color: colors.textDark,
              fontWeight: 700,
              fontSize: "1.4rem"
            }}
          >
            Create Account
          </h2>

          <form onSubmit={handleSubmit(onSubmit)}>

            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
              <div style={{ flex: "1 1 160px" }}>
                <Controller
                  name="firstname"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="First Name"
                      fullWidth
                      margin="dense"
                      error={!!errors.firstname}
                      helperText={errors.firstname?.message}
                    />
                  )}
                />
              </div>

              <div style={{ flex: "1 1 160px" }}>
                <Controller
                  name="lastname"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Last Name"
                      fullWidth
                      margin="dense"
                      error={!!errors.lastname}
                      helperText={errors.lastname?.message}
                    />
                  )}
                />
              </div>
            </div>

            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Email"
                  fullWidth
                  margin="dense"
                  error={!!errors.email}
                  helperText={errors.email?.message}
                />
              )}
            />

            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
              <div style={{ flex: "1 1 160px" }}>
                <Controller
                  name="password"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Password"
                      type="password"
                      fullWidth
                      margin="dense"
                      error={!!errors.password}
                      helperText={errors.password?.message}
                    />
                  )}
                />
              </div>

              <div style={{ flex: "1 1 160px" }}>
                <Controller
                  name="confirmPassword"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Confirm"
                      type="password"
                      fullWidth
                      margin="dense"
                      error={!!errors.confirmPassword}
                      helperText={errors.confirmPassword?.message}
                    />
                  )}
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="contained"
              fullWidth
              style={{
                background: colors.primary,
                marginTop: "1rem",
                padding: "0.7rem",
                borderRadius: "10px",
                fontWeight: 600,
                fontSize: "0.95rem"
              }}
            >
              Sign Up
            </Button>

            <Button
              fullWidth
              variant="outlined"
              style={{
                borderColor: colors.secondary,
                color: colors.secondary,
                marginTop: "1rem",
                padding: "0.7rem",
                borderRadius: "10px",
                fontWeight: 600,
                fontSize: "0.95rem"
              }}
            >
              Already have an account
            </Button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Signup;
