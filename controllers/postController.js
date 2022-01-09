const mongoose = require("mongoose");
const City = require("./../Models/cityModel");
const AppError = require("../utlis/appError");
const catchAsync = require("../utlis/catchAsync");
const Post = require("./../Models/postModel");
const User = require("./../Models/userModels");
const APIFeatures = require("./../utlis/apiFeatures");
exports.postProblem = catchAsync(async function (req, res, next) {
  const post = await Post.create(req.body);
  if (!post) return next(new AppError("No post available", 400));
  post.user = req._id;
  const user = await User.findById(req._id);
  post.city = user.cityId;
  post.cityName = user.cityId;
  post.save({ validateBeforeSave: false });
  res.status(201).json({
    status: "success",
    message: "Review Posted",
    data: {
      post,
      name: user.name,
      city: user.city,
    },
  });
});
exports.postdelete = catchAsync(async function (req, res, next) {
  const post = await Post.findById(req.params.id);
  if (!post) return next(new AppError("No post available", 400));
  // console.log("hello", post);
  if (post.user._id != req._id)
    return next(
      new AppError("You don't have the access to delete this post", 400)
    );
  await Post.findByIdAndDelete(req.params.id);
  res.status(200).json({
    status: "success",
    message: "Post Deleted",
  });
});

exports.likePost = catchAsync(async function (req, res, next) {
  const post = await Post.findById(req.params.id);
  if (!post) return next(new AppError("No post available", 400));
  const user = await User.findById(req._id);
  let likedby = post.likedBy;

  if (!likedby.includes(req._id)) {
    user.likedPosts = user.likedPosts.push(post._id);
    post.likedBy = post.likedBy.push(req._id);
    post.likes = post.likes + 1;
    if (post.likes >= 4) post.status = "Accepted";
    await post.save({ validateBeforeSave: false });
    await user.save({ validateBeforeSave: false });
  }
  res.status(200).json({
    status: "success",
    message: "Post Liked",
    data: {
      name: user.name,
    },
  });
});
exports.disLikePost = catchAsync(async function (req, res, next) {
  post = await Post.findById(req.params.id);
  const user = await User.findById(req._id);
  if (!post) return next(new AppError("No post available", 400));
  let likedby = post.likedBy;

  if (likedby.includes(req._id)) {
    const liked = likedby.filter((el) => el != req._id);
    post.likedBy = [...liked];
    post.likes = post.likes - 1;
    if (post.likes < 4) post.status = "Pending";
    await post.save({ validateBeforeSave: false });

    user.likedPosts = user.likedPosts.filter((el) => {
      return String(el) !== String(post._id);
    });

    await user.save({ validateBeforeSave: false });
  }
  res.status(200).json({
    status: "success",
    message: "Post Disliked",
  });
});

exports.checkPost = catchAsync(async function (req, res, next) {
  const post = await Post.findById(req.params.postId);
  if (!post) return next(new AppError("No post with the given Id", 400));
  next();
});

exports.getAllPost = catchAsync(async function (req, res, next) {
  const user = await User.findById(req._id).select("+role");
  //console.log("hello", user);
  let post;
  const city = await City.findOne({ name: req.params.city });
  if (user.role === "admin") {
    post = Post.find({
      status: { $in: ["Accepted", "Inprogress"] },
      createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
      city: city._id,
    });
  }
  if (user.role === "user") {
    post = Post.find({
      status: { $in: ["Pending", "Accepted"] },
      createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
      city: city._id,
    });
  }
  if (!post)
    return res.status(400).json({
      result: "fail",
      message: "No data",
    });
  const queryString = req.query;
  const postquery = new APIFeatures(post, {
    sort: "-createdAt, likes",
    page: queryString.page,
  })
    .sort()
    .pagination();
  const allpost = await postquery.query;

  res.status(200).json({
    status: "success",
    message: "List of all the posts",
    result: allpost.length,
    data: {
      Post: allpost,
    },
  });
});

exports.getOnePost = catchAsync(async function (req, res, next) {
  const post = await Post.findById(req.params.postId).populate("reply");
  res.status(200).json({
    status: "success",
    messages: "Post is ready to view",
    data: {
      post,
    },
  });
});
exports.getYourPosts = catchAsync(async function (req, res, next) {
  const filter = req.params.filter;
  const user = await User.findById(req._id)
    .select("name profile city")
    .populate({
      path: "yourPosts",
      match: { status: filter },
      options: { sort: { createdAt: -1 } },
    });
  res.status(200).json({
    status: "success",
    message: "Your Posts ",
    data: {
      user,
    },
  });
});

exports.getLikedPosts = catchAsync(async function (req, res, next) {
  const user = await User.findById(req._id)
    .select("name profile city")
    .populate({
      path: "likedPosts",
      options: { sort: { createdAt: -1 } },
    });
  res.status(200).json({
    status: "success",
    message: "Your Liked Posts ",
    data: {
      user,
    },
  });
});
