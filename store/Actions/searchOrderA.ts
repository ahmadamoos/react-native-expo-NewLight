import root from "@/lib/apihttp";
import axios from "axios";
import * as actionstype from "../Type/searchOrder";

const searchOrderRequest = () => {
    return {
        type: actionstype.SEARCH_ORDER_REQUEST,
    };
};
const searchOrderSuccess = (data: any) => {
    return {
        type: actionstype.SEARCH_ORDER_SUCCESS,
        payload: data,
    };
};
const searchOrderFail = (error: any) => {
    return {
        type: actionstype.SEARCH_ORDER_FAILURE,
        payload: error,
    };
};
export const resetSearchOrder = () => {
    return {
        type: actionstype.RESET_SEARCH_ORDER,
    };
};

export const searchOrder = (data: any) => async (dispatch: any) => {
    dispatch(searchOrderRequest());
    try {
        const response = await axios.get(`http://${root}:3000/orders-search`, {
            params: {
                search: data,
            },
        });
        console.log("searchOrder", response.data.data);
        dispatch(searchOrderSuccess(response.data.data));
    } catch (error: any) {
        dispatch(searchOrderFail(error.message));
    }
};