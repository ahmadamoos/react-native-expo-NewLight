import root from "@/lib/apihttp";
import axios from "axios";
import * as actionstype from "../Type/usersdata";

const getUsersRequest = () => {
    return {
        type: actionstype.GET_USERS_REQUEST_TYPE,
    };
};

const getUsersSuccess = (data: any, hasMoree = true) => {
    return {
        type: actionstype.GET_USERS_SUCCESS_TYPE,
        payload: { data, hasMoree },
    };
};

const getUsersFailure = (error: any) => {
    return {
        type: actionstype.GET_USERS_FAILURE_TYPE,
        payload: error,
    };
};

export const resetUsers = () => {
    return {
        type: actionstype.RESET_USERS_TYPE,
    };
};

export const getUserData = (page: any) => async (dispatch) => {
    dispatch(getUsersRequest());
    try {
        const response = await axios.get(`http://${root}:3000/users`,
            {
                params: {
                    page: page,
                },
            },
        );

        if (response.data.length > 0) {
            dispatch(getUsersSuccess(response.data, true));
        } else {
            dispatch(getUsersSuccess([], false));
        }

    } catch (error) {
        dispatch(getUsersFailure(error.message));
    }
};