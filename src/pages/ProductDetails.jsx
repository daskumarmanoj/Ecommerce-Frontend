import Layout from "../components/layouts/Layout";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Grid, Divider } from "@mui/material";
import styles from "./ProductDetails.module.css";

const ProductDetails = () => {
  const params = useParams();
  const [product, setProduct] = useState({});
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    if (params?.slug) getProduct();
  }, [params?.slug]);

  const getProduct = async () => {
    try {
      const { data } = await axios.get(`/api/v1/product/get-product/${params.slug}`);
      setProduct(data?.product);
      getSimilarProducts(data?.product._id, data?.product.category._id);
    } catch (error) {
      console.log(error);
    }
  };

  const getSimilarProducts = async (pid, cid) => {
    try {
      const { data } = await axios.get(`/api/v1/product/related-product/${pid}/${cid}`);
      setRelatedProducts(data?.products);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Layout>
      <div className={styles.mainContainer}>
        <Grid container spacing={4} className={styles.productDetails}>
          <Grid item xs={12} md={6} className={styles.productImage}>
            <img
              src={`/api/v1/product/product-photo/${product._id}`}
              alt={product.name}
              style={{
                width: "90%",
                height: "auto",
              }}
            />

          </Grid>
          <Grid item xs={12} md={6} className={styles.productInfo}>
            <h1>Product Details</h1>
            <p><strong>Name:</strong> {product.name}</p>
            <p><strong>Description:</strong> {product.description}</p>
            <p><strong>Price:</strong> ${product.price}</p>
            <p><strong>Category:</strong> {product.category?.name}</p>
            {/* <Button variant="contained" color="secondary" className={styles.addToCartButton}>
              ADD TO CART
            </Button> */}
          </Grid>
        </Grid>
        <Divider />
        <div className={styles.similarProducts}>
          <h2>Similar Products</h2>
          {relatedProducts.length < 1 && (
            <p className={styles.noSimilarProducts}>
              No Similar Product Found
            </p>
          )}
          <Grid container spacing={4} className={styles.productList}>
            {relatedProducts.map((product) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={product._id}>
                <div className={styles.productCard}>
                  <img
                    src={`/api/v1/product/product-photo/${product._id}`}
                    alt={product.name}
                    style={{ width: "100%", height: "auto" }}
                  />
                  <div className={styles.cardBody}>
                    <h5>{product.name}</h5>
                    <p>{product.description.substring(0, 30)}...</p>
                    <p>${product.price}</p>
                    {/* <Button variant="contained" color="secondary" className={styles.addToCartButton}>
                      ADD TO CART
                    </Button> */}
                  </div>
                </div>
              </Grid>
            ))}
          </Grid>
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetails;
