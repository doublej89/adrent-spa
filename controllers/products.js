const Product = require("../models/Product");
const Category = require("../models/Category");

exports.getAll = function(req, res, next) {
  Product.find({})
    .populate("categories")
    .exec((err, products) => {
      if (err) return res.status(404).send(err);
      res.status(200).json(products);
    });
};

exports.addProduct = function(req, res, next) {
  const categories = req.body.categories.split(",").map(v => v.trim());
  const newProduct = {};
  newProduct.name = req.body.name;
  newProduct.location = {
    name: req.body.locationName,
    lat: req.body.lat,
    lng: req.body.lng
  };
  newProduct.status = req.body.status;
  newProduct.size = req.body.size;
  newProduct.sides = req.body.sides;
  newProduct.current_price = req.body.current_price;
  (newProduct.viewers_statistics = {
    area_type: req.body.area_type,
    area_size: req.body.area_size,
    total_population: req.body.total_population,
    male: req.body.male,
    female: req.body.female,
    ann_household_income: req.body.ann_household_income
  }),
    (newProduct.nearby_landmarks = req.body.nearby_landmarks);
  Product.findOne({ name: req.body.name }).then(product => {
    if (product) {
      Product.findOneAndUpdate(
        { name: req.body.name },
        { $set: newProduct },
        { new: true }
      ).then(prod => res.json(prod));
    } else {
      new Product(newProduct).save().then(prod => {
        let categoryBody = [];
        let foundCats = [];
        let categoryCounter = 0;
        let savedCounter = 0;

        categories.forEach(category => {
          Category.findOne({ name: category }).then(cat => {
            if (cat) {
              foundCats.push(cat);
              categoryCounter += 1;
              cat.products.push(prod);
              cat.save().then(c => {
                savedCounter += 1;
                if (foundCats.length > 0 && savedCounter === foundCats.length) {
                  foundCats.forEach(val => {
                    const isPresent = prod.categories.some(
                      c => c._id == val._id
                    );
                    if (!isPresent) prod.categories.push(val);
                  });
                  prod.save();
                }
              });
            } else {
              categoryBody.push({
                name: category,
                products: [prod._id]
              });
              categoryCounter += 1;
            }
            if (categoryCounter >= categories.length) {
              if (categoryBody.length > 0) {
                let newCategories = [];
                categoryBody.forEach(v => {
                  Category.create(v).then(newCat => {
                    newCategories.push(newCat);
                    if (newCategories.length == categoryBody.length) {
                      newCategories.forEach(cat => {
                        const isPresent = prod.categories.some(
                          c => c._id == cat._id
                        );
                        if (!isPresent) prod.categories.push(cat);
                      });
                      prod.save();
                    }
                  });
                });
              }
            }
          });
        });
        res.send("end of operation!");
      });
    }
  });
};

exports.getProduct = function(req, res, next) {
  Product.findById(req.params.id)
    .populate("categories")
    .then(product => res.json(product))
    .catch(err => res.status(404).json({ error: "No post found" }));
};

exports.getAllByCategory = function(req, res, next) {
  Category.findById(req.params.id)
    .populate({
      path: "products",
      model: "Product",
      populate: {
        path: "categories",
        model: "Category"
      }
    })
    .then(results => {
      return res.json(results);
    });
};

exports.getProductByLocation = function(req, res, next) {
  const [lat, lng] = req.params.coords.split(",");
  console.log("lat: " + lat + ", " + "lng: " + lng);

  Product.findOne({ "location.lat": lat, "location.lng": lng })
    .populate("categories")
    .then(product => res.json(product));
};
