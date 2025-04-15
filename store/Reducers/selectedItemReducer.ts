import * as actions from "../Type/selectedItemType";

const initialState = {
  loading: false,
  item: [],
  error: null,
};

const selectedItemReducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.GET_SELECTED_ITEM_REQUEST:
      return { ...state, loading: true, error: null };
    case actions.GET_SELECTED_ITEM_SUCCESS:
      return { ...state, loading: false, item: action.payload };
    case actions.RESET_SELECTED_ITEM:
      return { ...state, item: [] };
    case actions.GET_SELECTED_ITEM_FAILURE:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export default selectedItemReducer;