const express = require("express");
const router = express.Router();
const userController = require("./../Controllers/userController");
const postController = require("./../Controllers/postController");
const replyRouter = require("./../Routes/replyRoute");
const reviewRouter = require("./reviewRouter.js");
router.get("/getAllpost", userController.checkJWT, postController.getAllPost);
router.get(
  "/getOnepost/:postId",
  userController.checkJWT,
  postController.getOnePost
);
router.use("/:postId/reply", replyRouter);
router.use("/:postId/review", reviewRouter);
router.route("/").post(userController.checkJWT, postController.postProblem);
router
  .route("/delete/:id")
  .delete(userController.checkJWT, postController.postdelete);
router.patch("/like/:id", userController.checkJWT, postController.likePost);
router.patch(
  "/dislike/:id",
  userController.checkJWT,
  postController.disLikePost
);
module.exports = router;
