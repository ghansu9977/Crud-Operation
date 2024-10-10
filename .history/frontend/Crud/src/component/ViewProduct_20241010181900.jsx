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
    MenuItem,
    Select,
    InputLabel,
    FormControl,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    InputAdornment,
    Grid
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { setLoading, setProducts, setError, deleteProduct } from '../component/productActions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { faPlus, faSearch } from '@fortawesome/free-solid-svg-icons';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const ViewProduct = () => {
    const dispatch = useDispatch();
    const { items, loading, error } = useSelector(state => state.products);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [searchTerm, setSearchTerm] = useState("");
    const [file, setFile] = useState(null);
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
        } finally {
            dispatch(setLoading(false));
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

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleFileUpload = async () => {
        if (!file) {
            Swal.fire('Error', 'Please select a file to upload.', 'error');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            await axios.post('http://localhost:3000/xls', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            Swal.fire('Success', 'File uploaded successfully!', 'success');
            fetchData(); // Fetch updated data after upload
        } catch (error) {
            Swal.fire('Error', 'Failed to upload file. Please try again.', 'error');
        } finally {
            setFile(null); // Clear the file input
        }
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;

    const filteredItems = items.filter(item =>
        item.pname.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

    return (
        <div className="container mt-4">
            {loading && (
                <div className="text-center">
                    <CircularProgress />
                </div>
            )}

            {error && <Alert severity="error">{error}</Alert>}

            {!loading && !error && (
                <>
                    <h2 className="mb-0 text-center p-3 rounded">Product List</h2>
                    <Grid container spacing={2} justifyContent="space-between" alignItems="center" mb={3}>
                        <Grid item>
                            <Button variant="contained" color="success" onClick={addProduct}>
                                <FontAwesomeIcon icon={faPlus} className="me-1" />
                                Add Product
                            </Button>
                            <Button
                                component="label"
                                variant="contained"
                                startIcon={<CloudUploadIcon />}
                                sx={{ ml: 2 }}
                            >
                                Upload Files
                                <input
                                    type="file"
                                    onChange={handleFileChange}
                                    hidden
                                    accept=".xls,.xlsx" // Optional: Restrict file types
                                />
                                <Button onClick={handleFileUpload} variant="contained" sx={{ ml: 1 }} style={{bg}}>
                                    Submit
                                </Button>
                            </Button>
                        </Grid>
                        <Grid item>
                            <TextField
                                placeholder="Search products..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                variant="outlined"
                                size="small"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <FontAwesomeIcon icon={faSearch} style={{ color: '#999' }} />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>
                    </Grid>

                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell align="center" sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Product Name</TableCell>
                                    <TableCell align="center" sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Price</TableCell>
                                    <TableCell align="center" sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Description</TableCell>
                                    <TableCell align="center" sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {currentItems.map((item) => (
                                    <TableRow key={item._id}>
                                        <TableCell align="center">{item.pname}</TableCell>
                                        <TableCell align="center">${item.price.toFixed(2)}</TableCell>
                                        <TableCell align="center">{item.description}</TableCell>
                                        <TableCell align="center">
                                            <Button variant="contained" color="info" className="me-1" onClick={() => navigate(`/view-product/${item._id}`)}>
                                                <FontAwesomeIcon icon={faEye} style={{ color: '#fff' }} className="me-1" />
                                                View
                                            </Button>
                                            <Button variant="contained" color="success" className="me-1" onClick={() => updateProduct(item._id)}>
                                                <FontAwesomeIcon icon={faEdit} style={{ color: '#fff' }} className="me-1" />
                                                Update
                                            </Button>
                                            <Button variant="contained" color="error" onClick={() => handleDelete(item._id)}>
                                                <FontAwesomeIcon icon={faTrash} className="me-1" />
                                                Delete
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <Grid container justifyContent="space-between" alignItems="center" mt={3}>
                        <FormControl variant="outlined" size="small" sx={{ minWidth: 120, mr: 2 }}>
                            <InputLabel id="itemsPerPage">Items per page</InputLabel>
                            <Select
                                labelId="itemsPerPage"
                                value={itemsPerPage}
                                onChange={(e) => {
                                    setItemsPerPage(e.target.value);
                                    setCurrentPage(1);
                                }}
                            >
                                {[5, 10, 15, 20].map((num) => (
                                    <MenuItem key={num} value={num}>{num}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <Pagination
                            count={totalPages}
                            page={currentPage}
                            onChange={(event, value) => setCurrentPage(value)}
                            color="primary"
                        />
                    </Grid>
                </>
            )}
        </div>
    );
};

export default ViewProduct;
