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
        productObject.quantity = quantities[index];
        return productObject;
      });

      const totalQuantity = quantities.reduce(
        (total, quantity) => total + quantity,
        0
      );

      const prices = productInfos.map(
        (product) => product.quantity * product.price
      );
      const totalPrice = prices.reduce((total, current) => total + current, 0);

      return {
        productInfos,
        totalQuantity,
        totalPrice: parseInt(totalPrice),
      };
    } catch (error) {
      console.warn(error);
    }
  }
);

// export const fetchCartProducts = async () => {
//   try {
//     const db = await indexed_db();
//     const products = await getAll(db);
//     const quantities = products.map((product) => product.quantity);
//     const promises = products.map((item) =>
//       axios.get(`${import.meta.env.VITE_API_URL}/product/${item.product_id}`)
//     );
//     const resolvedPromises = await Promise.all(promises);
//     const productInfos = resolvedPromises.map((promise, index) => {
//       const productObject = promise.data.product;
//       productObject.quantity = quantities[index];
//       return productObject;
//     });
//     const totalQuantity = quantities.reduce(
//       (total, quantity) => total + quantity
//     );
//     return { productInfos, totalQuantity };
//   } catch (error) {
//     console.warn(error);
//   }
// };
