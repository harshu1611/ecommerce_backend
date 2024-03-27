import express from 'express';
import { isAdmin } from '../middlewares/auth.js';
import { singleUpload } from '../middlewares/multer.js';
import { deleteProduct, getAdminProducts, getAllCategories, getSingleProduct, latestProducts, newProduct, searchAllProducts, updateProduct } from '../controllers/product.js';
const app = express.Router();
app.post("/new", isAdmin, singleUpload, newProduct); //singleproduct is a multer middleware to get the uploaded photo
app.get("/latest", latestProducts);
app.get("/all", searchAllProducts);
app.get("/categories", getAllCategories);
app.get("/admin-products", isAdmin, getAdminProducts);
app.route("/:id").get(getSingleProduct).put(isAdmin, singleUpload, updateProduct).delete(isAdmin, deleteProduct);
export default app;
