import { current } from "@reduxjs/toolkit";

export const addDecimals = (num) => {
  return (Math.round(num * 100) / 100).toFixed(2);
};

export const updateCart = (state) => {
  // Calculate the items price in whole number to avoid issues with
  // floating point number calculations
  const itemsPrice = state.cartItems.reduce(
    (acc, item) => acc + (item.selling_price * 100 * item.quantity) / 100,
    0
  );
  state.itemsPrice = addDecimals(itemsPrice);

  // Calculate the shipping pric
  let itemsCountWithShipping = 0; // To avoid division of product with free shipping
  const shippingPrice =
    state.cartItems.reduce((acc, item) => {
      if (item.shipping_price > 0) itemsCountWithShipping++;
      return acc + item.shipping_price;
    }, 0) / itemsCountWithShipping;
  state.shippingPrice = addDecimals(shippingPrice);

  const discountedPrice = state.cartItems.reduce(
    (acc, item) =>
      acc + (item.original_price - item.selling_price) * item.quantity,
    0
  );
  state.discountedPrice = addDecimals(discountedPrice);

  const totalPrice = itemsPrice + shippingPrice - discountedPrice;
  // Calculate the total price
  state.totalPrice = addDecimals(totalPrice);

  console.log("state:", current(state));

  // Save the cart to localStorage
  localStorage.setItem("cart", JSON.stringify(state));

  return state;
};
