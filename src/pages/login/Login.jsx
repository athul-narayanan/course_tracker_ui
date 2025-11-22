import React from "react";
import { useForm, Controller } from "react-hook-form";
import { TextField, Button } from "@mui/material";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { colors } from "../../theme/colors";
import Loader from "../../components/Loader";
import useFetch from "../../pages/hooks/useFetch";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setAuth } from "../../store/auth/authSlice";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const schema = yup.object({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().required("Password is required"),
});

const Login = () => {
  const {
    handleSubmit,
    control,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema)
  });

  const { data, error, loading, fetchData } = useFetch("/user/login", "POST", false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (data?.data) {
      const { firstname, id, email, lastname, phonenumber, role } = data?.data
      dispatch(setAuth({ token: "cookies", user: { id, firstname, lastname, email, role } }));
      navigate("/");
    }
  }, [data])

  useEffect(() => {
    if (error) {
      toast.error(error)
    }
  }, [error])

  

  const onSubmit = (formData) => {
    fetchData(formData);
  };

  return (
    <>
      <Loader loading={loading} />
      <div
        style={{
          minHeight: "100vh",
          backgroundImage: `url("/bg.jpg")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "1rem"
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "380px",
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
              alt="Course Tracker"
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
            Welcome Back
          </h2>

          <form onSubmit={handleSubmit(onSubmit)}>
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
              Login
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
              Create Account
            </Button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
