import * as actions from "../Type/fetchCategories";
import axios from "axios";
import root from "../../lib/apihttp"

const fetchCategoriesRequest = () => ({ type: actions.FETCH_CATEGORIES_REQUEST });
const fetchCategoriesSuccess = (categories) => ({ type: actions.FETCH_CATEGORIES_SUCCESS, payload: categories });
const fetchCategoriesFailure = (error) => ({ type: actions.FETCH_CATEGORIES_FAILURE, payload: error });
export const resetCategories = () => ({ type: actions.RESET_CATEGORIES });

export const fetchCategories = () => async (dispatch) => {
    dispatch(fetchCategoriesRequest());
    try {
        const response = await axios.get(`http://${root}:3000/products-by-first-tag`);
        const rawCategories = response.data.tags;


        dispatch(fetchCategoriesSuccess(rawCategories));
    } catch (error) {
        dispatch(fetchCategoriesFailure(error.message));
    }
};

