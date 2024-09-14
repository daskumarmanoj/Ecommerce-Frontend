import React from "react";
import Layout from "../components/layouts/Layout";
import styles from "./policy.module.css";
import privecy from "../assets/image/privacy-policy.png";
import { Grid } from "@mui/material";

const Policy = () => {
  return (
    <Layout>
      <Grid className={styles.Main_Grid} spacing={2} container>
        <Grid item xs={12} sm={12} md={4} lg={5} className={styles.left_side}>
          <img className={styles.img} src={privecy} alt="About us image" />
        </Grid>
        <Grid item xs={12} sm={12} md={3} lg={3} className={styles.right_side}>
          <p className={styles.message}>
            Your privacy is important to us. We are committed to safeguarding
            the privacy of our website visitors; this policy sets out how we
            will treat your personal information. We may collect, store, and use
            the following kinds of personal data: information about your
            computer and about your visits to and use of this website,
            information that you provide to us for the purpose of subscribing to
            our website services, and any other information that you choose to
            send to us. We will take reasonable technical and organizational
            precautions to prevent the loss, misuse, or alteration of your
            personal information.
          </p>
        </Grid>
      </Grid>
    </Layout>
  );
};

export default Policy;
