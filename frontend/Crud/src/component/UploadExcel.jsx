import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Button, Form, Card, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileExcel } from '@fortawesome/free-solid-svg-icons';

const UploadExcel = () => {
    const [file, setFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile && (selectedFile.size / 1024 / 1024) > 5) { 
            Swal.fire('Error', 'File size exceeds 5 MB limit.', 'error');
            setFile(null);
        } else {
            setFile(selectedFile);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!file) {
            Swal.fire('Error', 'Please select a file to upload.', 'error');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);
        setIsLoading(true);

        try {
            await axios.post('http://localhost:3000/xls', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            Swal.fire('Success', 'File uploaded successfully.', 'success');
            setFile(null); 
        } catch (error) {
            const errorMessage = error.response?.data?.error || 'Failed to upload file. Please try again.';
            Swal.fire('Error', errorMessage, 'error');
        } finally {
            setIsLoading(false); 
        }
    };

    const handleBack = () => {
        navigate("/"); 
    };

    return (
        <div className="container mt-5 d-flex justify-content-center align-items-center" style={{ height: "90vh" }}>
            <Card className="shadow w-50 p-4">
                <Card.Title className="text-center">Upload Excel File</Card.Title>
                <div className="text-center mb-4 mt-3">
                    <FontAwesomeIcon icon={faFileExcel} size="5x" color="#2fb5a1" />
                </div>
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="formFile" className="mb-3">
                        <Form.Label>Select Excel File:</Form.Label>
                        <Form.Control
                            type="file"
                            accept=".xlsx,.xls"
                            onChange={handleFileChange}
                            required
                        />
                    </Form.Group>
                    <Row className="justify-content-center">
                        <Col className="d-flex justify-content-center">
                            <Button type="submit" variant="primary" disabled={isLoading} className="me-2" style={{ width: "40%" }}>
                                {isLoading ? 'Uploading...' : 'Upload'}
                            </Button>
                            <Button variant="secondary" disabled={isLoading} style={{ width: "40%" }} onClick={handleBack}>
                                Back
                            </Button>
                        </Col>
                    </Row>
                </Form>
                {file && (
                    <div className="mt-3 text-center">
                        <strong>Selected File:</strong> {file.name}
                    </div>
                )}
            </Card>
        </div>
    );
};

export default UploadExcel;
