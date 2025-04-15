import * as typeactions from "../Type/usersdata";

const initialState = {
    loading: false,
    data: [],
    error: null,
    pagee: 1,
    hasMoree: true,
};

const usersdataReducer = (state = initialState, action) => {
    switch (action.type) {
        case typeactions.GET_USERS_REQUEST_TYPE:
            return { ...state, loading: true, error: null };
        case typeactions.GET_USERS_SUCCESS_TYPE:

            return {
                ...state,
                loading: false,
                data: [...state.data, ...action.payload.data],
                hasMoree: action.payload.hasMore,
                pagee: state.pagee + 1,
            };
        case typeactions.GET_USERS_FAILURE_TYPE:
            return { ...state, loading: false, error: action.payload };
        case typeactions.RESET_USERS_TYPE:
            return { ...state, data: [], pagee: 1 };
        default:
            return state;
    }
};

export default usersdataReducer;