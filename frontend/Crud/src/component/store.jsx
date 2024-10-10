import { createStore, combineReducers } from 'redux';
import productReducer from '../component/productReducer';

const rootReducer = combineReducers({
    products: productReducer,
});

const store = createStore(rootReducer);

export default store;
