import axios from "axios";
import root from "@/lib/apihttp";
import * as typeaction from "@/store/Type/orderbyid";



const getOrderbyidrequest = () => {
    return {
        type: typeaction.GET_ORDER_REQUEST,
    };
}

const getOrderbyidsuccess = (data) => {
    return {
        type: typeaction.GET_ORDER_SUCCESS,
        payload: data,
    };
}

const getOrderbyidfailure = (error) => {
    return {
        type: typeaction.GET_ORDER_FAILURE,
        payload: error,
    };
}
export const resetOrderr = () => {
    return {
        type: typeaction.RESET_ORDER,
    };
}

export const getOrderbyid = (id: string) => async (dispatch: any) => {
    dispatch(getOrderbyidrequest());
    try {
        const response = await axios.get(`http://${root}:3000/cart-items-by-order`,
            {
                params: {
                    order_id: id,
                },
            })
        const data = response.data.data;

        dispatch(getOrderbyidsuccess(data));
    } catch (error) {
        dispatch(getOrderbyidfailure(error.message));

    }
}