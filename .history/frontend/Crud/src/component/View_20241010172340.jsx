import React, { useEffect, useState } from 'react';
import { Button, Container, Grid, Typography, CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

function ViewProductDetail() {
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProductDetail = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/view/${id}`);
                setProduct(response.data);
            } catch (err) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Failed to fetch product details.',
                });
            } finally {
                setLoading(false);
            }
        };

        fetchProductDetail();
    }, [id]);

    const handleBack = () => {
        navigate('/');
    };

    if (loading) {
        return (
            <Container className="text-center mt-5">
                <CircularProgress />
            </Container>
        );
    }

    if (!product) {
        return (
            <Container className="mt-5">
                <Typography variant="h5" align="center">
                    Product Not Found
                </Typography>
            </Container>
        );
    }

    return (
        <Container className="mt-5">
            <Grid container justifyContent="center" sx={{ mt: 5 }}>
                <Grid item md={6} sx={{ mt: 5 }}>
                    <Paper elevation={3} sx={{ padding: 4 }}>
                        <Button variant="outlined" onClick={handleBack} sx={{ mb: 2 }}>
                            <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
                            Back
                        </Button>
                        <Typography variant="h4" align="center" gutterBottom>
                            Product Details
                        </Typography>
                        <TableContainer component={Paper}>
                            <Table>
                                <TableBody>
                                    <TableRow>
                                        <TableCell><strong>Product Name</strong></TableCell>
                                        <TableCell>{product.pname}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell><strong>Price</strong></TableCell>
                                        <TableCell>${product.price.toFixed(2)}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell><strong>Description</strong></TableCell>
                                        <TableCell>{product.description}</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
}

export default ViewProductDetail;
