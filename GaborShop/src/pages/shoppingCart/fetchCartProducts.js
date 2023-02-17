import axios from "axios";
import indexed_db from "../../indexedDB/indexedDB";
import { getAll } from "../../indexedDB/indexedDB";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchCartProducts = createAsyncThunk(
  "cartProducts/getAndFetchProducts",
  async () => {
    try {
      const db = await indexed_db();
      const products = await getAll(db);
      const quantities = products.map((product) => product.quantity);

      const promises = products.map((item) =>
        axios.get(`${import.meta.env.VITE_API_URL}/product/${item.product_id}`)
      );
      const resolvedPromises = await Promise.all(promises);

      const productInfos = resolvedPromises.map((promise, index) => {
        const productObject = promise.data.product;
        productObject.discountPercentage = Number(
          productObject.discountPercentage
        );
        productObject.price =
          Number(productObject.price) -
          Number(productObject.price) *
            (productObject.discountPercentage / 100);
        productObject.quantity = quantities[index];
        productObject.subTotal = quantities[index] * productObject.price;
        return productObject;
      });

      const totalQuantity = quantities.reduce(
        (total, quantity) => total + quantity,
        0
      );

      const totalPrice = productInfos.reduce(
        (total, product) => total + product.subTotal,
        0
      );

      return {
        productInfos,
        totalQuantity,
        totalPrice,
      };
    } catch (error) {
      console.warn(error);
    }
  }
);
