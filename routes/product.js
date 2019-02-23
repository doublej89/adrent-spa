const ProductControlls = require("../controllers/products");

module.exports = function(app) {
  app.get("/api/product", ProductControlls.getAll);
  app.post("/api/product", ProductControlls.addProduct);
  app.get("/api/product/:id", ProductControlls.getProduct);
  app.get("/api/category/:id", ProductControlls.getAllByCategory);
  app.get(
    "/api/product/location/:coords",
    ProductControlls.getProductByLocation
  );
};
