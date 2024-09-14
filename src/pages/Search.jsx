import React from "react";
import Layout from "../components/layouts/Layout";
import { useSearch } from "../context/search";

const Search = () => {
  const [values] = useSearch();
  console.log('Search Values:', values); // Debugging log

  return (
    <Layout>
      <div className="container">
        <div className="text-center">
          <h1>Search Results</h1>
          <h6>
            {values?.results.length < 1
              ? "No Product Found"
              : `Found ${values?.results.length}`}
          </h6>
          <div className="d-flex flex-wrap mt-4">
            {values?.results.map((product) => (
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
                  <button className="btn btn-primary ms-1">More Detail</button>
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

export default Search;
