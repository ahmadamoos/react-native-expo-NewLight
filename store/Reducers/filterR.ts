import * as actions from '../Type/filterT';

const initialState = {
  loading: false,
  itemss: [],
  error: null,
  lastDocdd: "",
  hasMorethrey: true,
  filterpage: 1,
  minprice: 0,
  maxprice: 1000,
  minsize: 0,
  maxsize: 1000,
  selectedColor: [],
  selectedTags: [],

};

const filterSReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case actions.FILTER_REQUEST:
      return { ...state, loading: true, error: null };
    case actions.FILTER_DATA:
      return {
        ...state,
        minprice: action.payload.minpricee,
        maxprice: action.payload.maxpricee,
        minsize: action.payload.minsizee,
        maxsize: action.payload.maxsizee,
        selectedColor: action.payload.selectedColorss,
        selectedTags: action.payload.selectedTagss
      };
    case actions.FILTER_SUCCESS:
      return {
        ...state,
        itemss: [...state.itemss, ...action.payload.data],
        hasMorethrey: action.payload.hasMorethrey,
        loading: false,
        filterpage: state.filterpage + 1

      };


    case actions.FILTER_FAILURE:
      return { ...state, loading: false, error: action.payload };
    case actions.RESET_PRODUCTS:
      return {
        ...state,
        itemss: [],
        hasMorethrey: true,
        filterpage: 1
      };
    default:
      return state;
  }
};

export default filterSReducer;
