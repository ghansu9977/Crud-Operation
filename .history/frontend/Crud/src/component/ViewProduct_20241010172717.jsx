import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import {
    Button,
    Table,
    CircularProgress,
    Alert,
    Pagination,
    TextField,
    Grid,
    Card,
    Typography,
    IconButton,
    Menu,
    MenuItem,
    Box,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { setLoading, setProducts, setError, deleteProduct } from '../component/productActions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEdit, faTrash, faPlus, faFileExcel, faSearch } from '@fortawesome/free-solid-svg-icons';

const ViewProduct = () => {
    const dispatch = useDispatch();
    const { items, loading, error } = useSelector(state => state.products);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();
    
    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        dispatch(setLoading(true));
        try {
            const response = await axios.get('http://localhost:3000/view');
            dispatch(setProducts(response.data));
        } catch (error) {
            dispatch(setError(error.message));
        }
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "This will permanently delete the product!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!',
        });

        if (result.isConfirmed) {
            try {
                await axios.delete(`http://localhost:3000/delete/${id}`);
                dispatch(deleteProduct(id));
                Swal.fire('Deleted!', 'Product has been deleted.', 'success');
            } catch (error) {
                Swal.fire('Error', 'Failed to delete product. Please try again.', 'error');
            }
        }
    };

    const addProduct = () => {
        navigate("/Add-Product");
    };

    const updateProduct = (id) => {
        navigate(`/update-product/${id}`);
    };

    const uploadExcel = () => {
        navigate("/Upload-Excel");
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const filteredItems = items.filter(item =>
        item.pname.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

    return (
        <Box sx={{ p: 3 }}>
            {loading && (
                <div className="text-center">
                    <CircularProgress />
                </div>
            )}

            {error && <Alert severity="error">{error}</Alert>}

            {!loading && !error && (
                <>
                    <Typography variant="h4" align="center" gutterBottom>
                        Product List
                    </Typography>

                    <Grid container spacing={2} justifyContent="space-between" alignItems="center">
                        <Grid item>
                            <Button variant="contained" color="success" onClick={addProduct} startIcon={<FontAwesomeIcon icon={faPlus} />}>
                                Add Product
                            </Button>
                        </Grid>
                        <Grid item>
                            <Button variant="contained" color="primary" onClick={uploadExcel} startIcon={<FontAwesomeIcon icon={faFileExcel} />}>
                                Upload Excel File
                            </Button>
                        </Grid>
                        <Grid item>
                            <TextField
                                variant="outlined"
                                placeholder="Search products..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                InputProps={{
                                    startAdornment: (
                                        <FontAwesomeIcon icon={faSearch} style={{ marginRight: 8 }} />
                                    ),
                                }}
                            />
                        </Grid>
                    </Grid>

                    <Card sx={{ mt: 3, boxShadow: 3 }}>
                        <Table>
                            <thead>
                                <tr>
                                    <th>Product Name</th>
                                    <th>Price</th>
                                    <th>Description</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentItems.map((item) => (
                                    <tr key={item._id}>
                                        <td>{item.pname}</td>
                                        <td>${item.price.toFixed(2)}</td>
                                        <td>{item.description}</td>
                                        <td>
                                            <IconButton color="primary" onClick={() => navigate(`/view-product/${item._id}`)}>
                                                <FontAwesomeIcon icon={faEye} />
                                            </IconButton>
                                            <IconButton color="success" onClick={() => updateProduct(item._id)}>
                                                <FontAwesomeIcon icon={faEdit} />
                                            </IconButton>
                                            <IconButton color="error" onClick={() => handleDelete(item._id)}>
                                                <FontAwesomeIcon icon={faTrash} />
                                            </IconButton>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </Card>

                    <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <Typography variant="body1" component="span">Items per page:</Typography>
                            <Button onClick={() => { setItemsPerPage(5); setCurrentPage(1); }}>5</Button>
                            <Button onClick={() => { setItemsPerPage(10); setCurrentPage(1); }}>10</Button>
                            <Button onClick={() => { setItemsPerPage(15); setCurrentPage(1); }}>15</Button>
                            <Button onClick={() => { setItemsPerPage(20); setCurrentPage(1); }}>20</Button>
                        </div>

                        <Pagination
                            count={totalPages}
                            page={currentPage}
                            onChange={(event, value) => setCurrentPage(value)}
                            variant="outlined"
                            shape="rounded"
                        />
                    </Box>
                </>
            )}
        </Box>
    );
};

export default ViewProduct;
