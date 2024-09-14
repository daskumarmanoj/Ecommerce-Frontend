import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import AdminMenu from "../../components/layouts/AdminMenu";
import Layout from "../../components/layouts/Layout";
import { useAuth } from "../../context/auth";
import moment from "moment";
import { Select } from "antd";
import styles from "./AdminOrder.module.css"
import { Grid } from "@mui/material";

const AdminOrder = () => {
  const [status, setStatus] = useState([
    "Not Process",
    "Processing",
    "Shipped",
    "Delivered",
    "Cancel",
  ]);
  const [changeStatus, setChangeStatus] = useState("");
  const [orders, setOrders] = useState([]);
  const [auth, setAuth] = useAuth();

  const getOrders = async () => {
    try {
      const { data } = await axios.get("/api/v1/auth/all-orders");
      if (data.success) {
        setOrders(data.orders);
      } else {
        setOrders([]);
        console.error("No orders found");
      }
    } catch (error) {
      console.error(
        "Error fetching orders:",
        error.response ? error.response.data : error.message
      );
      setOrders([]);
    }
  };

  useEffect(() => {
    if (auth?.token) getOrders();
  }, [auth?.token]);

  return (
    <Layout>
      <Grid container className={styles.Main_Grid}>
        <Grid item xs={12} sm={12} md={3} lg={3} className={styles.Left_Grid}>
          <AdminMenu />
        </Grid>
        <Grid item xs={12} sm={12} md={8} lg={8} className={styles.Right_Grid}>
          <h1 className="text-center">All Orders</h1>
          {orders.length === 0 ? (
            <p className="text-center">No orders available</p>
          ) : (
            orders.map((o, i) => (
              <div key={o._id} className="border shadow mb-4">
                <table className="table">
                  <thead>
                    <tr>
                      <th scope="col">#</th>
                      <th scope="col">Status</th>
                      <th scope="col">Buyer</th>
                      <th scope="col">Orders</th>
                      <th scope="col">Payment</th>
                      <th scope="col">Quantity</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{i + 1}</td>
                      <td>
                        <Select
                          bordered={false}
                          onChange={(value) => setChangeStatus(value)}
                          defaultValue={o?.status}
                          style={{ width: 120 }}
                        >
                          {status.map((s, index) => (
                            <Select.Option key={index} value={s}>
                              {s}
                            </Select.Option>
                          ))}
                        </Select>
                      </td>
                      <td>{o?.buyer?.name}</td>
                      <td>{moment(o?.createdAt).fromNow()}</td>
                      <td>{o?.payment.success ? "Success" : "Failed"}</td>
                      <td>{o?.products?.length}</td>
                    </tr>
                  </tbody>
                </table>
                <div className="container">
                  <div className="col-md-8">
                    {o?.products?.map((product, index) => (
                      <div
                        key={product._id}
                        className="row m-2 p-3 card flex-row"
                      >
                        <div className="col-md-4">
                          <img
                            src={`/api/v1/product/product-photo/${product._id}`}
                            className="card-img-top"
                            alt={product.name}
                            width="100px"
                            height="150px"
                          />
                        </div>
                        <div className="col-md-4">
                          <h4>{product.name}</h4>
                          <p>{product.description.substring(0, 30)}</p>
                          <p>Price: {product.price}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))
          )}
        </Grid>
      </Grid>
    </Layout>
  );
};

export default AdminOrder;
