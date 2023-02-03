export default function webSql() {
  const web_sql = openDatabase(
    "gabor_shop_cart",
    "1.0",
    "Shopping Cart",
    2 * 1024 * 1024
  );

  // web_sql.transaction(function (tx) {
  //   tx.executeSql("DROP TABLE CART_DATA");
  // });

  web_sql.transaction(function (tx) {
    tx.executeSql(
      "CREATE TABLE IF NOT EXISTS CART_DATA (product_id, quantity)"
    );
  });

  return web_sql;
}
