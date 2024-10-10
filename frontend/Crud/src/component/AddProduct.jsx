import React, { useState } from 'react';
import { Button, Form, Spinner, Container, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
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
    <div>
      <Container>
        <Row className="justify-content-center">
          <Col md={6}>
            <h2 className="text-center mb-4 text-white mt-5">Add Product</h2>
            
            {error && <div className="alert alert-danger">{error}</div>}
            <Form onSubmit={handleSubmit} className="shadow p-4 rounded bg-light mt-5">
              <Form.Group className="mb-3" controlId="formProductName">
                <Form.Label>Product Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter product name"
                  value={pname}
                  onChange={(e) => setpName(e.target.value)}
                  required
                  isInvalid={!!error}
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
                  isInvalid={!!error}
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
                  isInvalid={!!error}
                />
              </Form.Group>

              <div className='d-flex justify-content-center'>
                <Button variant="primary" type="submit" disabled={loading} className="w-25 me-3">
                  {loading ? <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> : 'Add Product'}
                </Button>

                <Button variant="secondary" type="button" onClick={handleBack} className="w-25">
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

export default AddProduct;
