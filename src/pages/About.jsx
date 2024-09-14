import React from "react";
import Layout from "../components/layouts/Layout";
import { Grid } from "@mui/material";
import styles from "./aboutUs.module.css";
import aboutus from "../assets/image/AboutUs.jpg";

const About = () => {
  return (
    <Layout>
      <Grid className={styles.Main_Grid}  container>
        <Grid item xs={12} sm={12} md={4} lg={5} className={styles.left_side}>
          <img className={styles.img} src={aboutus} alt="About us image" />
        </Grid>
        <Grid item xs={12} sm={12} md={3} lg={3} className={styles.right_side}>
          <p className={styles.message}>
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Obcaecati
            aut cum, cupiditate omnis velit laboriosam error quidem vitae et
            earum ab distinctio perspiciatis, ea accusamus eius repudiandae
            commodi, aliquam tempora!
          </p>
        </Grid>
      </Grid>
    </Layout>
  );
};

export default About;
