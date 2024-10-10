import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setProducts, deleteProduct } from '../component/productActions';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Table, Button } from 'react-bootstrap';

const ViewProduct = () => {
    const dispatch = useDispatch();
    const products = useSelector((state) => state.products.items);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        const response = await axios.get('http://localhost:3000/view');
        dispatch(setProducts(response.data));
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "This will permanently delete the product!",
            icon: 'warning',
            showCancelButton: true,
        });

        if (result.isConfirmed) {
            await axios.delete(`http://localhost:3000/delete/${id}`);
            dispatch(deleteProduct(id));
            Swal.fire('Deleted!', 'Product has been deleted.', 'success');
        }
    };

    return (
        <Table>
            <thead>
                <tr>
                    <th>Product Name</th>
                    <th>Price</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {products.map(item => (
                    <tr key={item.id}>
                        <td>{item.pname}</td>
                        <td>{item.price}</td>
                        <td>
                            <Button variant="danger" onClick={() => handleDelete(item.id)}>Delete</Button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </Table>
    );
};

export default ViewProduct;
