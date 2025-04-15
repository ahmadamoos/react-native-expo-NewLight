import * as actionstype from "../Type/ads";
import root from "@/lib/apihttp";
import axios from "axios";

const getadsrequest = () => {
    return {
        type: actionstype.GET_ADS_REQUEST,
    };
};

const getadsSuccess = (data: any, hasMore: any) => {
    return {
        type: actionstype.GET_ADS_SUCCESS,
        payload: { data, hasMore },
    };
};

const getadsFailure = (error: any) => {
    return {
        type: actionstype.GET_ADS_FAILURE,
        payload: error,
    };
};
export const getadsreset = () => {
    return {
        type: actionstype.RESET_ADS,
    };
};
export const getads = (page) => async (dispatch) => {
    dispatch(getadsrequest());

    try {
        const response = await axios.get(`http://${root}:3000/get-ads`, {
            params: { page },
        });

        const { data, page: currentPage, totalPages } = response.data;

        const hasMore = currentPage < totalPages;

        dispatch(getadsSuccess(data, hasMore));
    } catch (error) {
        dispatch(getadsFailure(error.message));
    }
};
