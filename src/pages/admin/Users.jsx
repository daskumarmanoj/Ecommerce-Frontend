import React, { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../../components/layouts/Layout";
import AdminMenu from "../../components/layouts/AdminMenu";
import { Grid } from "@mui/material";
import styles from "./User.module.css";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("/api/users"); // Replace with your API endpoint
        setUsers(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching users:", error);
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <Layout>
      <Grid container className={styles.Main_Grid}>
        <Grid item xs={12} sm={12} md={3} lg={3} className={styles.Left_Grid}>
          <AdminMenu />
        </Grid>
        <Grid item xs={12} sm={12} md={8} lg={8} className={styles.Right_Grid}>
          <h1>All Users</h1>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <ul>
              {users.map(user => (
                <li key={user.id}>
                  {user.name} - {user.email}
                </li>
              ))}
            </ul>
          )}
        </Grid>
      </Grid>
    </Layout>
  );
};

export default Users;
