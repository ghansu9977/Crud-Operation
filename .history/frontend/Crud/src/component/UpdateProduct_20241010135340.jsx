import React, { useEffect, useState } from 'react';
import { Button, Form, Container, Row, Col, Spinner } from 'react-bootstrap';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
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
        <div>
            <Container>
                <Row className="justify-content-center">
                    <Col md={6}>
                        <h2 className="text-center mb-4 text-white mt-5">Update Product</h2>
                        <Form onSubmit={handleSubmit} className="shadow p-4 rounded bg-light mt-5">
                            <Form.Group className="mb-3" controlId="formProductName">
                                <Form.Label>Product Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter product name"
                                    value={pname}
                                    onChange={(e) => setpName(e.target.value)}
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formPrice">
                                <Form.Label>Price</Form.Label>
                                <Form.Control
                                    type="number"
                                    placeholder="Enter price"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formDescription">
                                <Form.Label>Description</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    placeholder="Enter description"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    required
                                />
                            </Form.Group>

                            <div className='d-flex justify-content-center'>
                                <Button
                                    variant="primary"
                                    type="submit"
                                    disabled={loading}
                                    className="w-40 me-2"
                                    style={{ width: "30%", height: "40px" }}
                                >
                                    {loading ? (
                                        <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                                    ) : 'Update Product'}
                                </Button>

                                <Button
                                    variant="secondary"
                                    type="button"
                                    onClick={handleBack}
                                    className="w-40"
                                    style={{ width: "30%", height: "40px" }}
                                >
                                    Back
                                </Button>
                            </div>

                        </Form>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default UpdateProduct;
