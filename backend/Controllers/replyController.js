const mongoose = require("mongoose");
const Reply = require("./../Models/replyModel");
const AppError = require("./../utlis/appError");
const catchAsync = require("../utlis/catchAsync");
const User = require("./../Models/userModels");
exports.postReply = catchAsync(async function (req, res, next) {
  req.body.user = req._id;
  req.body.post = req.params.postId;
  const reply = await Reply.create(req.body);
  res.status(201).json({
    status: "success",
    message: "Reply posted",
    data: {
      reply,
    },
  });
});

exports.deleteReply = catchAsync(async function (req, res, next) {
  const reply = await Reply.findById(req.params.replyId);
  if (!reply) return next(new AppError("No reply found with this Id", 400));
  if (reply.user._id != req._id)
    return next(
      new AppError("You don't have access to delete this reply", 400)
    );
  await Reply.findByIdAndDelete(req.params.replyId);
  res.status(200).json({
    status: "success",
    message: "Your reply is deleted",
  });
});

exports.likeReply = catchAsync(async function (req, res, next) {
  const reply = await Reply.findById(req.params.replyId);
  if (!reply) return next(new AppError("No reply available", 400));
  const user = await User.findById(req._id);
  let likedby = reply.likedBy;
  if (!likedby.includes(req._id)) {
    reply.likedBy = [req._id, ...likedby];
    reply.likes = reply.likes + 1;
    await reply.save({ validateBeforeSave: false });
  }
  res.status(200).json({
    status: "success",
    message: "reply Liked",
    data: {
      name: user.name,
    },
  });
  next();
});
exports.dislikeReply = catchAsync(async function (req, res, next) {
  reply = await Reply.findById(req.params.replyId);
  if (!reply) return next(new AppError("No reply available", 400));
  let likedby = reply.likedBy;
  if (likedby.includes(req._id)) {
    const liked = likedby.filter((el) => el != req._id);
    reply.likedBy = [...liked];
    reply.likes = reply.likes - 1;
    await reply.save({ validateBeforeSave: false });
  }
  res.status(200).json({
    status: "success",
    message: "Reply Disliked",
  });
});
