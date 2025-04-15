import { createStore, combineReducers, applyMiddleware } from 'redux';
import { thunk } from 'redux-thunk'; // Correct import
import selectedItemReducer from './Reducers/selectedItemReducer';
import { composeWithDevTools } from '@redux-devtools/extension';
import fetchCategoriesReducer from './Reducers/fetchCategories'
import productsByTagsReducer from './Reducers/fetchProductByTages';
import filterSReducer from './Reducers/filterR';
import updateProductsReducer from './Reducers/updateProducts';
import oridrsReducer from './Reducers/getOrdersreducer';
import locationReducer from './Reducers/location';
import getLocationByIdReducer from './Reducers/getlocationbyid';
import getUpdateLocationReducer from './Reducers/getupdatelocation';
import getOrderByIdReducer from './Reducers/getOrderbyid';
import { searchOrder } from './Actions/searchOrderA';
import searchOrderReducer from './Reducers/searchOrder';
import { all } from 'axios';
import getAllDataReducer from './Reducers/getalldata';
import reducer from './Reducers/cartIcon';
import cartReducer from './Reducers/cartIcon';
import usersdatasearchReducer from './Reducers/usersdatasearch';
import usersdataReducer from './Reducers/usersdata';
import userOrdersReducer from './Reducers/userOrders';
import getAdsReducer from './Reducers/getAdsReducer';
import firstPageAdsReducer from './Reducers/firstPageAds';
import randomProductReducer from './Reducers/randomProdcut';


const rootReducer = combineReducers({

  selectedItem: selectedItemReducer,
  filterS: filterSReducer,
  categories: fetchCategoriesReducer,
  productbytagss: productsByTagsReducer,
  updateProducts: updateProductsReducer,
  getoreders: oridrsReducer,
  locationdata: locationReducer,
  locationbyid: getLocationByIdReducer,
  locationupdateuser: getUpdateLocationReducer,
  orderid: getOrderByIdReducer,
  searchOrder: searchOrderReducer,
  allOrders: getAllDataReducer,
  cartIcon: cartReducer,
  usersdata: usersdataReducer,
  usersdatasearch: usersdatasearchReducer,
  userorder: userOrdersReducer,
  fullads: getAdsReducer,
  AdsFirst: firstPageAdsReducer,
  randomProduct: randomProductReducer,


});

const store = createStore(
  rootReducer,
  process.env.NODE_ENV !== 'production' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? composeWithDevTools(applyMiddleware(thunk))
    : applyMiddleware(thunk)
);

export default store;