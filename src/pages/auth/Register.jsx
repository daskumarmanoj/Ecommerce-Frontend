import React, { useState } from "react";
import Layout from "../../components/layouts/Layout";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Button, Typography, Link, Grid } from "@mui/material";
import styles from "./register.module.css";
import toast from "react-hot-toast";

const Register = () => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !phone || !address || !password) {
      setError("All fields are required.");
      return;
    }
    setError("");

    try {
      const res = await axios.post(
        "http://localhost:8080/api/v1/auth/register",
        {
          name,
          email,
          password,
          phone,
          address,
          answer,
        }
      );
      if (res && res.data.success) {
        toast.success(res.data && res.data.message);
        navigate("/login");
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  return (
    <Layout title="Register - E-commerce App">
      <Grid container className={styles.Parent_Grid}>
        <Grid item xs={12} sm={12} md={6} lg={6} className={styles.Main_Grid}>
          <Grid className={styles.form_Grid}>
            <p className={styles.title}>Register Here!</p>
            <form onSubmit={handleSubmit} className={styles.Form}>
              <div className={styles.Email_Grid}>
                <label className={styles.heading}>Enter Your Full Name:</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className={styles.Email_Grid}>
                <label className={styles.heading}>Enter Your Email:</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className={styles.Email_Grid}>
                <label className={styles.heading}>Enter Your Phone No:</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              <div className={styles.Email_Grid}>
                <label className={styles.heading}>Enter Your Address:</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>
              <div className={styles.Email_Grid}>
                <label className={styles.heading}>Enter Your Password:</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className={styles.Email_Grid}>
                <label className={styles.heading}>Enter Your Favorite Food:</label>
                <input
                  type="text"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                />
              </div>
              {error && (
                <Typography color="error" className={styles.errorText}>
                  {error}
                </Typography>
              )}
              <Button
                type="submit"
                variant="contained"
                color="primary"
                className={styles.submitButton}
              >
                Register
              </Button>
            </form>
            <p className={styles.footerText}>
              Already have an account? <Link href="/login">Login here</Link>
            </p>
          </Grid>
        </Grid>
      </Grid>
    </Layout>
  );
};

export default Register;
