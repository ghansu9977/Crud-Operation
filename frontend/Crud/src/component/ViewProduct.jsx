import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { Button, Table, Spinner, Alert, Pagination, Form, Dropdown } from 'react-bootstrap';
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

    const renderPaginationItems = (totalPages, currentPage, setCurrentPage) => {
        const pageNumbers = [];

        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
                pageNumbers.push(i);
            } else if (pageNumbers[pageNumbers.length - 1] !== '...') {
                pageNumbers.push('...'); // Add ellipsis
            }
        }

        return pageNumbers.map((page, index) => (
            <Pagination.Item
                key={index}
                active={page === currentPage}
                onClick={() => typeof page === 'number' && setCurrentPage(page)}
                disabled={page === '...'}
            >
                {page}
            </Pagination.Item>
        ));
    };

    return (
        <div className="container mt-4">
            {loading && (
                <div className="text-center">
                    <Spinner animation="border" />
                </div>
            )}

            {error && <Alert variant="danger">{error}</Alert>}

            {!loading && !error && (
                <>
                    <h2 className="mb-0 text-center p-3 rounded">Product List</h2>
                    <div className='d-flex justify-content-between align-items-center mb-3'>
                        <Button variant="success" onClick={addProduct} className="me-2">
                            <FontAwesomeIcon icon={faPlus} className="me-1" />
                            Add Product
                        </Button>
                        <Button variant="dark" onClick={UploadExcel} style={{ marginLeft: "-530px" }}>
                            <FontAwesomeIcon icon={faFileExcel} className="me-1" />
                            Upload Excel File
                        </Button>
                        <div className="search-wrapper" style={{ position: 'relative', display: 'inline-block' }}>
                            <FontAwesomeIcon
                                icon={faSearch}
                                className="search-icon"
                                style={{ position: 'absolute', left: '25px', top: '50%', transform: 'translateY(-50%)', color: '#999' }}
                            />
                            <Form.Control
                                type="text"
                                placeholder="Search products..." 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="ms-3"
                                style={{ width: '250px', paddingLeft: '30px' }} 
                            />
                        </div>
                    </div>

                    <Table striped bordered hover responsive>
                        <thead className="bg-light text-center">
                            <tr>
                                <th>Product Name</th>
                                <th>Price</th>
                                <th>Description</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody className='text-center'>
                            {currentItems.map((item) => (
                                <tr key={item._id}>
                                    <td>{item.pname}</td>
                                    <td>${item.price.toFixed(2)}</td>
                                    <td>{item.description}</td>
                                    <td>
                                        <Button variant="secondary" className="me-1" onClick={() => navigate(`/view-product/${item._id}`)}>
                                            <FontAwesomeIcon icon={faEye} style={{ color: '#fff' }} className="me-1" />
                                            View
                                        </Button>
                                        <Button variant="success" className="me-1" onClick={() => updateProduct(item._id)}>
                                            <FontAwesomeIcon icon={faEdit} style={{ color: '#fff' }} className="me-1" />
                                            Update
                                        </Button>
                                        <Button variant="danger" onClick={() => handleDelete(item._id)}>
                                            <FontAwesomeIcon icon={faTrash} className="me-1" />
                                            Delete
                                        </Button>
                                    </td>

                                </tr>
                            ))}
                        </tbody>
                    </Table>

                    <div className="d-flex justify-content-between align-items-center mb-3">

                        <Form.Group controlId="itemsPerPage" className="mb-0 me-3 d-flex">
                            <Form.Label className="me-2 mt-auto">Items per page :</Form.Label>
                            <Dropdown>
                                <Dropdown.Toggle variant="light" id="dropdown-basic">
                                    {itemsPerPage}
                                </Dropdown.Toggle>

                                <Dropdown.Menu style={{ maxHeight: '100px', overflowY: 'auto' }}>
                                    {[5, 10, 15, 20].map((num) => (
                                        <Dropdown.Item key={num} onClick={() => {
                                            setItemsPerPage(num);
                                            setCurrentPage(1);
                                        }}>
                                            {num}
                                        </Dropdown.Item>
                                    ))}
                                </Dropdown.Menu>
                            </Dropdown>
                        </Form.Group>

                        <Pagination className="mb-0">
                            <Pagination.Prev onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1} />
                            {renderPaginationItems(totalPages, currentPage, setCurrentPage)}
                            <Pagination.Next onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} />
                        </Pagination>
                    </div>
                </>
            )}
        </div>
    );
};

export default ViewProduct;
