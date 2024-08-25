const express = require("express");
const {getAdminProducts, getAllProducts, createProduct, updateProduct, deleteProduct,productDetails, createProductReview, getProductReviews, deleteProductReview } = require("../controllers/productController");
const {isAuthenticatedUser,authoriseRoles } = require("../middleware/auth");
const router = express.Router();

router.route("/products").get(getAllProducts);
router.route("/admin/products").get(isAuthenticatedUser, authoriseRoles("admin"), getAdminProducts);
router.route("/admin/product/new").post(isAuthenticatedUser, authoriseRoles("admin"), createProduct);
router.route("/admin/product/:id").put(isAuthenticatedUser, authoriseRoles("admin"),updateProduct);
router.route("/admin/product/:id").delete(isAuthenticatedUser, authoriseRoles("admin"),deleteProduct);
router.route("/products/:id").get(productDetails);
router.route("/review").put(isAuthenticatedUser,createProductReview);
router.route("/reviews").get(getProductReviews);
router.route("/reviews").delete(isAuthenticatedUser,deleteProductReview);
module.exports = router;