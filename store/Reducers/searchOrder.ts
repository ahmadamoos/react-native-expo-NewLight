import * as actionTypes from '../Type/searchOrder';


const initialState = {
    dataa: [],
    loading: false,
    error: null,
};

const searchOrderReducer = (state = initialState, action: any) => {
    switch (action.type) {
        case actionTypes.SEARCH_ORDER_REQUEST:
            return {
                ...state,
                loading: true,
            };
        case actionTypes.SEARCH_ORDER_SUCCESS:
            return {
                ...state,
                loading: false,
                dataa: action.payload,
            };
        case actionTypes.SEARCH_ORDER_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };
        case actionTypes.RESET_SEARCH_ORDER:
            return {
                ...state,
                dataa: [],
            };
        default:
            return state;
    }
};
export default searchOrderReducer;