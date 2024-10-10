import React, { useEffect, useState } from 'react';
import { Button, Container, Row, Col, Spinner, Table } from 'react-bootstrap';
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
                <Spinner animation="border" />
            </Container>
        );
    }

    if (!product) {
        return (
            <Container className="mt-5">
                <h2 className="text-center">Product Not Found</h2>
            </Container>
        );
    }

    return (
        <Container className="mt-5" style={{ height: "550px" }}>
            <Row className="justify-content-center mt-5">
                <Col md={6} style={{ marginTop: "100px" }}>
                    <div className="shadow p-4 rounded bg-white">
                 
                            <Button variant="secondary" onClick={handleBack}>
                                <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
                               
                            </Button>
                 
                        <h2 className="text-center mb-4">Product Details</h2>
                        <Table striped bordered hover>
                            <tbody>
                                <tr>
                                    <th>Product Name</th>
                                    <td>{product.pname}</td>
                                </tr>
                                <tr>
                                    <th>Price</th>
                                    <td>${product.price.toFixed(2)}</td>
                                </tr>
                                <tr>
                                    <th>Description</th>
                                    <td>{product.description}</td>
                                </tr>
                            </tbody>
                        </Table>
                       
                    </div>
                </Col>
            </Row>
        </Container>
    );
}

export default ViewProductDetail;
