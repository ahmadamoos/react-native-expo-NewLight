import axios from "axios";
import * as actionss from "../Type/orders";
import root from "@/lib/apihttp";
import { get } from "firebase/database";



const getOrdersRequest = () => ({
    type: actionss.GET_ORDERS_REQUEST
});

const getOrdersSuccess = (orderss: any, hasmore = true) => ({
    type: actionss.GET_ORDERS_SUCCESS,
    payload: { orderss, hasmore }

});

const getOrdersFailure = (error: any) => ({
    type: actionss.GET_ORDERS_FAILURE,
    payload: error
});
export const resetOrders = () => ({
    type: actionss.RESET_ORDERS
});

export const getdata = (pagee: number) => async (dispatch: Dispatch) => {
    dispatch(getOrdersRequest());

    try {
        const response = await axios.get(`http://${root}:3000/cart-items-not-done`, {
            params: { page: pagee },
        });

        // Log the response data


        const orderss = response.data.data;

        const convertedOrders = Object.entries(orderss).map(([order_id, orderData]) => ({
            order_id,
            ...orderData,
        }));

        if (convertedOrders.length > 0) {

            dispatch(getOrdersSuccess(convertedOrders, true));
        } else {

            dispatch(getOrdersSuccess([], false));
        }
        // Dispatch the correct data structure

    } catch (error: any) {
        console.error("Error fetching orders:", error);

        dispatch(getOrdersFailure(error.response?.data?.message || "Failed to fetch orders"));
    }
};
