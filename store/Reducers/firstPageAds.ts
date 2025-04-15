import * as typeaction from "../Type/firstPageAds";

const initialState = {
    data: null,
    loading: false,
    error: null,
};

const firstPageAdsReducer = (state = initialState, action) => {
    switch (action.type) {
        case typeaction.GET_FIRST_PAGE_ADS_REQUEST:
            return { ...state, loading: true, error: null };
        case typeaction.GET_FIRST_PAGE_ADS_SUCCESS:
            return { ...state, loading: false, data: action.payload };
        case typeaction.GET_FIRST_PAGE_ADS_FAILURE:
            return { ...state, loading: false, error: action.payload };
        case typeaction.RESET_FIRST_PAGE_ADS:
            return { ...state, data: null };
        default:
            return state;
    }
};

export default firstPageAdsReducer;