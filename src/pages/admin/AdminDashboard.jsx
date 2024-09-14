import React from "react";
import Layout from "../../components/layouts/Layout";
import { Grid, Paper } from "@mui/material";
import AdminMenu from "../../components/layouts/AdminMenu";
import { useAuth } from "../../context/auth";
import styles from "./AdminDashboard.module.css";

const AdminDashboard = () => {
  const [auth] = useAuth();
  return (
    <>
      <Layout>
          <Grid container className={styles.Main_Grid}>
            <Grid
              className={styles.Left_Side}
              item
              md={3}
              sm={12}
              xs={12}
              lg={3}
            >
              <AdminMenu />
            </Grid>
            <Grid
              className={styles.Right_Side}
              item
              md={8}
              xs={12}
              sm={12}
              lg={8}
            >
              <Paper className={styles.card}>
                <p>
                  <b>Admin Name:</b> {auth?.user?.name}
                </p>
                <p>
                  {" "}
                  <b>Admin Email:</b> {auth?.user?.email}
                </p>
                <p>
                  <b>Admin Contact :</b> {auth?.user?.address}
                </p>
              </Paper>
            </Grid>
          </Grid>
      </Layout>
    </>
  );
};

export default AdminDashboard;
