import * as actionstype from "../Type/randomProduct";

const initialState = {
    random: [],
    error: null,
    loading: false,
};

const randomProductReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionstype.GET_RANDOM_PRODUCT_REQUEST:
            return { ...state, loading: true, error: null };
        case actionstype.GET_RANDOM_PRODUCT_SUCCESS:
            return { ...state, loading: false, random: action.payload };
        case actionstype.GET_RANDOM_PRODUCT_FAILURE:
            return { ...state, loading: false, error: action.payload };
        case actionstype.RESET_RANDOM_PRODUCT:
            return { ...state, random: [] };
        default:
            return state;
    }
};

export default randomProductReducer;    