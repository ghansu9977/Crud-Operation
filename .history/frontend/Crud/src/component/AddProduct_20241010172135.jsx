import React, { useState } from 'react';
import { Button, TextField, Container, Grid, Typography, CircularProgress, Alert, Box } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

function AddProduct() {
  const [pname, setpName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const newItem = { pname, price, description };
      await axios.post('http://localhost:3000/add', newItem);

      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Product added successfully!',
      });

      setpName("");
      setPrice("");
      setDescription("");
      navigate("/"); 
    } catch (err) {
      setError("Failed to add product. Please try again.");
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to add product. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate(-1); 
  };

  return (
    <Container>
      <Grid container spacing={2} justifyContent="center" sx={{ mt: 5 }}>
        <Grid item xs={12} md={6}>
          <Typography variant="h4" align="center" color="white" gutterBottom>
            Add Product
          </Typography>
          
          {error && <Alert severity="error">{error}</Alert>}

          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              backgroundColor: '#f5f5f5',
              padding: '16px',
              borderRadius: '8px',
              boxShadow: 3, // This adds the shadow
            }}
          >
            <TextField
              label="Product Name"
              variant="outlined"
              fullWidth
              margin="normal"
              value={pname}
              onChange={(e) => setpName(e.target.value)}
              required
              error={!!error}
            />

            <TextField
              label="Price"
              type="number"
              variant="outlined"
              fullWidth
              margin="normal"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
              error={!!error}
            />

            <TextField
              label="Description"
              variant="outlined"
              fullWidth
              margin="normal"
              multiline
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              error={!!error}
            />

            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '16px' }}>
              <Button
                variant="contained"
                color="primary"
                type="submit"
                disabled={loading}
                style={{ marginRight: '8px' }}
              >
                {loading ? <CircularProgress size={24} /> : 'Add Product'}
              </Button>

              <Button
                variant="outlined"
                color="secondary"
                onClick={handleBack}
              >
                Back
              </Button>
            </div>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}

export default AddProduct;
