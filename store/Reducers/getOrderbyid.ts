import * as actionTypes from '../Type/orderbyid';



const initialState = {
    data: [],
    loading: false,
    error: null,
};


const getOrderByIdReducer = (state = initialState, action: any) => {
    switch (action.type) {
        case actionTypes.GET_ORDER_REQUEST:
            return {
                ...state,
                loading: true,
            };
        case actionTypes.GET_ORDER_SUCCESS:
            return {
                ...state,
                loading: false,
                data: action.payload,
            };
        case actionTypes.GET_ORDER_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };
        case actionTypes.RESET_ORDER:
            return {
                ...state,
                data: [],
            };
        default:
            return state;
    }
}
export default getOrderByIdReducer;