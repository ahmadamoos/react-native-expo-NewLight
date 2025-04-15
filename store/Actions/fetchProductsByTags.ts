import * as actions from "../Type/productsByTags";
import * as actionss from "../Type/getAllDataWithoutTag";
import axios from "axios";
import root from "../../lib/apihttp"

// Utility function to process product data
const processProductData = (product: any) => {

  return {
    first_tag: product.first_tag || null,
    tags: product.tags || [],
    ...product,

  };
};

// Action creators
const fetchProductsRequest = () => ({
  type: actions.FETCH_PRODUCTS_BY_TAGS_REQUEST,
});

const fetchProductsSuccess = (products: any, tags: string, hasmoredata: boolean) => ({
  type: actions.FETCH_PRODUCTS_BY_TAGS_SUCCESS,
  payload: { products, tags, hasmoredata },
});

const fetchProductsFailure = (error: any) => ({
  type: actions.FETCH_PRODUCTS_BY_TAGS_FAILURE,
  payload: error,
});

export const resetProductsByTags = () => ({
  type: actions.RESET_PRODUCTS_BY_TAGS,
});

const getDataRequest = () => ({
  type: actionss.GET_ALL_DATA_WITHOUT_TAG_REQUEST,
});

const getDataSuccess = (datas: any, hasmoredatatow: boolean) => ({
  type: actionss.GET_ALL_DATA_WITHOUT_TAG_SUCCESS,
  payload: { datas, hasmoredatatow },
});

const getDataFailure = (error: any) => ({
  type: actionss.GET_ALL_DATA_WITHOUT_TAG_FAILURE,
  payload: error,
});

export const resetPage = () => ({
  type: actionss.RESET_PAGE
})
// Thunk action to fetch products by tags
export const fetchProductsByTags = (tags: any, pageone: number) => async (dispatch: any) => {
  try {
    const tagss = tags;
    dispatch(fetchProductsRequest());
    const response = await axios.get(`http://${root}:3000/products-by-tag`, {
      params: { tag: tagss, page: pageone },
    });

    const products = response.data.products.map(processProductData);



    if (products.length > 0) {
      dispatch(fetchProductsSuccess(products, tagss, true));

    } else {
      // Fetch products without tags if no products are found
      dispatch(fetchProductsSuccess(products, tagss, false));
    }
  } catch (error: any) {
    console.error("Error fetching products by tags:", error);
    dispatch(fetchProductsFailure(error.message));
  }
};
export const allDataWithoutTag = (tagss: any, pagetow: number) => async (dispatch: any) => {
  try {
    dispatch(getDataRequest());
    const res = await axios.get(`http://${root}:3000/products-all-data-without`, {
      params: { tag: tagss, page: pagetow },
    });
    const datas = res.data.products.map(processProductData);

    if (datas.length > 0) {
      dispatch(getDataSuccess(datas, true));
    } else {
      dispatch(getDataSuccess([], false));
    }
  } catch (error: any) {
    console.error("Error fetching data without tags:", error);
    dispatch(getDataFailure(error.message));
  }
}

