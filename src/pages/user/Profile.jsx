import React, { useState, useEffect } from "react";
import UserMenu from "../../components/layouts/UserMenu";
import Layout from "../../components/layouts/Layout";
import { useAuth } from "../../context/auth";
import toast from "react-hot-toast";
import axios from "axios";
import styles from "./Profile.module.css";
import { Button, TextField, Grid } from "@mui/material";

const Profile = () => {
  // Context
  const [auth, setAuth] = useAuth();

  // State
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [errors, setErrors] = useState({});

  // Get User Data
  useEffect(() => {
    if (auth?.user) {
      const { email, name, phone, address, password } = auth.user;
      setName(name || "");
      setPhone(phone || "");
      setEmail(email || "");
      setAddress(address || "");
      setPassword(password || "");
    }
  }, [auth]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    const newErrors = {};
    if (!name) newErrors.name = "Name is required.";
    if (!email) newErrors.email = "Email is required.";
    if (!phone) newErrors.phone = "Phone number is required.";
    if (!address) newErrors.address = "Address is required.";
    if (!password) newErrors.password = "Password is required.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    try {
      const { data } = await axios.put(
        "http://localhost:8080/api/v1/auth/profile",
        {
          name,
          email,
          password,
          phone,
          address,
        }
      );
      if (data.success) {
        setAuth((prevAuth) => ({
          ...prevAuth,
          user: data.updatedUser,
        }));
        localStorage.setItem(
          "auth",
          JSON.stringify({
            ...JSON.parse(localStorage.getItem("auth")),
            user: data.updatedUser,
          })
        );
        toast.success("Profile Updated Successfully");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };

  return (
    <Layout>
      <Grid container className={styles.mainGrid}>
        <Grid className={styles.leftSide} item xs={12} sm={12} md={3}>
          <UserMenu />
        </Grid>
        <Grid className={styles.rightSide} item xs={12} sm={12} md={9}>
          <p className={styles.title}>User Profile</p>
          <form className={styles.form} onSubmit={handleSubmit}>
            {/* <TextField


 */}
            <div className={styles.lable_input_div}>
              <label className={styles.Lable} htmlFor="">
                First Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={styles.input}
                error={!!errors.name}
                helperText={errors.name}
              />
            </div>
            <div className={styles.lable_input_div}>
              <label className={styles.Lable} htmlFor="">
                Email
              </label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={styles.input}
                error={!!errors.email}
                helperText={errors.email}
              />
            </div>
            <div className={styles.lable_input_div}>
              <label className={styles.Lable} htmlFor="">
                Phone No
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className={styles.input}
                error={!!errors.phone}
                helperText={errors.phone}
              />
            </div>
            <div className={styles.lable_input_div}>
              <label className={styles.Lable} htmlFor="">
                Adress
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className={styles.input}
                error={!!errors.address}
                helperText={errors.address}
              />
            </div>
            <div className={styles.lable_input_div}>
              <label className={styles.Lable} htmlFor="">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={styles.input}
                error={!!errors.password}
                helperText={errors.password}
              />
            </div>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              className={styles.submitButton}
            >
              UPDATE
            </Button>
          </form>
        </Grid>
      </Grid>
    </Layout>
  );
};

export default Profile;
