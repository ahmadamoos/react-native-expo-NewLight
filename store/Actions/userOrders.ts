import root from "@/lib/apihttp";
import * as actionstype from "../Type/userorders";
import axios from "axios";

// Action Creators
const getuserordersrequest = () => {
    return {
        type: actionstype.GET_USER_ORDERS_REQUEST,
    };
};

const getuserorderssuccess = (data, hasMore) => {
    return {
        type: actionstype.GET_USER_ORDERS_SUCCESS,
        payload: { data, hasMore },
    };
};

const getuserordersfailure = (error) => {
    return {
        type: actionstype.GET_USER_ORDERS_FALUIERE,
        payload: error,
    };
};

export const resetuserorders = () => {
    return {
        type: actionstype.RESET_USER_ORDERS,
    };
};

// Thunk Action to Fetch Orders
export const getuserorders = (user_id, page = 1) => async (dispatch) => {
    dispatch(getuserordersrequest());
    try {
        const response = await axios.get(`http://${root}:3000/orders-by-user`, {
            params: { user_id, page },
        });

        const { data, pagination } = response.data;

        // Calculate if there are more orders to load
        const hasMore = pagination.currentPage < pagination.totalPages;

        dispatch(getuserorderssuccess(data, hasMore));
    } catch (error) {
        dispatch(getuserordersfailure(error));
    }
};

