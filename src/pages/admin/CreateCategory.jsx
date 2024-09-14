import React, { useEffect, useState } from "react";
import Layout from "../../components/layouts/Layout";
import AdminMenu from "../../components/layouts/AdminMenu";
import toast from "react-hot-toast";
import axios from "axios";
import CategoryForm from "../../components/form/CategoryForm";
import { Modal } from "antd";
import { Grid, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from "@mui/material";
import styles from "./CreateCategory.module.css";

const CreateCategory = () => {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [visible, setVisible] = useState(false);
  const [selected, setSelected] = useState(null);
  const [updatedName, setUpdateName] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("/api/v1/category/create-category", { name });
      if (data?.success) {
        toast.success(`${name} is created`);
        getAllCategory();
        setName("");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong in input form");
    }
  };

  const getAllCategory = async () => {
    try {
      const { data } = await axios.get("/api/v1/category/get-category");
      if (data.success) {
        setCategories(data.category);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong in getting category");
    }
  };

  useEffect(() => {
    getAllCategory();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.put(`/api/v1/category/update-category/${selected._id}`, { name: updatedName });
      if (data.success) {
        toast.success(`${updatedName} is updated`);
        setSelected(null);
        setUpdateName("");
        setVisible(false);
        getAllCategory();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const handleDelete = async (pid) => {
    try {
      const { data } = await axios.delete(`/api/v1/category/delete-category/${pid}`);
      if (data.success) {
        toast.success("Category is Deleted");
        getAllCategory();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <Layout>
      <Grid container className={styles.Main_Grid}>
        <Grid item xs={12} sm={12} md={3} lg={3}>
          <AdminMenu />
        </Grid>
        <Grid className={styles.Right_Side} item xs={12} sm={12} md={8} lg={8}>
          <h4 className={styles.Heading}>
            Manage Categories
          </h4>
          <Paper className={styles.paper}>
            <CategoryForm handleSubmit={handleSubmit} value={name} setValue={setName} />
          </Paper>
          <TableContainer component={Paper} className={styles.tableContainer}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {categories?.map((e) => (
                  <TableRow key={e._id}>
                    <TableCell>{e.name}</TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => {
                          setVisible(true);
                          setUpdateName(e.name);
                          setSelected(e);
                        }}
                        className={styles.actionButton}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => handleDelete(e._id)}
                        className={styles.actionButton}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Modal onCancel={() => setVisible(false)} footer={null} visible={visible}>
            <div key={selected?._id}>
              <CategoryForm value={updatedName} setValue={setUpdateName} handleSubmit={handleUpdate} />
            </div>
          </Modal>
        </Grid>
      </Grid>
    </Layout>
  );
};

export default CreateCategory;
