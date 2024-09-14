import Layout from "../components/layouts/Layout";
import React from "react";
import useCategory from "../Hooks/useCategoryHoks";
import { Link as RouterLink } from "react-router-dom";
import { Link, Grid, Button } from "@mui/material";
import styles from "./Categories.module.css";

const Categories = () => {
  const categories = useCategory();
  return (
    <Layout title={"All Categories"}>
      <div className={styles.container}>
        <Grid container spacing={3}>
          {categories.map((c) => (
            <Grid item xs={12} sm={6} md={4} key={c._id}>
              <Button
                component={RouterLink}
                to={`/category/${c.slug}`}
                variant="contained"
                color="primary"
                className={styles.categoryButton}
              >
                {c.name}
              </Button>
            </Grid>
          ))}
        </Grid>
      </div>
    </Layout>
  );
};

export default Categories;
