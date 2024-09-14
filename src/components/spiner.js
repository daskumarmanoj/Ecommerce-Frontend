import React, { useEffect, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import styles from "./spiner.module.css";
import { useNavigate, useLocation } from "react-router-dom";

const Spinner = ({ path = "login" }) => {
  const [count, setCount] = useState(5);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (count === 0) {
      navigate(`/${path}`, {
        state: location.pathname,
      });
    }

    const interval = setInterval(() => {
      setCount((preValue) => preValue - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [count, navigate, location, path]);

  return (
    <div className={styles.spinner_container}>
      <h1 className={styles.loading_text}>Loading...{count}</h1>
      <CircularProgress size={50} color="primary" />
    </div>
  );
};

export default Spinner;
