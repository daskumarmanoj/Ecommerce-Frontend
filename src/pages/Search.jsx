import React from "react";
import Layout from "../components/layouts/Layout";
import { useSearch } from "../context/search";
import { useNavigate } from "react-router-dom";
import { Grid, Box, Button, Typography, Card, CardContent, CardActions } from "@mui/material";

const Search = () => {
  const [values] = useSearch();
  const navigate = useNavigate();

  return (
    <Layout>
      <Box className="container" sx={{ mt: 4, padding: 2 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Search Results
        </Typography>
        <Typography variant="subtitle1" align="center" sx={{ mb: 4 }}>
          {values?.results.length < 1
            ? "No Product Found"
            : `Found ${values?.results.length} Product(s)`}
        </Typography>
        <Grid container spacing={3}>
          {values?.results.map((product) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={product._id}>
              <Card sx={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", height: "100%" }}>
                <Box
                  component="img"
                  src={`/api/v1/product/product-photo/${product._id}`}
                  alt={product.name}
                  sx={{
                    height: 200,
                    objectFit: "cover",
                    width: "80%",
                    padding: 2,
                    filter: "drop-shadow(10px 10px 10px rgba(0, 0, 0, 0.3))",
                  }}
                />

                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {product.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {product.description.substring(0, 30)}...
                  </Typography>
                  <Typography variant="body1" color="primary">
                    ${product.price}
                  </Typography>
                </CardContent>
                <CardActions sx={{ mt: "auto" }}>
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={() => navigate(`/product/${product.slug}`)}
                  >
                    More Detail
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Layout>
  );
};

export default Search;
