"use client";
import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCartItems(storedCart);
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem("cart");
  };

  const addToCart = (item) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i._id === item._id);
      if (existing) {
        const addedQty = item.quantity || 1;
        return prev.map((i) =>
          i._id === item._id ? { ...i, quantity: i.quantity + addedQty } : i,
        );
      }
      return [...prev, { ...item, quantity: item.quantity || 1 }];
    });
  };

  const removeItem = (_id) => {
    setCartItems((prev) => prev.filter((i) => i._id !== _id));
  };

  const incrementQty = (_id) => {
    setCartItems((prev) =>
      prev.map((i) => (i._id === _id ? { ...i, quantity: i.quantity + 1 } : i)),
    );
  };

  const decrementQty = (_id) => {
    setCartItems((prev) =>
      prev
        .map((i) =>
          i._id === _id ? { ...i, quantity: Math.max(i.quantity - 1, 0) } : i,
        )
        .filter((i) => i.quantity > 0),
    );
  };

  const itemsTotal = cartItems.reduce((acc, item) => {
    const priceStr = String(item.price || "0");
    const numericPrice = parseFloat(priceStr.replace(/[^0-9.]/g, "")) || 0;
    return acc + item.quantity * numericPrice;
  }, 0);

  const shippingFee = 1;
  const totalPrice = itemsTotal + shippingFee;
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeItem,
        incrementQty,
        decrementQty,
        clearCart,
        totalPrice,
        itemsTotal,
        shippingFee,
        totalItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
