import axios from 'axios';
import * as actions from '../Type/filterT';
import root from "../../lib/apihttp"

const filterRequest = () => ({ type: actions.FILTER_REQUEST });
const filterSuccess = (data: any, hasMorethrey: boolean) => ({
  type: actions.FILTER_SUCCESS,
  payload: { data, hasMorethrey },
});
const filterFailure = (error: any) => ({ type: actions.FILTER_FAILURE, payload: error });
export const resetProducts = () => ({ type: actions.RESET_PRODUCTS });
export const filterdata = (minpricee: number,
  maxpricee: number,
  minsizee: number,
  maxsizee: number,
  selectedColorss: any,
  selectedTagss: any) => ({
    type: actions.FILTER_DATA,
    payload: {
      minpricee,
      maxpricee,
      minsizee,
      maxsizee,
      selectedColorss,
      selectedTagss
    }
  });



export const fetchFilterProducts = (minprice: number, maxprice: number, minsize: number, maxsize: number, selectedColors: Array<string>, selectedTags: Array<string>, page: number) => async (dispatch: any) => {
  dispatch(filterRequest());
  try {
    const response = await axios.get(`http://${root}:3000/filter-products`,
      { params: { minPricee: minprice, maxPricee: maxprice, minSizee: minsize, maxSizee: maxsize, colorss: selectedColors, tagss: selectedTags, page: page } }
    );
    const data = response.data.products.map((product: any) => {
      // Parse the image_url JSON string into an object


      // Return the product with the parsed image_url
      return {
        first_tag: product.first_tag || null,
        ...product,
        // Use the publicUrl as the image source
      };
    });
    if (data.length > 0) {
      dispatch(filterSuccess(data, true));
    } else {
      dispatch(filterSuccess([], false));
    }
  } catch (error: any) {
    dispatch(filterFailure(error.message));
  }
};