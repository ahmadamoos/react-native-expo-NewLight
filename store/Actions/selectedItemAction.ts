import * as actions from "../Type/selectedItemType"
import axios from "axios"
import root from "@/lib/apihttp"



export const selectedItemrequest = () => async (dispatch) => {
    dispatch({ type: actions.GET_SELECTED_ITEM_REQUEST })
}

export const selectedItemSuccess = (item) => async (dispatch) => {
    dispatch({ type: actions.GET_SELECTED_ITEM_SUCCESS, payload: item })
}
export const selectedItemFailure = (error) => async (dispatch) => {
    dispatch({ type: actions.GET_SELECTED_ITEM_FAILURE, payload: error })
}
export const resetSelectedItem = () => async (dispatch) => {
    dispatch({ type: actions.RESET_SELECTED_ITEM })
}
export const getSelectedItem = (id) => async (dispatch) => {
    dispatch(selectedItemrequest());
    try {
        console.log("id", id);
        const result = await axios.get(`http://${root}:3000/product/${id}`,

        );
        const data = result.data.product;
        if (data) {
            console.log(data);
            dispatch(selectedItemSuccess(data));
        }
    } catch (error) {
        dispatch(selectedItemFailure(error.message))
    }

}