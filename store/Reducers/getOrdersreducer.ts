import * as actionss from "../Type/orders";


const initialState = {
    loading: false,
    orders: [],
    error: null,
    page: 1,
    hasMore: true
};


const oridrsReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionss.GET_ORDERS_REQUEST:
            return { ...state, loading: true, error: null }
        case actionss.GET_ORDERS_SUCCESS:
            return { ...state, loading: false, orders: [...state.orders, ...action.payload.orderss], page: state.page + 1, hasMore: action.payload.hasmore }
        case actionss.GET_ORDERS_FAILURE:
            return { ...state, loading: false, error: action.payload }
        case actionss.RESET_ORDERS:
            return { ...state, orders: [], page: 1 }
        default:
            return state;
    }
};

export default oridrsReducer