import React, { useEffect, useState } from 'react';
import { Button, TextField, Container, Grid, Typography, CircularProgress, Alert, Box } from '@mui/material';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';

function UpdateProduct() {
    const [pname, setpName] = useState("");
    const [price, setPrice] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/view/${id}`);
                const product = response.data;
                setpName(product.pname);
                setPrice(product.price);
                setDescription(product.description);
            } catch (err) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Failed to fetch product details.',
                });
            }
        };

        fetchProduct();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const updatedItem = { pname, price, description };
            await axios.put(`http://localhost:3000/update/${id}`, updatedItem);
            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Product updated successfully!',
            });
            navigate("/");
        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to update product. Please try again.',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleBack = () => {
        navigate("/");
    };

    return (
        <Container>
            <Grid container spacing={2} justifyContent="center" sx={{ mt: 5 }}>
                <Grid item xs={12} md={6}>
                    <Typography variant="h4" align="center" color="white" gutterBottom>
                        Update Product
                    </Typography>

                    <Box
                        component="form"
                        onSubmit={handleSubmit}
                        sx={{
                            backgroundColor: '#f5f5f5',
                            padding: '16px',
                            borderRadius: '8px',
                            boxShadow: 3, // Shadow effect
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
                        />

                        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '16px' }}>
                            <Button
                                variant="contained"
                                color="primary"
                                type="submit"
                                disabled={loading}
                                style={{ marginRight: '8px', width: '30%' }}
                            >
                                {loading ? (
                                    <CircularProgress size={24} />
                                ) : 'Update Product'}
                            </Button>

                            <Button
                                variant="outlined"
                                color="secondary"
                                type="button"
                                onClick={handleBack}
                                style={{ width: '30%' }}
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

export default UpdateProduct;
