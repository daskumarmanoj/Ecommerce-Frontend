import React, { useState, useEffect } from "react";
import Layout from "../components/layouts/Layout";
import { useCart } from "../context/Cart";
import { useAuth } from "../context/auth";
import { useNavigate } from "react-router-dom";
import DropIn from "braintree-web-drop-in-react";
import axios from "axios";
import toast from "react-hot-toast";
import { Grid } from "@mui/material";
import styles from "./CartPage.module.css";
import jsPDF from "jspdf";
import QRCode from "qrcode";

const CartPage = () => {
  const [auth] = useAuth();
  const [cart, setCart] = useCart();
  const [clientToken, setClientToken] = useState("");
  const [instance, setInstance] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const totalPrice = () => {
    try {
      let total = 0;
      cart?.forEach((item) => {
        total += item.price;
      });
      return total.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      });
    } catch (error) {
      console.error(error);
      return "$0.00";
    }
  };

  const removeCartItem = (pid) => {
    try {
      const myCart = cart.filter((item) => item._id !== pid);
      setCart(myCart);
      localStorage.setItem("cart", JSON.stringify(myCart));
    } catch (error) {
      console.error(error);
    }
  };

  const getToken = async () => {
    try {
      const { data } = await axios.get("/api/v1/product/braintree/token");
      setClientToken(data?.clientToken);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getToken();
  }, [auth?.token]);

  const createBill = async (productId) => {
    const doc = new jsPDF();

    // Generate Bill Number
    const billNumber = `BILL-${new Date().getTime()}`;

    // Create a string with all the product details
    const productDetails = cart
      .filter((product) => !productId || product._id === productId)
      .map((product, index) => {
        return `${index + 1}. ${product.name} - ${product.price.toLocaleString("en-US", {
          style: "currency",
          currency: "USD",
        })}`;
      })
      .join("\n");

    // Combine bill number and product details for QR code
    const qrCodeText = `Bill No: ${billNumber}\nCustomer: ${auth?.user?.name}\nEmail: ${auth?.user?.email || "N/A"}\nAddress: ${auth?.user?.address || "N/A"}\n\nProducts:\n${productDetails}\n\nTotal: ${totalPrice()}`;

    // Generate QR Code
    const qrCodeDataURL = await QRCode.toDataURL(qrCodeText);

    // Add styles
    const titleFont = "Helvetica";
    const bodyFont = "Arial";
    const titleColor = "#333";
    const bodyColor = "#555";

    // Title
    doc.setFont(titleFont, "bold");
    doc.setTextColor(titleColor);
    doc.setFontSize(20);
    doc.text("Bill Summary", 10, 10);

    // Bill Number
    doc.setFontSize(14);
    doc.setFont(bodyFont);
    doc.setTextColor(bodyColor);
    doc.text(`Bill No: ${billNumber}`, 10, 20);

    // QR Code
    doc.addImage(qrCodeDataURL, "PNG", 150, 10, 40, 40);

    // Buyer Details
    doc.setFontSize(14);
    doc.setFont(bodyFont);
    doc.setTextColor(bodyColor);
    doc.text(`Customer: ${auth?.user?.name}`, 10, 40);
    doc.text(`Email: ${auth?.user?.email || "N/A"}`, 10, 50);
    doc.text(`Address: ${auth?.user?.address || "N/A"}`, 10, 60);

    // Separator Line
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.5);
    doc.line(10, 65, 200, 65);

    // Products
    doc.text("Products:", 10, 75);
    for (let index = 0; index < cart.length; index++) {
      const product = cart[index];
      if (productId && product._id !== productId) continue; // Skip if not matching the selected product

      const productImageURL = `/api/v1/product/product-photo/${product._id}`;

      // Convert the product image to black and white
      const productImage = new Image();
      productImage.src = productImageURL;
      await new Promise((resolve) => {
        productImage.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          canvas.width = productImage.width;
          canvas.height = productImage.height;
          ctx.drawImage(productImage, 0, 0);
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          for (let i = 0; i < imageData.data.length; i += 4) {
            const avg = (imageData.data[i] + imageData.data[i + 1] + imageData.data[i + 2]) / 3;
            imageData.data[i] = avg;
            imageData.data[i + 1] = avg;
            imageData.data[i + 2] = avg;
          }
          ctx.putImageData(imageData, 0, 0);
          const blackAndWhiteImageURL = canvas.toDataURL("image/png");
          doc.addImage(blackAndWhiteImageURL, "PNG", 10, 85 + index * 40, 40, 40);
          resolve();
        };
      });

      doc.text(
        `${index + 1}. ${product.name} - ${product.price.toLocaleString("en-US", {
          style: "currency",
          currency: "USD",
        })}`,
        60,
        95 + index * 40
      );
    }

    // Total Price
    doc.text(`Total: ${totalPrice()}`, 10, 85 + cart.length * 40);

    // Footer
    doc.setFontSize(10);
    doc.text("Thank you for your purchase!", 10, 95 + cart.length * 40);

    // Save the document
    doc.save("bill.pdf");
  };

  const handlePayment = async () => {
    try {
      setLoading(true);
      const { nonce } = await instance.requestPaymentMethod();
      const { data } = await axios.post("/api/v1/product/braintree/payment", {
        nonce,
        cart,
      });
      setLoading(false);
      localStorage.removeItem("cart");
      setCart([]);
      await createBill();
      navigate("/dashboard/user/orders");
      toast.success("Payment Completed Successfully");
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  return (
    <Layout>
      <Grid className={styles.Main_Grid}>
        <Grid item xs={12} sm={12} md={12} lg={12} className={styles.Left_Grid}>
          <h1 className="text-center bg-light p-2 mb-2">
            {`Hello ${auth?.token && auth?.user?.name}`}
          </h1>
          <p className="text-center">
            {cart?.length > 0
              ? `You Have ${cart.length} items in Your Cart ${
                  auth?.token ? "" : "Please Login to Check Out"
                }`
              : "Your CART Is Empty"}
          </p>
        </Grid>
        <Grid
          container
          item
          xs={12}
          sm={12}
          md={12}
          lg={12}
          className={styles.Right_Grid}
        >
          <Grid
            item
            xs={12}
            sm={12}
            md={7}
            lg={7}
            container
            className={styles.Cart_Grid}
          >
            {cart?.map((product) => (
              <Grid
                container
                item
                xs={12}
                sm={12}
                md={12}
                lg={12}
                key={product._id}
                className={styles.cart}
              >
                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={6}
                  lg={6}
                  className={styles.img_div}
                >
                  <img
                    src={`/api/v1/product/product-photo/${product._id}`}
                    className="card-img-top"
                    alt={product.name}
                    width="100px"
                    height="150px"
                  />
                </Grid>
                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={6}
                  lg={6}
                  className={styles.details_div}
                >
                  <h4>{product.name}</h4>
                  <p>{product.description.substring(0, 30)}</p>
                  <p>Price: {product.price}</p>
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() => removeCartItem(product._id)}
                  >
                    Remove
                  </button>
                  {/* <button
                    type="button"
                    className="btn btn-outline-primary mt-2"
                    onClick={() => createBill(product._id)}
                  >
                    Download Bill Again
                  </button> */}
                </Grid>
              </Grid>
            ))}
          </Grid>
          <Grid
            item
            xs={12}
            sm={12}
            md={4}
            lg={4}
            className={styles.Payment_Grid}
          >
            <div className={styles.paymentSummary}>
              <h2>Cart Summary</h2>
              <p>Total | Checkout | Payment</p>
              <hr />
              <h4>Total: {totalPrice()}</h4>
              {auth?.user?.address ? (
                <div className="mb-3">
                  <h4>Current Address</h4>
                  <h5>{auth.user.address}</h5>
                  <button
                    type="button"
                    className="btn btn-outline-warning"
                    onClick={() => navigate("/dashboard/user/profile")}
                  >
                    Update Address
                  </button>
                </div>
              ) : (
                <div className="mb-3">
                  {auth?.token ? (
                    <button
                      type="button"
                      className="btn btn-outline-warning"
                      onClick={() => navigate("/dashboard/user/profile")}
                    >
                      Update Address
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="btn btn-outline-warning"
                      onClick={() =>
                        navigate("/login", {
                          state: "/cart",
                        })
                      }
                    >
                      Please Login to Checkout
                    </button>
                  )}
                </div>
              )}
              <div className="mt-2">
                {!clientToken || !cart?.length ? (
                  ""
                ) : (
                  <>
                    <DropIn
                      options={{
                        authorization: clientToken,
                        paypal: {
                          flow: "vault",
                        },
                      }}
                      onInstance={(instance) => setInstance(instance)}
                    />
                    <button
                      className="btn btn-primary"
                      onClick={handlePayment}
                      disabled={loading || !instance || !auth?.user?.address}
                    >
                      {loading ? "Processing ...." : "Make Payment"}
                    </button>
                  </>
                )}
              </div>
            </div>
          </Grid>
        </Grid>
      </Grid>
    </Layout>
  );
};

export default CartPage;
