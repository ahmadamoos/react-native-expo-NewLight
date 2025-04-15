import root from "@/lib/apihttp";
import axios from "axios";
import * as actionstype from "../Type/getupdatedlocation";

const getupdatedlocationrequest = () => {
    return {
        type: actionstype.GET_UPDATED_LOCATION_REQUEST,
    };
};
const getupdatedlocationsuccess = (data: any) => {
    return {
        type: actionstype.GET_UPDATED_LOCATION_SUCCESS,
        payload: data,
    };
};
const getupdatedlocationfail = (error: any) => {
    return {
        type: actionstype.GET_UPDATED_LOCATION_FAIL,
        payload: error,
    };
};
export const getupdatedlocation = (id: string, userid: string) => async (dispatch: any) => {
    dispatch(getupdatedlocationrequest());
    try {
        const response = await axios.get(`http://${root}:3000/locations-by-user`,
            {
                params: {
                    id: id,
                    user_id: userid
                }
            }
        );
        dispatch(getupdatedlocationsuccess(response.data.data));
    } catch (error: any) {
        dispatch(getupdatedlocationfail(error.message));
    }
};