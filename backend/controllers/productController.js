import Product from '../models/product.js';
import { errorHandler } from '../utils/error.js';
import StatusCodes from '../utils/constants.js';

// Create a new product
export const createProduct = async (req, res, next) => {
  try {
    console.log(req.body)
    const newProduct = new Product(req.body);
    const savedProduct = await newProduct.save();
    res.status(StatusCodes.OK).json(savedProduct);
  } catch (err) {
    next(err);
  }
};

// Get all products
export const getProducts = async (req, res, next) => {
  try {
    const products = await Product.find();
    res.status(StatusCodes.OK).json(products);
  } catch (err) {
    next(err);
  }
};

// Update a product by ID (requires auth)
export const updateProduct = async (req, res, next) => {
  try {
    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    if (!updated) return next(errorHandler(StatusCodes.NOT_FOUND, 'Product not found'));
    res.status(StatusCodes.OK).json(updated);
  } catch (err) {
    next(err);
  }
};

// Delete a product by ID (requires auth)
export const deleteProduct = async (req, res, next) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return next(errorHandler(StatusCodes.NOT_FOUND, 'Product not found'));
    res.status(StatusCodes.OK).json({ message: 'Product deleted successfully' });
  } catch (err) {
    next(err);
  }
};

// Delete a product by ID (requires auth)
export const productDetails = async (req, res, next) => {
    try {
      const product = await Product.findById(req.params.id);
      if (!product) return next(errorHandler(StatusCodes.NOT_FOUND, 'Product not found'));
      res.status(StatusCodes.OK).json(product);
    } catch (err) {
      next(err);
    }
  };


