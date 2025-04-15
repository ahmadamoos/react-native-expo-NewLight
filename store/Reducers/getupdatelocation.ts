import * as actionTypes from '../Type/getupdatedlocation';

const initialState = {
    data: [],
    loading: false,
    error: null,
};
const getUpdateLocationReducer = (state = initialState, action: any) => {
    switch (action.type) {
        case actionTypes.GET_UPDATED_LOCATION_REQUEST:
            return {
                ...state,
                loading: true,
            };
        case actionTypes.GET_UPDATED_LOCATION_SUCCESS:
            return {
                ...state,
                loading: false,
                data: action.payload,
            };
        case actionTypes.GET_UPDATED_LOCATION_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };

        default:
            return state;
    }
};
export default getUpdateLocationReducer;