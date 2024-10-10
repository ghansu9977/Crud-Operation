import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Button, Container, Typography, Card, Box, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileExcel } from '@fortawesome/free-solid-svg-icons';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material/styles';
import { useDropzone } from 'react-dropzone';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const Dropzone = styled(Box)(({ theme }) => ({
  border: '2px dashed #1976d2',
  borderRadius: '4px',
  padding: '20px',
  textAlign: 'center',
  cursor: 'pointer',
  backgroundColor: theme.palette.background.paper,
}));

const UploadExcel = () => {
    const [file, setFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleFileChange = (acceptedFiles) => {
        const selectedFile = acceptedFiles[0];
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

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop: handleFileChange,
        accept: '.xlsx,.xls',
    });

    return (
        <Container component="main" maxWidth="xs" sx={{ mt: 22, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Card elevation={3} sx={{ padding: 4, width: '100%' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <FontAwesomeIcon icon={faFileExcel} size="3x" color="#2fb5a1" sx={{ marginRight: 1 }} />
                    <Typography variant="h5" style={{margin}}>Upload Excel File</Typography>
                </Box>
                <form onSubmit={handleSubmit}>
                    <Dropzone {...getRootProps()} sx={{ mb: 2 }}>
                        <input {...getInputProps()} />
                        {isDragActive ? (
                            <Typography variant="body2">Drop the files here...</Typography>
                        ) : (
                            <>
                                <CloudUploadIcon fontSize="large" color="action" />
                                <Typography variant="body2">Drag & drop your Excel files here, or click to select files</Typography>
                            </>
                        )}
                    </Dropzone>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            disabled={isLoading || !file}
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
