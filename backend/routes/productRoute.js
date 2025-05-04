import express from 'express';
import { createProduct, deleteProduct, getProducts, productDetails, updateProduct } from '../controllers/productController.js';
const router = express.Router();

router.route('/products')
  .post(createProduct)
  .get(getProducts);

  router.route('/products/:id')
  .get(productDetails)
  .put(updateProduct)
  .delete(deleteProduct);



export default router;
