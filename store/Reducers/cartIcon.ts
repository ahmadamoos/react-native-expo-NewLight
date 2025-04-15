// cartReducer.js
import {
    LOAD_CART_REQUEST,
    LOAD_CART_SUCCESS,
    LOAD_CART_FAILURE,
    ADD_PRODUCT,
    REMOVE_PRODUCT,
    UPDATE_QUANTITY,
} from "../Type/cartIcon";

const initialState = {
    items: [], // Cart items
    loading: false, // Loading state
    error: null, // Error state
};

const cartReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOAD_CART_REQUEST:
            return { ...state, loading: true, error: null };

        case LOAD_CART_SUCCESS:
            return { ...state, loading: false, items: action.payload };

        case LOAD_CART_FAILURE:
            return { ...state, loading: false, error: action.payload };

        case ADD_PRODUCT: {
            const { product } = action.payload;
            const existingItem = state.items.find(
                (item) => item.variant_id === product.variant_id // Use variant_id for uniqueness
            );

            if (existingItem) {
                // Increment quantity if product already exists
                return {
                    ...state,
                    items: state.items.map((item) =>
                        item.variant_id === product.variant_id
                            ? { ...item, chosenQuantity: item.chosenQuantity + product.chosenQuantity }
                            : item
                    ),
                };
            } else {
                // Add new product
                return {
                    ...state,
                    items: [...state.items, product],
                };
            }
        }

        case REMOVE_PRODUCT: {
            const { productId } = action.payload;
            return {
                ...state,
                items: state.items.filter((item) => item.product_id !== productId),
            };
        }

        case UPDATE_QUANTITY: {
            const { productId, quantity } = action.payload;
            return {
                ...state,
                items: state.items.map((item) =>
                    item.product_id === productId
                        ? { ...item, chosenQuantity: quantity }
                        : item
                ),
            };
        }

        default:
            return state;
    }
};

export default cartReducer;