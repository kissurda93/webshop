export default function indexed_db(action) {
  const indexedDB =
    window.indexedDB ||
    window.mozIndexedDB ||
    window.webkitIndexedDB ||
    window.msIndexedDB;

  if (!indexedDB) window.alert("Your browser doesn't support IndexedDB!");

  return new Promise((resolve, reject) => {
    const openRequest = indexedDB.open("gabor_shop_cart");

    openRequest.onupgradeneeded = () => {
      const db = openRequest.result;
      if (!db.objectStoreNames.contains("shopping_cart")) {
        db.createObjectStore("shopping_cart", {
          keyPath: "product_id",
        });
      }
    };

    openRequest.onsuccess = () => {
      const db = openRequest.result;
      resolve(db);
    };

    openRequest.onerror = (error) => {
      reject(new Error(error));
    };
  });
}

export const getAll = (db) => {
  const tx = db.transaction("shopping_cart", "readonly");
  tx.onerror = (error) => console.warn(error);

  return new Promise((resolve, reject) => {
    const getAllRequest = tx.objectStore("shopping_cart").getAll();

    getAllRequest.onsuccess = () => {
      resolve(getAllRequest.result);
    };

    getAllRequest.onerror = (error) => reject(new Error(error));
  });
};

export const get = (productId, db) => {
  const tx = db.transaction("shopping_cart", "readonly");
  tx.onerror = (error) => console.warn(error);

  return new Promise((resolve, reject) => {
    const getRequest = tx.objectStore("shopping_cart").get(productId);

    getRequest.onsuccess = () => resolve(getRequest.result);
    getRequest.onerror = (error) => reject(new Error(error));
  });
};

export const put = (productObject, db) => {
  const tx = db.transaction("shopping_cart", "readwrite");
  tx.onerror = (error) => console.warn(error);

  return new Promise((resolve, reject) => {
    const putRequest = tx.objectStore("shopping_cart").put(productObject);
    putRequest.onsuccess = () => resolve("Product added");
    putRequest.onerror = (error) => reject(new Error(error));
  });
};

export const remove = (id, db) => {
  const tx = db.transaction("shopping_cart", "readwrite");
  tx.onerror = (error) => console.warn(error);

  return new Promise((resolve, reject) => {
    const deleteRequest = tx.objectStore("shopping_cart").delete(id);
    deleteRequest.onsuccess = () => resolve("Product deleted");
    deleteRequest.onerror = (error) => reject(new Error(error));
  });
};
