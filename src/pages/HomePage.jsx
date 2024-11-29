import React, { useState, useEffect, useMemo } from "react";
import Layout from "../components/layouts/Layout";
import axios from "axios";
import { Checkbox } from "antd";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/Cart";
import toast from "react-hot-toast";
import styles from "./homepage.module.css";
import { Box, Grid } from "@mui/material";
import SwipeableTextMobileStepper from "./Carousel";

const HomePage = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useCart();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [checked, setChecked] = useState([]);



  const getAllCategory = async () => {
    try {
      const { data } = await axios.get("/api/v1/category/get-category");
      if (data.success) {
        setCategories(data.category);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const getAllProducts = async () => {
    try {
      const { data } = await axios.get(
        `/api/v1/product/get-product`
      );
      if (data.success) {
        setProducts((prevProducts) => {
          const newProducts = data.products.filter(
            (product) => !prevProducts.some((p) => p._id === product._id)
          );
          return [...prevProducts, ...newProducts];
        });
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleFilter = (value, id) => {
    setChecked(value ? [id] : []);
  };

  const filteredProducts = useMemo(
    () =>
      products.filter((product) =>
        checked.length > 0
          ? product.category && checked.includes(product.category._id)
          : true
      ),
    [products, checked]
  );

  useEffect(() => {
    getAllCategory();
  }, []);

  useEffect(() => {
    getAllProducts();
  }, []);

  return (
    <Layout>
      <Grid className={styles.banner}>
        <SwipeableTextMobileStepper />
      </Grid>
      <Grid container className={styles.Main_Grid}>
        <Grid className={styles.Left_Side} item xs={12} sm={12} md={12} lg={12}>
          <p className={styles.Filter_Heading}>Filter By Category</p>
          <Grid container data-aos="fade-right" className={styles.List_div}>
            {categories.map((c) => (
              <Grid item xs={12} sm={6} md={2}>
                <Checkbox
                  key={c._id}
                  checked={checked.includes(c._id)}
                  onChange={(e) => handleFilter(e.target.checked, c._id)}
                >
                  {c.name}
                </Checkbox>
              </Grid>
            ))}
          </Grid>
          <div className={styles.Reset_Grid}>
            <button
              className={styles.Reset_btn}
              onClick={() => window.location.reload()}
            >
              Reset Filter
            </button>
          </div>
        </Grid>
        <Grid className={styles.Right_Side} item xs={12} sm={12} md={12} lg={12}>
          <h1 className={styles.All_Product}>All Products</h1>
          <Grid container spacing={2} className={styles.Product_View_Div}>
            {filteredProducts.map((product) => (
              <Grid item xs={12} sm={6} md={3} lg={3} key={product._id}>
                <div className={styles.Product_Card}>
                  <Box className={styles.img_Box}>
                    <img
                      src={`/api/v1/product/product-photo/${product._id}`}
                      className={styles.Product_Img}
                      alt={product.name}
                    />
                  </Box>
                  <div className={styles.Products_Body}>
                    <h5 className={styles.Product_Name}>
                      {product.name.length > 20
                        ? `${product.name.substring(0, 20)}...`
                        : product.name}
                    </h5>
                    <p className={styles.Product_Description}>
                      {product.description.substring(0, 20)}...
                    </p>
                    <p className={styles.Product_Price}>₹ {product.price}</p>
                    <div className={styles.btn_div}>
                      <button
                        className={styles.MoreDetails_Btn}
                        onClick={() => navigate(`/product/${product.slug}`)}
                      >
                        More Detail
                      </button>
                      <button
                        className={styles.AddToCart_Btn}
                        onClick={() => {
                          const updatedCart = [...cart];
                          localStorage.setItem(
                            "cart",
                            JSON.stringify([...cart, product])
                          );
                          const productIndex = updatedCart.findIndex(
                            (item) => item._id === product._id
                          );

                          if (productIndex === -1) {
                            updatedCart.push({ ...product, quantity: 1 });
                          } else {
                            updatedCart[productIndex].quantity += 1;
                          }

                          setCart(updatedCart);
                          toast.success("Item Added to Cart");
                        }}
                      >
                        ADD TO CART
                      </button>
                    </div>
                  </div>
                </div>
              </Grid>
            ))}
          </Grid>
          {/* {products.length > 6 && products.length < total && (
            <div className={styles.Load_More_Container}>
              <button
                className={styles.Load_More_Btn}
                onClick={(e) => {
                  e.preventDefault();
                  setPage((prevPage) => prevPage + 1);
                }}
              >
                {loading ? "Loading..." : "Load More"}
              </button>
            </div>
          )} */}
        </Grid>
      </Grid>
    </Layout>
  );
};

export default HomePage;
