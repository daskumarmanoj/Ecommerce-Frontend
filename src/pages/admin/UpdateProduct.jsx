import React, { useState, useEffect } from "react";
import Layout from "../../components/layouts/Layout";
import AdminMenu from "../../components/layouts/AdminMenu";
import axios from "axios";
import toast from "react-hot-toast";
import { Grid, Button } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./UpdateProduct.module.css";

const UpdateProduct = () => {
  const navigate = useNavigate();
  const params = useParams();
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [shipping, setShipping] = useState("");
  const [photo, setPhoto] = useState(null);
  const [initialPhoto, setInitialPhoto] = useState(null);
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [id, setId] = useState("");

  // Get Single Product
  const getSingleProduct = async () => {
    try {
      const { data } = await axios.get(`/api/v1/product/get-product/${params.slug}`);
      setName(data.product.name);
      setId(data.product._id);
      setDescription(data.product.description);
      setPrice(data.product.price);
      setQuantity(data.product.quantity);
      setShipping(data.product.shipping);
      setCategory(data.product.category._id);
      setInitialPhoto(data.product.photo); // Assuming the photo URL is returned as 'photo'
    } catch (error) {
      console.log(error);
      toast.error("Error fetching product details");
    }
  };

  useEffect(() => {
    getSingleProduct();
  }, [params.slug]);

  // Get all categories
  const getAllCategory = async () => {
    try {
      const { data } = await axios.get("/api/v1/category/get-category");
      if (data?.success) {
        setCategories(data?.category);
      }
    } catch (error) {
      console.log(error);
      toast.error("Error fetching categories");
    }
  };

  useEffect(() => {
    getAllCategory();
  }, []);

  // Handle Update
  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoadingUpdate(true);
    try {
      const productData = new FormData();
      productData.append("name", name);
      productData.append("description", description);
      productData.append("price", price);
      productData.append("quantity", quantity);
      if (photo) productData.append("photo", photo);
      productData.append("category", category);
      productData.append("shipping", shipping);

      const { data } = await axios.put(`/api/v1/product/update-product/${id}`, productData);
      if (data?.success) {
        toast.success("Product updated successfully");
        navigate("/dashboard/admin/products");
      } else {
        toast.error(data?.message || "Failed to update product");
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    } finally {
      setLoadingUpdate(false);
    }
  };

  // Handle Delete
  const handleDelete = async () => {
    setLoadingDelete(true);
    try {
      let answer = window.prompt("Are you sure you want to delete the product?");
      if (!answer) return;
      const { data } = await axios.delete(`/api/v1/product/delete-product/${id}`);
      toast.success("Product Deleted Successfully");
      navigate("/dashboard/admin/products");
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    } finally {
      setLoadingDelete(false);
    }
  };

  return (
    <Layout>
      <Grid container className={styles.Main_Grid}>
        <Grid item xs={12} sm={12} md={3} lg={3}>
          <AdminMenu />
        </Grid>
        <Grid className={styles.Right_grid} item xs={12} sm={12} md={8} lg={8}>
          <h5 className={styles.Heading}>Update Product</h5>
          <form onSubmit={handleUpdate} className={styles.formContainer}>
            <div className={styles.labelInputDiv}>
              <label className={styles.lbl} htmlFor="category-select">
                Select a Category
              </label>
              <select
                id="category-select"
                className={styles.select}
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">Select a Category</option>
                {categories?.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div className={styles.labelInputDiv}>
              <label className={styles.lbl} htmlFor="photo-upload">
                Upload Photo Here
              </label>
              <input
                type="file"
                name="photo"
                accept="image/*"
                onChange={(e) => setPhoto(e.target.files[0])}
                hidden
                id="photo-upload"
              />
              <label htmlFor="photo-upload" className={styles.photoLabel}>
                {photo ? photo.name : "Choose File"}
              </label>
              {(photo || initialPhoto) && (
                <div className={styles.photoPreview}>
                  <img
                    src={photo ? URL.createObjectURL(photo) : initialPhoto}
                    alt="product_Photo"
                    className={styles.imgResponsive}
                  />
                </div>
              )}
            </div>
            <div className={styles.labelInputDiv}>
              <label className={styles.lbl} htmlFor="name">
                Enter Product Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={styles.input}
              />
            </div>
            <div className={styles.labelInputDiv}>
              <label className={styles.lbl} htmlFor="description">
                Write Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className={styles.textarea}
              ></textarea>
            </div>
            <div className={styles.labelInputDiv}>
              <label className={styles.lbl} htmlFor="price">
                Write Price
              </label>
              <input
                type="number"
                id="price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className={styles.input}
              />
            </div>
            <div className={styles.labelInputDiv}>
              <label className={styles.lbl} htmlFor="quantity">
                Enter No Of Quantity
              </label>
              <input
                type="number"
                id="quantity"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className={styles.input}
              />
            </div>
            <div className={styles.labelInputDiv}>
              <label className={styles.lbl} htmlFor="shipping-select">
                Selected Shipping
              </label>
              <select
                id="shipping-select"
                value={shipping}
                onChange={(e) => setShipping(e.target.value)}
                className={styles.select}
              >
                <option value="">Select Yes or No</option>
                <option value="0">Yes</option>
                <option value="1">No</option>
              </select>
            </div>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loadingUpdate}
              className={styles.submitButton}
            >
              {loadingUpdate ? "Updating..." : "Update Product"}
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleDelete}
              disabled={loadingDelete}
              className={styles.deleteButton}
            >
              {loadingDelete ? "Deleting..." : "Delete Product"}
            </Button>
          </form>
        </Grid>
      </Grid>
    </Layout>
  );
};

export default UpdateProduct;