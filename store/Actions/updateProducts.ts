import * as action from '../Type/updateProducts';
import axios from 'axios';
import root from "../../lib/apihttp"

// Action Creators
const getAllDataForUpdateRequest = () => ({
    type: action.GET_ALL_DATA_FOR_UPDATE_REQUEST,
});

const getAllDataForUpdateSuccess = (data, hasmoredataa) => ({
    type: action.GET_ALL_DATA_FOR_UPDATE_SUCCESS,
    payload: { data, hasmoredataa },
});

const getAllDataForUpdateFailure = (error) => ({
    type: action.GET_ALL_DATA_FOR_UPDATE_FAILURE,
    payload: error,
});

export const resetallDataForUpdate = (pagee) => {
    console.log("I am working");
    return {
        type: action.RESET_PAGE_FOR_UPDATE,
        payload: { pagee },
    };
};


// Thunk Action
const processProductData = (product) => {

    return {
        tags: product.tags || [],
        ...product,
    };
};


// Thunk Action
export const getAllDataForUpdate = (page: number) => async (dispatch) => {
    dispatch(getAllDataForUpdateRequest());
    try {
        // Fetch data from the backend
        const response = await axios.get(`http://${root}:3000/get-all-products`, {
            params: { page },
        });

        // Map and process products
        const products = response.data.products.map(processProductData);



        // Dispatch success action
        if (products.length > 0) {
            dispatch(getAllDataForUpdateSuccess(products, true));
        } else {
            dispatch(getAllDataForUpdateSuccess([], false));
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        dispatch(getAllDataForUpdateFailure(error.message));
    }
};
