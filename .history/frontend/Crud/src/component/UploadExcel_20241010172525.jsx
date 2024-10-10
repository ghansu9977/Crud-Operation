import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Button, Container, Typography, Card, Box, CircularProgress } from '@mui/material';
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
        <Container component="main" maxWidth="xs" sx={{ mt: 20, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Card elevation={3} sx={{ padding: 4, width: '100%' }}>
                <Typography variant="h5" align="center" gutterBottom>
                    Upload Excel File
                </Typography>
                <Box sx={{ textAlign: 'center', mb: 2 }}>
                    <FontAwesomeIcon icon={faFileExcel} size="5x" color="#2fb5a1" />
                </Box>
                <form onSubmit={handleSubmit}>
                    <input
                        type="file"
                        accept=".xlsx,.xls"
                        onChange={handleFileChange}
                        required
                        style={{ width: '100%' }}
                    />
                    <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            disabled={isLoading}
                            sx={{ width: '48%' }}
                        >
                            {isLoading ? <CircularProgress size={24} /> : 'Upload'}
                        </Button>
                        <Button
                            variant="outlined"
                            color="secondary"
                            disabled={isLoading}
                            onClick={handleBack}
                            sx={{ width: '48%' }}
                        >
                            Back
                        </Button>
                    </Box>
                </form>
                {file && (
                    <Typography variant="body2" align="center" sx={{ mt: 2 }}>
                        <strong>Selected File:</strong> {file.name}
                    </Typography>
                )}
            </Card>
        </Container>
    );
};

export default UploadExcel;
