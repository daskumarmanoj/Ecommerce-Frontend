import React, { useState, useEffect } from "react";
import Layout from "../../components/layouts/Layout";
import UserMenu from "../../components/layouts/UserMenu";
import axios from "axios";
import { useAuth } from "../../context/auth";
import moment from "moment/moment";
import styles from "./Order.module.css";
import { Grid, Card, CardContent, Table, TableBody, TableCell, TableHead, TableRow, Container } from "@mui/material";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [auth, setAuth] = useAuth();

  const getOrders = async () => {
    try {
      const { data } = await axios.get("/api/v1/auth/orders");
      setOrders(data);
    } catch (error) {
      console.error(error.response.data); // Log the error response from the API
    }
  };

  useEffect(() => {
    if (auth?.token) getOrders();
  }, [auth?.token]);

  return (
    <Layout>
      <Grid container className={styles.Main_Grid} spacing={2}>
        <Grid item xs={12} md={3} className={styles.Left_Grid}>
          <UserMenu />
        </Grid>
        <Grid item xs={12} md={9} className={styles.Right_Grid}>
          <p className="text-center" style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>All Orders</p>
          {orders?.map((o, i) => (
            <Card key={o._id} variant="outlined" className="mb-3">
              <CardContent>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>#</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Buyer</TableCell>
                      <TableCell>Orders</TableCell>
                      <TableCell>Payment</TableCell>
                      <TableCell>Quantity</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>{i + 1}</TableCell>
                      <TableCell>{o?.status}</TableCell>
                      <TableCell>{o?.buyer?.name}</TableCell>
                      <TableCell>{moment(o?.createdAt).fromNow()}</TableCell>
                      <TableCell>{o?.payment.success ? "Success" : "Failed"}</TableCell>
                      <TableCell>{o?.products?.length}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
                <Container>
                  {o?.products?.map((product) => (
                    <Card key={product._id} className="m-2 p-3" style={{ display: "flex", flexDirection: "row" }}>
                      <div className={styles.imageContainer}>
                        <img
                          src={`/api/v1/product/product-photo/${product._id}`}
                          alt={product.name}
                          className={styles.productImage}
                        />
                      </div>
                      <CardContent>
                        <p style={{ fontSize: '18px', fontWeight: 'bold' }}>{product.name}</p>
                        <p>{product.description.substring(0, 30)}</p>
                        <p>Price: {product.price}</p>
                      </CardContent>
                    </Card>
                  ))}
                </Container>
              </CardContent>
            </Card>
          ))}
        </Grid>
      </Grid>
    </Layout>
  );
};

export default Orders;
