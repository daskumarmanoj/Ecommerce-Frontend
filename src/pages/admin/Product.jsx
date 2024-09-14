import React, { useEffect, useState } from "react";
import AdminMenu from "../../components/layouts/AdminMenu";
import Layout from "../../components/layouts/Layout";
import axios from "axios";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import styles from "./product.module.css";
import { Box, Grid } from "@mui/material";

const Product = () => {
  const [products, setProducts] = useState([]);

  const getAllProducts = async () => {
    try {
      const { data } = await axios.get("/api/v1/product/get-product");
      setProducts(data.products);
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };

  useEffect(() => {
    getAllProducts();
  }, []);

  const truncateDescription = (description) => {
    if (description.length > 30) {
      return description.substring(0, 40) + "...";
    }
    return description;
  };

  return (
    <Layout>
      <Grid container className={styles.Main_Grid}>
        <Grid item xs={12} md={3} className={styles.Left_Grid}>
          <AdminMenu />
        </Grid>
        <Grid item xs={12} md={8} className={styles.Right_Grid}>
          <p className={styles.Heading}>All Product List</p>
          <Grid container className={styles.product_Container}>
            {products.map((p) => (
              <Grid item xs={12} sm={5.8} md={3.7} key={p._id}>
                <Link
                  to={`/dashboard/admin/product/${p.slug}`}
                  className={styles.product_link}
                >
                  <div className={styles.card}>
                    <Box className={styles.Img_Box}>
                      <img
                        src={`/api/v1/product/product-photo/${p._id}`}
                        className={styles.card_img}
                        alt={p.name}
                      />
                    </Box>
                    <div className={styles.card_body}>
                      <h5 className={styles.card_title}>{p.name}</h5>
                      <p className={styles.card_text}>{truncateDescription(p.description)}</p>
                    </div>
                  </div>
                </Link>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Layout>
  );
};

export default Product;
