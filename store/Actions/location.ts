import root from '@/lib/apihttp';
import * as actoins from '../Type/locationtype';
import axios from 'axios';


const getlocationrequest = () => {
    return {
        type: actoins.GET_LOCATION_REQUEST
    }
}

const getlocationsuccess = (data) => {
    return {
        type: actoins.GET_LOCATION_SUCCESS,
        payload: data
    }
}

const getlocationfailure = (error) => {
    return {
        type: actoins.GET_LOCATION_FAILURE,
        payload: error
    }
}
export const restartlocation = () => {
    return {
        type: actoins.RESTART_LOCATION
    }
}

export const getlocation = () => async (dispatch) => {
    dispatch(getlocationrequest());
    try {

        const response = await axios.get(`http://${root}:3000/get-locations`);

        const data = response.data.locations;
        console.log("location", data)

        dispatch(getlocationsuccess(data));
    } catch (error) {
        dispatch(getlocationfailure(error.message));
    }
}