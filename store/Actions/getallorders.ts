import root from "@/lib/apihttp";
import axios from "axios";
import * as typeactions from "@/store/Type/getallorders";

const getallordersrequest = () => {
    return {
        type: typeactions.GET_ALL_ORDERS_REQUEST,
    };
};
const getallordersuccess = (data: any, hasMore = true) => {
    return {
        type: typeactions.GET_ALL_ORDERS_SUCCESS,
        payload: { data, hasMore },

    };
};
const getallorderfailure = (error: any) => {
    return {
        type: typeactions.GET_ALL_ORDERS_FAIL,
        payload: error,
    };
};
export const resetgetallorders = () => {
    return {
        type: typeactions.GET_ALL_ORDERS_RESET,
    };
};
export const getallorders = (page: any) => async (dispatch: any) => {
    dispatch(getallordersrequest());
    try {
        const response = await axios.get(`http://${root}:3000/cart-items-all`,
            {
                params: {
                    page: page,
                },
            }
        );
        const data = response.data.data;


        if (data.length > 0) {
            dispatch(getallordersuccess(data, true));
        } else {
            dispatch(getallordersuccess([], false));
        }

    } catch (error) {
        dispatch(getallorderfailure(error.message));
    }
};