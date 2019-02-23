const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema({
  name: { type: String, required: true },
  location: {
    name: { type: String },
    lat: { type: String },
    lng: { type: String }
  },
  description: { type: String },
  status: { type: String },
  size: { type: String },
  sides: { type: Number },
  current_price: [{ amount: { type: String }, duration: { type: String } }],
  viewers_statistics: {
    area_type: { type: String },
    area_size: { type: String },
    total_population: { type: String },
    male: { type: String },
    female: { type: String },
    ann_household_income: { type: Number }
  },
  categories: [
    {
      type: Schema.Types.ObjectId,
      ref: "Category"
    }
  ],
  nearby_landmarks: [
    {
      name: { type: String },
      dist: { type: Number },
      icon_hint: { type: String }
    }
  ]
});

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
