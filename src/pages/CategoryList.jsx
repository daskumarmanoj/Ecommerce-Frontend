import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../components/layouts/Layout";
import axios from "axios";
import styles from "./CategoryList.module.css";

const CategoryList = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState([]);
  const [category, setCategory] = useState([]);

  useEffect(() => {
    if (params?.slug) getProductByCat();
  }, [params?.slug]);

  const getProductByCat = async () => {
    try {
      const { data } = await axios.get(
        `/api/v1/product/product-category/${params.slug}`
      );
      setProduct(data?.products);
      setCategory(data?.category);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Layout>
      <div className={styles.Main_Grid}>
        <h4 className="text-center">Category - {category?.name}</h4>
        <h6 className="text-center">
          {product?.length} result{product.length !== 1 ? "s" : ""} found
        </h6>
        <div className="row">
          <div className="d-flex flex-wrap">
            {product.map((product) => (
              <div
                key={product._id}
                className="card m-2"
                style={{ width: "18rem" }}
              >
                <img
                  src={`/api/v1/product/product-photo/${product._id}`}
                  className="card-img-top"
                  alt={product.name}
                />
                <div className="card-body">
                  <h5 className="card-title">{product.name}</h5>
                  <p className="card-text">
                    {product.description.substring(0, 30)}...
                  </p>
                  <p className="card-text">${product.price}</p>
                  <button
                    className="btn btn-primary ms-1"
                    onClick={() => navigate(`/product/${product.slug}`)}
                  >
                    More Detail
                  </button>
                  <button className="btn btn-secondary ms-1">
                    ADD TO CART
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CategoryList;
