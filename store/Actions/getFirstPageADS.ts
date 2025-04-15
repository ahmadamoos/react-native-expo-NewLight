import * as typeaction from "../Type/firstPageAds";
import root from "@/lib/apihttp";
import axios from "axios";

const getFirstpageRequest = () => {
    return {
        type: typeaction.GET_FIRST_PAGE_ADS_REQUEST,
    };
};
const getFirstpageSuccess = (data) => {
    return {
        type: typeaction.GET_FIRST_PAGE_ADS_SUCCESS,
        payload: data,
    };
};
const getFirstpageFailure = (error) => {
    return {
        type: typeaction.GET_FIRST_PAGE_ADS_FAILURE,
        payload: error,
    };
};
export const getFirstpageRestart = () => {
    return {
        type: typeaction.RESET_FIRST_PAGE_ADS,
    };
};
export const getFirstPage = () => async (dispatch) => {
    dispatch(getFirstpageRequest());
    try {
        const respon = await axios.get(`http://${root}:3000/ads-first-page`);
        const data = respon.data.ads;


        dispatch(getFirstpageSuccess(data));
    } catch (error) {
        dispatch(getFirstpageFailure(error));
    }
};