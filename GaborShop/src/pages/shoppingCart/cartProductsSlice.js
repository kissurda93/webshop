import { createSlice } from "@reduxjs/toolkit";
import { fetchCartProducts } from "./fetchCartProducts";

const initialState = {
  productsInCart: [],
  quantity: 0,
  totalPrice: 0,
  status: "idle",
  error: null,
};

function totalQuantityOnRemove(object, id) {
  const product = object.productsInCart.find((product) => product.id == id);
  return object.quantity - product?.quantity;
}

function findProductIndex(array, id) {
  const index = array.findIndex((product) => product.id == id);
  return index;
}

export const cartProductsSlice = createSlice({
  name: "cartProducts",
  initialState,
  reducers: {
    removeProduct: (state, action) => {
      state.quantity = totalQuantityOnRemove(state, action.payload);
      state.productsInCart = state.productsInCart.filter(
        (product) => product.id !== action.payload
      );
    },
    changeProductQuantity: (state, action) => {
      const productIndex = findProductIndex(
        state.productsInCart,
        action.payload.id
      );
      state.productsInCart[productIndex].quantity =
        action.payload.method === "increment"
          ? state.productsInCart[productIndex].quantity + 1
          : state.productsInCart[productIndex].quantity - 1;
    },
    changeProductSubTotal: (state, action) => {
      const productIndex = findProductIndex(
        state.productsInCart,
        action.payload.id
      );
      state.productsInCart[productIndex].subTotal =
        action.payload.method === "increment"
          ? state.productsInCart[productIndex].subTotal +
            state.productsInCart[productIndex].price
          : state.productsInCart[productIndex].subTotal -
            state.productsInCart[productIndex].price;
    },
    changeTotals: (state) => {
      const newTotalQuantity = state.productsInCart.reduce(
        (total, product) => total + product.quantity,
        0
      );

      const newTotalPrice = state.productsInCart.reduce(
        (total, product) => total + product.subTotal,
        0
      );
      state.quantity = newTotalQuantity;
      state.totalPrice = newTotalPrice;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCartProducts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCartProducts.fulfilled, (state, action) => {
        state.productsInCart = action.payload.productInfos;
        state.quantity = action.payload.totalQuantity;
        state.totalPrice = action.payload.totalPrice;
        state.status = "succeeded";
      })
      .addCase(fetchCartProducts.rejected, (state, action) => {
        state.productsInCart = initialState.productsInCart;
        state.quantity = initialState.quantity;
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const {
  removeProduct,
  changeProductQuantity,
  changeTotals,
  changeProductSubTotal,
} = cartProductsSlice.actions;

export default cartProductsSlice.reducer;
