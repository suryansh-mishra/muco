const express = require("express");
const userController = require("./../Controllers/userController");
const replyController = require("./../Controllers/replyController");
const postController = require("./../Controllers/postController");
const adminController = require("./../Controllers/adminController");
const router = express.Router({ mergeParams: true });
//router.use("/post/:postId/reply", replyRouter);
router.use(postController.checkPost);
router.route("/").post(userController.checkJWT, replyController.postReply);
router.post("/fixproblem", userController.checkJWT, adminController.fixProblem);
router
  .route("/delete/:replyId")
  .delete(userController.checkJWT, replyController.deleteReply);
router.patch(
  "/like/:replyId",
  userController.checkJWT,
  replyController.likeReply
);
router.patch(
  "/dislike/:replyId",
  userController.checkJWT,
  replyController.dislikeReply
);
module.exports = router;
