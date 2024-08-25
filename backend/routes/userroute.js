const express = require("express");
const { registerUser, loginUser, logOutUser, forgotPassword, resetPassword, getUserDetails, updatePassword, updateUserProfile, getAllUsers, getSingleUsers, updateUserRole, deleteUser } = require("../controllers/userController");
const { route } = require("./productRoute");
const { isAuthenticatedUser, authoriseRoles } = require("../middleware/auth");
const router = express.Router();



router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/password/forgot").post(forgotPassword);
router.route("/password/reset/:token").put(resetPassword);
router.route("/logout").get(logOutUser);
router.route("/me").get(isAuthenticatedUser,getUserDetails);
router.route("/password/update").put(isAuthenticatedUser,updatePassword)
router.route("/me/update").put(isAuthenticatedUser,updateUserProfile)
router.route("/admin/users").get(isAuthenticatedUser,authoriseRoles("admin"), getAllUsers);
router.route("/admin/user/:id").get(isAuthenticatedUser,authoriseRoles("admin"), getSingleUsers);
router.route("/admin/user/:id").put(isAuthenticatedUser,authoriseRoles("admin"), updateUserRole);
router.route("/admin/user/:id").delete(isAuthenticatedUser,authoriseRoles("admin"), deleteUser);

module.exports = router