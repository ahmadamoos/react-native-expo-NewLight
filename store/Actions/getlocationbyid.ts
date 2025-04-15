import root from "@/lib/apihttp";
import axios from "axios";
import * as actionstype from "../Type/locationbyid";

const getlocationbyidrequest = () => {
    return {
        type: actionstype.GET_LOCATION_BY_ID_REQUEST,
    };
};
const getlocationbyidsuccess = (data: any) => {
    return {
        type: actionstype.GET_LOCATION_BY_ID_SUCCESS,
        payload: data,
    };
};
const getlocationbyidfail = (error: any) => {
    return {
        type: actionstype.GET_LOCATION_BY_ID_FAIL,
        payload: error,
    };
};
export const getlocationbyidreset = () => {
    return {
        type: actionstype.GET_LOCATION_BY_ID_RESET,
    };
};
export const getlocationbyid = (id: string) => async (dispatch: any) => {
    dispatch(getlocationbyidrequest());
    try {
        const response = await axios.get(`http://${root}:3000/locations-by-user/${id}`);
        console.log("response", response.data.data);
        dispatch(getlocationbyidsuccess(response.data.data));
    } catch (error: any) {
        dispatch(getlocationbyidfail(error.message));
    }
};