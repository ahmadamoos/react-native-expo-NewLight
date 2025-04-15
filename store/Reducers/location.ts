import * as actoins from '../Type/locationtype';


const initialState = {
    location: [],
    error: '',
    loading: false
}

const locationReducer = (state = initialState, action: any) => {
    switch (action.type) {
        case actoins.GET_LOCATION_REQUEST:
            return {
                ...state,
                loading: true
            }
        case actoins.GET_LOCATION_SUCCESS:
            return {
                ...state,
                loading: false,
                location: action.payload,
                error: ''
            }
        case actoins.GET_LOCATION_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload
            }
        case actoins.RESTART_LOCATION:
            return {
                ...state,
                location: []
            }
        default:
            return state
    }
}

export default locationReducer