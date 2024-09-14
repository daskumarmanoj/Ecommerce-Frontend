import React from "react";
import Layout from "../components/layouts/Layout";
import Styles from "./PageNotFound.module.css";

const PageNotFound = () => {
  return (
    <Layout>
      <div className={Styles.page_not_found}>
        <h1 className={Styles.title}>404</h1>
        <p className={Styles.message}>
          Oops! The page you're looking for doesn't exist.
        </p>
        <a href="/" className={Styles.home_link}>
          Go Back Home
        </a>
      </div>
    </Layout>
  );
};

export default PageNotFound;
