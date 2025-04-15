import root from "@/lib/apihttp";
import axios from "axios";
import * as actionstype from "../Type/usersdatasearch";

const getUsersRequest = () => {
    return {
        type: actionstype.GET_USERS_REQUEST,
    }
};

const getUsersSuccess = (dataa: any, hasMore = true) => {
    return {
        type: actionstype.GET_USERS_SUCCESS,
        payload: { dataa, hasMore },
    };
};

const getUsersFailure = (error: any) => {
    return {
        type: actionstype.GET_USERS_FAILURE,
        payload: error,
    };
};

export const resetUserss = () => {
    return {
        type: actionstype.RESET_USERS,
    };
};

export const getUserDataa = (search: any, page: any) => async (dispatch) => {
    dispatch(getUsersRequest());
    try {
        const response = await axios.get(`http://${root}:3000/users-search`, {

            params: {
                username: search,
                page: page

            },
        });


        if (response.data.data.length > 0) {
            dispatch(getUsersSuccess(response.data.data, true));
        } else {
            dispatch(getUsersSuccess([], false));
        }
    } catch (error) {
        dispatch(getUsersFailure(error.message));
    }
};