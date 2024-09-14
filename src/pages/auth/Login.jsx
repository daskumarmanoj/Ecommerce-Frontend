import React, { useState } from "react";
import Layout from "../../components/layouts/Layout";
import axios from "axios";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Grid, Button, Typography, IconButton, InputAdornment, TextField } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useAuth } from "../../context/auth";
import styles from "./login.module.css";
import toast from "react-hot-toast";
import bannerLogo from "../../assets/image/bannerImage-removebg-preview.png";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [auth, SetAuth] = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("All fields are required.");
      return;
    }
    setError("");

    try {
      const res = await axios.post("http://localhost:8080/api/v1/auth/login", {
        email,
        password,
      });
      if (res && res.data.success) {
        toast.success(res.data && res.data.message);
        SetAuth({
          ...auth,
          user: res.data.user,
          token: res.data.token,
        });
        localStorage.setItem("auth", JSON.stringify(res.data));
        navigate(location.state || "/");
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  return (
    <Layout title="Login - E-commerce App">
      <Grid container className={styles.Parent_Grid}>
        <Grid
          item
          xs={12}
          sm={12}
          md={5}
          lg={5}
          container
          className={styles.Left_Side}
        >
          <Grid className={styles.form_Grid}>
            <p className={styles.title}>Login Here!</p>
            <div className={styles.Email_Grid}>
              <label className={styles.heading}>Enter Your Email*</label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className={styles.Email_Grid}>
              <label className={styles.heading}>Enter Your Password*</label>
              <div className={styles.passwordInputContainer}>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={styles.passwordInput}
                />
                <IconButton
                  onClick={handleTogglePasswordVisibility}
                  className={styles.visibilityIcon}
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </div>
            </div>
            {error && (
              <Typography color="error" className={styles.errorText}>
                {error}
              </Typography>
            )}
            <button
              type="button"
              className={styles.submitButton}
              onClick={() => {
                navigate("/forgot-password");
              }}
            >
              Forgot Password
            </button>
            <Button
              className={styles.login_btn}
              type="submit"
              variant="contained"
              color="primary"
              onClick={handleSubmit}
            >
              Login
            </Button>
            <p className={styles.footerText}>
              Don't have an account? <Link to="/register">Register here</Link>
            </p>
          </Grid>
        </Grid>
        <Grid className={styles.Right_Side} item xs={12} sm={12} md={6} lg={6}>
          <img src={bannerLogo} alt="banner Logo" />
        </Grid>
      </Grid>
    </Layout>
  );
};

export default Login;
