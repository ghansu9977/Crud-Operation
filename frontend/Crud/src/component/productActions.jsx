export const setLoading = (isLoading) => ({
    type: 'SET_LOADING',
    payload: isLoading,
});

export const setProducts = (products) => ({
    type: 'SET_PRODUCTS',
    payload: products,
});

export const setError = (error) => ({
    type: 'SET_ERROR',
    payload: error,
});

export const deleteProduct = (id) => ({
    type: 'DELETE_PRODUCT',
    payload: id,
});
