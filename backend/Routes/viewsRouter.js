const express = require("express");
const viewsController = require("./../Controllers/viewsController");
const authController = require("./../Controllers/authcontroller");
const userController = require("./../Controllers/userController");
const router = express.Router();
router.get("/login", viewsController.login);
router.get("/home", userController.isLoggedIn, viewsController.home);
router.get("/homepage", userController.isLoggedIn, viewsController.homepage);
router.get("/users/signup/:verifyToken", viewsController.signupverified);
router.get("/yourPosts", userController.isLoggedIn, viewsController.yourPosts);
router.get(
  "/postDetail/:postid",
  userController.isLoggedIn,
  viewsController.postDetail
);
module.exports = router;
