import * as actions from '../Type/updateProducts';

const initialState = {
  items: [], // Array to store your products
  loadingg: false,
  error: null,
  hasmoredataa: true,
  page: 2,
};

const updateProductsReducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.GET_ALL_DATA_FOR_UPDATE_REQUEST:
      return {
        ...state,
        loading: true,
        error: null, // Reset error when making a request
      };
    case actions.GET_ALL_DATA_FOR_UPDATE_SUCCESS:
      return {
        ...state,
        loading: false,
        items: [...state.items, ...action.payload.data], // Use 'products' instead of 'items'
        error: null,
        hasmoredataa: action.payload.hasmoredataa,
        page: state.page + 1,
      };
    case actions.RESET_PAGE_FOR_UPDATE:

      return {
        ...state,
        items: [],
        hasmoredataa: true,
        page: action.payload.pagee,
      }
    case actions.GET_ALL_DATA_FOR_UPDATE_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default updateProductsReducer;