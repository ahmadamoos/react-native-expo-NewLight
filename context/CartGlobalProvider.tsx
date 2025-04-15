import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [localCart, setLocalCart] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load cart from AsyncStorage on app start
  useEffect(() => {
    const loadCart = async () => {
      try {
        const storedCart = await AsyncStorage.getItem("localCart");
        const parsedCart = storedCart ? JSON.parse(storedCart) : [];
        setLocalCart(parsedCart);
      } catch (error) {
        console.error("Error loading cart:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCart();
  }, []);

  // Save cart to AsyncStorage whenever it changes
  useEffect(() => {
    const saveCart = async () => {
      try {
        await AsyncStorage.setItem("localCart", JSON.stringify(localCart));
      } catch (error) {
        console.error("Error saving cart:", error);
      }
    };

    saveCart();
  }, [localCart]);

  // Add a product to the cart
  const addToCart = (product) => {
    setLocalCart((prevCart) => {
      const existingItem = prevCart.find(
        (item) => item.variant_id === product.variant_id
      );

      if (existingItem) {
        // Update quantity and recalculate total price if the product already exists
        return prevCart.map((item) =>
          item.variant_id === product.variant_id
            ? {
                ...item,
                chosenQuantity: item.chosenQuantity + product.chosenQuantity,
                product_total_price:
                  item.product_price *
                  (item.chosenQuantity + product.chosenQuantity),
              }
            : item
        );
      } else {
        // Add new product to the cart
        return [
          ...prevCart,
          {
            ...product,
            product_total_price: product.product_price * product.chosenQuantity,
          },
        ];
      }
    });
  };

  // Update the quantity of a product in the cart
  const updateQuantity = (productId, newQuantity) => {
    setLocalCart((prevCart) =>
      prevCart.map((item) =>
        item.variant_id === productId
          ? {
              ...item,
              chosenQuantity: newQuantity,
              product_total_price: item.product_price * newQuantity,
            }
          : item
      )
    );
  };

  // Remove a product from the cart
  const removeFromCart = (productId) => {
    setLocalCart((prevCart) =>
      prevCart.filter((item) => item.variant_id !== productId)
    );
  };

  // Clear the entire cart
  const clearCart = () => {
    setLocalCart([]);
  };

  return (
    <CartContext.Provider
      value={{
        localCart,
        isLoading,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
