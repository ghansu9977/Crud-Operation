import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { Button, Table, CircularProgress, Alert, Pagination, TextField, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { setLoading, setProducts, setError, deleteProduct } from '../component/productActions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { faPlus, faFileExcel, faSearch } from '@fortawesome/free-solid-svg-icons';

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

    const UploadExcel = () => {
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
                    <div className='d-flex justify-content-between align-items-center mb-3'>
                        <Button variant="contained" color="success" onClick={addProduct} className="me-2">
                            <FontAwesomeIcon icon={faPlus} className="me-1" />
                            Add Product
                        </Button>
                        <Button variant="contained" color="default" onClick={UploadExcel}>
                            <FontAwesomeIcon icon={faFileExcel} className="me-1" />
                            Upload Excel File
                        </Button>
                        <div style={{ position: 'relative', display: 'inline-block' }}>
                            <TextField
                                placeholder="Search products..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                InputProps={{
                                    startAdornment: (
                                        <FontAwesomeIcon icon={faSearch} style={{ position: 'absolute', left: '10px', color: '#999' }} />
                                    ),
                                }}
                                variant="outlined"
                                size="small"
                                sx={{ ml: 2 }}
                            />
                        </div>
                    </div>

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
                                        <Button variant="contained" color="secondary" className="me-1" onClick={() => navigate(`/view-product/${item._id}`)}>
                                            <FontAwesomeIcon icon={faEye} />
                                            View
                                        </Button>
                                        <Button variant="contained" color="success" className="me-1" onClick={() => updateProduct(item._id)}>
                                            <FontAwesomeIcon icon={faEdit} />
                                            Update
                                        </Button>
                                        <Button variant="contained" color="error" onClick={() => handleDelete(item._id)}>
                                            <FontAwesomeIcon icon={faTrash} />
                                            Delete
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>

                    <div className="d-flex justify-content-between align-items-center mb-3">
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
                    </div>
                </>
            )}
        </div>
    );
};

export default ViewProduct;
