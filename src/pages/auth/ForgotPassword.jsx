import React, { useState } from "react";
import Layout from "../../components/layouts/Layout";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Grid, Link } from "@mui/material";
import styles from "./forgotPassword.module.css";
import toast from "react-hot-toast";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !newPassword) {
      setError("All fields are required.");
      return;
    }
    setError("");

    try {
      const res = await axios.post(
        "http://localhost:8080/api/v1/auth/forgot-password",
        { email, newPassword, answer }
      );

      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/login");
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.error("Error occurred:", error);
      toast.error("Something went wrong");
    }
  };

  return (
    <Layout>
      <Grid container className={styles.mainGrid} justifyContent="center">
        <Grid item xs={11} sm={8} md={6} lg={4} className={styles.paper}>
          <p className={styles.title}>Reset Password</p>
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.Email_Grid}>
              <label className={styles.heading}>Enter Your Email*</label>
              <input
                type="text"
                value={email}
                className={styles.input}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className={styles.Email_Grid}>
              <label className={styles.heading}>Enter Your Answer*</label>
              <input
                type="text"
                value={answer}
                className={styles.input}
                required
                onChange={(e) => setAnswer(e.target.value)}
              />
            </div>
            <div className={styles.Email_Grid}>
              <label className={styles.heading}>Enter New Password*</label>
              <input
                type="text"
                value={newPassword}
                className={styles.input}
                required
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            {error && (
              <p className={styles.errorText}>
                {error}
              </p>
            )}
            <button
              type="submit"
              className={styles.submitButton}
            >
              Reset
            </button>
          </form>
          <p className={styles.footerText}>
            Already have an account? <Link href="/login">Login here</Link>
          </p>
        </Grid>
      </Grid>
    </Layout>
  );
};

export default ForgotPassword;
