import * as actionTypes from '../Type/locationbyid';

const initialState = {
    data: [],
    loading: false,
    error: null,
};
const getLocationByIdReducer = (state = initialState, action: any) => {
    switch (action.type) {
        case actionTypes.GET_LOCATION_BY_ID_REQUEST:
            return {
                ...state,
                loading: true,
            };
        case actionTypes.GET_LOCATION_BY_ID_SUCCESS:
            return {
                ...state,
                loading: false,
                data: action.payload,
            };
        case actionTypes.GET_LOCATION_BY_ID_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };
        case actionTypes.GET_LOCATION_BY_ID_RESET:
            return {
                ...state,
                data: [],
            };
        default:
            return state;
    }
};
export default getLocationByIdReducer;