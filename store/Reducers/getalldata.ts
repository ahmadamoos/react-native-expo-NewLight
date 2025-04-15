import * as actionTypes from '../Type/getallorders';

const initialState = {
    loading: false,
    data: [],
    error: '',
    page: 1,
    hasMore: true,
};

const getAllDataReducer = (state = initialState, action: any) => {
    switch (action.type) {
        case actionTypes.GET_ALL_ORDERS_REQUEST:
            return {
                ...state,
                loading: true,
            };
        case actionTypes.GET_ALL_ORDERS_SUCCESS:
            return {
                ...state,
                loading: false,
                data: [...state.data, ...action.payload.data],
                hasMore: action.payload.hasMore,
                page: state.page + 1,
            };
        case actionTypes.GET_ALL_ORDERS_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };
        default:
            return state;
    }
};

export default getAllDataReducer;