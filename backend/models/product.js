import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    image_urls: {
      type: [String],
      default: [],
    }
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

export default Product;
