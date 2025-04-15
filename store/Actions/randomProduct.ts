import * as actionstype from '../Type/randomProduct';
import root from '@/lib/apihttp';
import axios from 'axios';

const getRandomProduct = () => {
    return {
        type: actionstype.GET_RANDOM_PRODUCT_REQUEST,
    };
};

const getRandomProductSuccess = (data: any) => {
    return {
        type: actionstype.GET_RANDOM_PRODUCT_SUCCESS,
        payload: data,
    };
};

const getRandomProductFailure = (error: any) => {
    return {
        type: actionstype.GET_RANDOM_PRODUCT_FAILURE,
        payload: error,
    };
};
export const resetRandomProduct = () => {
    return {
        type: actionstype.RESET_RANDOM_PRODUCT,
    };
}
const processProductData = (product: any) => {

    return {
        first_tag: product.first_tag || null,
        tags: product.tags || [],
        ...product,

    };
};

export const getRandomProductAction = () => async (dispatch: any) => {
    dispatch(getRandomProduct());
    try {
        const response = await axios.get(`http://${root}:3000/random-products`);

        const data = response.data.products


        dispatch(getRandomProductSuccess(data));
    } catch (error) {
        dispatch(getRandomProductFailure(error));
    }
};