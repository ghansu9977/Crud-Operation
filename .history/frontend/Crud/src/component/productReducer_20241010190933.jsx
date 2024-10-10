const initialState = {
    items: [],
};

const productReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'ADD_PRODUCT':
            return { ...state, items: [...state.items, action.payload] };
        case 'UPDATE_PRODUCT':
            return {
                ...state,
                items: state.items.map(item =>
                    item.id === action.payload.id ? action.payload : item
                ),
            };
        case 'DELETE_PRODUCT':
            return {
                ...state,
                items: state.items.filter(item => item.id === action.payload),
            };
        case 'SET_PRODUCTS':
            return { ...state, items: action.payload };
        default:
            return state;
    }
};

export default productReducer;
