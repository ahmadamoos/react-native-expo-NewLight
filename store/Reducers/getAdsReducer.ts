import * as actionstype from "../Type/ads";

const initialState = {
    ads: [],
    error: null,
    loading: false,
    page: 1,
    hasMore: true
};

const getAdsReducer = (state = initialState, action) => {
    switch (action.type) {
        case actionstype.GET_ADS_REQUEST:
            return { ...state, loading: true, error: null };
        case actionstype.GET_ADS_SUCCESS:

            return { ...state, loading: false, ads: [...state.ads, ...action.payload.data], page: state.page + 1, hasMore: action.payload.hasMore };
        case actionstype.GET_ADS_FAILURE:
            return { ...state, loading: false, error: action.payload };
        case actionstype.RESET_ADS:
            return { ...state, ads: [], page: 1, hasMore: true };
        default:
            return state;
    }
};

export default getAdsReducer;