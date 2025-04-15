import * as actions from "../Type/productsByTags";
import * as actionstow from "../Type/getAllDataWithoutTag"

const initialState = {
  itemm: [],               // Store the fetched products
  loading: false,             // Loading status
  error: null,                // Error message if any            
  tagssss: "",                   // Tags for filtering
  hasmoredata: true,
  hasmoredatatow: true,
  pageone: 1,
  pagetow: 1,

};

const productsByTagsReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionstow.GET_ALL_DATA_WITHOUT_TAG_REQUEST:
    case actions.FETCH_PRODUCTS_BY_TAGS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null, // Reset error when making a request
      };

    case actions.FETCH_PRODUCTS_BY_TAGS_SUCCESS:

      return {
        ...state,
        loading: false,
        itemm: [...state.itemm, ...action.payload.products], // Use 'products' instead of 'items'
        error: null,
        tagssss: action.payload.tags,
        hasmoredata: action.payload.hasmoredata,
        pageone: state.pageone + 1,
      };

    case actionstow.GET_ALL_DATA_WITHOUT_TAG_SUCCESS:
      return {
        ...state,
        loading: false,
        itemm: [...state.itemm, ...action.payload.datas], // Use 'products' instead of 'items'
        error: null,
        hasmoredatatow: action.payload.hasmoredatatow,
        pagetow: state.pagetow + 1,
      }
    case actionstow.GET_ALL_DATA_WITHOUT_TAG_FAILURE:
    case actions.FETCH_PRODUCTS_BY_TAGS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,     // Store error message if fetch fails
      };
    case actionstow.RESET_PAGE:
      return {
        ...state,
        pageone: 1
      }
    case actions.RESET_PRODUCTS_BY_TAGS:
      return {
        ...state,
        itemm: [],             // Reset products
        loading: false,
        error: null,
        tagssss: "",
        hasmoredata: true,
        hasmoredatatow: true,
        pageone: 1,
        pagetow: 1,
      };

    default:
      return state;
  }
};

export default productsByTagsReducer;
