import React from "react";
import Layout from "../components/layouts/Layout";
import { Grid, Typography } from "@mui/material";
import styles from "./contact.module.css";
import custmorcare from "../assets/image/Custmercare.jpg";
import MailIcon from "@mui/icons-material/Mail";
import PhoneIcon from "@mui/icons-material/Phone";
import HeadsetMicIcon from "@mui/icons-material/HeadsetMic";

const Contact = () => {
  return (
    <Layout>
      <Grid className={styles.Main_Grid} spacing={2} container>
        <Grid item xs={12} sm={12} md={4} lg={5} className={styles.left_side}>
          <img className={styles.img} src={custmorcare} alt="This is Image " />
        </Grid>
        <Grid item xs={12} sm={12} md={3} lg={3} className={styles.right_side}>
          <Grid className={styles.Contact_us}>
            <h3>CONTACT US</h3>
          </Grid>
          <p className={styles.message}>
            Any query and info about product feel free to call anytime we 24 X 7
            available
          </p>
          <Grid className={styles.email_grid}>
            <MailIcon />
            <Typography>- dasmanojkumar@gmail.com</Typography>
          </Grid>
          <Grid className={styles.ph_grid}>
            <PhoneIcon />
            <Typography>- 6371287364</Typography>
          </Grid>
          <Grid className={styles.tollfree_grid}>
            <HeadsetMicIcon />
            <Typography>- 1800 000 000(tollfree)</Typography>
          </Grid>
        </Grid>
      </Grid>
    </Layout>
  );
};

export default Contact;
