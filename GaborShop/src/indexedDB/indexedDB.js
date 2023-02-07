export default function indexed_db(action) {
  const indexedDB =
    window.indexedDB ||
    window.mozIndexedDB ||
    window.webkitIndexedDB ||
    window.msIndexedDB;

  if (!indexedDB) window.alert("Your browser doesn't support IndexedDB!");

  const openRequest = indexedDB.open("gabor_shop_cart", 1);
  let db;

  openRequest.onerror = (error) => {
    console.warn(error);
  };

  openRequest.onupgradeneeded = () => {
    db = openRequest.result;
    if (!db.objectStoreNames.contains("shopping_cart")) {
      db.createObjectStore("shopping_cart", {
        keyPath: "product_id",
      });
    }
  };

  openRequest.onsuccess = () => {
    db = openRequest.result;
  };

  function makeTX(storeName, mode) {
    const tx = db.transaction(storeName, mode);
    tx.onerror = (error) => console.warn(error);
    return tx;
  }

  switch (action) {
    case "put":
      return (productObject) => {
        const tx = makeTX("shopping_cart", "readwrite");

        const addRequest = tx.objectStore("shopping_cart").put(productObject);

        addRequest.onerror = (error) => console.warn(error);
      };

    case "get":
      return (productId) => {
        const tx = makeTX("shopping_cart", "readwrite");

        return new Promise((resolve, reject) => {
          const getRequest = tx.objectStore("shopping_cart").get(productId);

          getRequest.onsuccess = () => resolve(getRequest.result);
          getRequest.onerror = (error) => reject(new Error(error));
        });
      };
    default:
      break;
  }
}
