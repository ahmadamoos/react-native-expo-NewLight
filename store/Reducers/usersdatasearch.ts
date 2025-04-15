import * as typeactions from "../Type/usersdatasearch";

const initialState = {
    loading: false,
    dataa: [],
    error: null,
    page: 1,
    hasMore: true,
};

const usersdatasearchReducer = (state = initialState, action) => {
    switch (action.type) {
        case typeactions.GET_USERS_REQUEST:
            return { ...state, loading: true, error: null };
        case typeactions.GET_USERS_SUCCESS:
            return {
                ...state,
                loading: false,
                dataa: [...state.dataa, ...action.payload.dataa],
                hasMore: action.payload.hasMore,
                page: state.page + 1,
            };
        case typeactions.GET_USERS_FAILURE:
            return { ...state, loading: false, error: action.payload };
        case typeactions.RESET_USERS:
            return { ...state, dataa: [], page: 1 };
        default:
            return state;
    }
};

export default usersdatasearchReducer;