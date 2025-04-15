import * as actionstype from "../Type/userorders";

const initialState = {
    data: [],
    hasMore: false,
    loading: false,
    error: null,
    page: 1,
};

const userOrdersReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionstype.GET_USER_ORDERS_REQUEST:
            return { ...state, loading: true, error: null };
        case actionstype.GET_USER_ORDERS_SUCCESS:

            return {
                ...state,
                loading: false,
                data: [...state.data, ...action.payload.data],
                hasMore: action.payload.hasMore,
                page: state.page + 1,
            };
        case actionstype.GET_USER_ORDERS_FALUIERE:
            return { ...state, loading: false, error: action.payload };
        case actionstype.RESET_USER_ORDERS:
            return { ...state, data: [], page: 1 };
        default:
            return state;
    }
};

export default userOrdersReducer