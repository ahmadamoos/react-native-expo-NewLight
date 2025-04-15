// cartActions.js
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
    LOAD_CART_REQUEST,
    LOAD_CART_SUCCESS,
    LOAD_CART_FAILURE,
    ADD_PRODUCT,
    REMOVE_PRODUCT,
    UPDATE_QUANTITY,
} from "../Type/cartIcon";

// Helper function to save cart to AsyncStorage
const saveCart = async (cart) => {
    await AsyncStorage.setItem("localCart", JSON.stringify(cart));
};

// Load cart from AsyncStorage
export const loadCart = () => async (dispatch) => {
    dispatch({ type: LOAD_CART_REQUEST });

    try {
        const storedCart = await AsyncStorage.getItem("localCart");
        const cart = storedCart ? JSON.parse(storedCart) : [];
        dispatch({ type: LOAD_CART_SUCCESS, payload: cart });
    } catch (error) {
        dispatch({ type: LOAD_CART_FAILURE, payload: error.message });
    }
};

// Add a product to the cart
export const addProduct = (product) => async (dispatch, getState) => {
    dispatch({ type: ADD_PRODUCT, payload: product });

    // Save updated cart to AsyncStorage
    const { cart } = getState();
    await saveCart(cart.items);
};

// Remove a product from the cart
export const removeProduct = (productId) => async (dispatch, getState) => {
    dispatch({ type: REMOVE_PRODUCT, payload: productId });

    // Save updated cart to AsyncStorage
    const { cart } = getState();
    await saveCart(cart.items);
};

// Update product quantity
export const updateQuantity = (productId, quantity) => async (dispatch, getState) => {
    dispatch({ type: UPDATE_QUANTITY, payload: { productId, quantity } });

    // Save updated cart to AsyncStorage
    const { cart } = getState();
    await saveCart(cart.items);
};