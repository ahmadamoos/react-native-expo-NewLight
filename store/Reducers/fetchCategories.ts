import * as actoins from "../Type/fetchCategories";

const initialState = {
    categories: [], // Initial state for categories
    loading: false, // Initial state for loading
    error: null, // Initial state for error
};

const fetchCategoriesReducer = (state = initialState, action) => {
    switch (action.type) {
        case actoins.FETCH_CATEGORIES_REQUEST:
            return { ...state, loading: true, error: null };
        case actoins.FETCH_CATEGORIES_SUCCESS:
            return { ...state, loading: false, categories: action.payload };
        case actoins.FETCH_CATEGORIES_FAILURE:
            return { ...state, loading: false, error: action.payload };
        case actoins.RESET_CATEGORIES:
            return { ...state, categories: [] };
        default:
            return state;
    }
};

export default fetchCategoriesReducer;