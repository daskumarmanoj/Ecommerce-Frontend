import React from "react";
import Layout from "../../components/layouts/Layout";
import UserMenu from "../../components/layouts/UserMenu";
import { useAuth } from "../../context/auth";
import { Grid, Paper } from "@mui/material";
import styles from "./dashboard.module.css";

const Dashboard = () => {
  const [auth] = useAuth();

  return (
    <Layout>
      <div className={styles.Main_Grid}>
        <Grid container spacing={3}>
          <Grid item md={3} xs={12}>
            <UserMenu />
          </Grid>
          <Grid item md={9} xs={12}>
            <Paper className={styles.card}>
              <p>
                <b>Name:</b> {auth?.user?.name}
              </p>
              <p>
                {" "}
                <b>Email:</b> {auth?.user?.email}
              </p>
              <p>
                <b>Address:</b> {auth?.user?.address}
              </p>
            </Paper>
          </Grid>
        </Grid>
      </div>
    </Layout>
  );
};

export default Dashboard;
