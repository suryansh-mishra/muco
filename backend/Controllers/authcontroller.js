const User = require("./../Models/userModels");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const crypto = require("crypto");
const sendEmail = require("./../utlis/email");
const userController = require("./userController");
const catchAsync = require("./../utlis/catchAsync");
const AppError = require("./../utlis/appError");

////creates a JWT token
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

////A function that calls the sendEmail function, which eventually sends the mail
const sendmail = async (res, user, message, subject, signUp) => {
  try {
    await sendEmail({
      email: user.email,
      subject: `${subject}`,
      message: message,
    });
    res.status(200).json({
      status: "success",
      message: "Reset Token sent to you mail Id",
    });
  } catch (err) {
    if (signUp) {
      await User.deleteOne({ _id: user._id });
    }
    res.status(400).json({
      status: "Fail",
      message: err,
    });
  }
};

///// A function to filter the objects during profile update, In case the user request to update some unauthorized keys,
///// In that case that key will be eliminated
const filterobj = (options, ...filter) => {
  const newObj = {};
  Object.keys(options).forEach((el) => {
    if (filter.includes(el)) {
      newObj[el] = options[el];
    }
  });
  return newObj;
};

/////Creates a model in mongoose database as per the data given in signUP form
exports.signupcreate = catchAsync(async (req, res, next) => {
  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    confirmpassword: req.body.confirmpassword,
    city: req.body.city,
  });

  //// Creates a verification Token which is later sent through mail, and also a copy of it is stored in user model for verification
  const verifyToken = user.verifytoken();
  await user.save({ validateBeforeSave: false });
  user.password = undefined;
  user.verifyToken = undefined;
  user.verified = undefined;
  const verifyURL = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/users/signup/${verifyToken}`;

  /////message contains a link that is sent to User's mail, cliking on the link will verify the mailID
  const message = `Verify your mailID, Inorder to login into MUCO,${verifyURL} `;
  const subject = "Verification mail sent to your mailID, kindly verify it";
  sendmail(res, user, message, subject, true);
});

////To verify the MailID
exports.signupverified = catchAsync(async (req, res, next) => {
  const user = await User.findOne({
    verifyToken: req.params.token,
    verifyTokenExpires: { $gte: Date.now() },
  });
  if (!user) {
    return next(
      new AppError(
        "Invalid Token or token expired, fill the Sign Up form again",
        400
      )
    );
  }
  user.verified = true;
  user.verifyToken = undefined;
  User.verifyTokenExpires = undefined;
  await user.save({ validateBeforeSave: false });
  const token = signToken(user._id);
  res.status(200).json({
    status: "success",
    message: "Welcome to Muco",
    token,
    data: {
      user,
    },
  });
});

////To login
exports.login = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  const token = signToken(user._id);
  res.status(200).json({
    status: "success",
    message: "Welcome to Muco",
    token,
    data: {
      user,
    },
  });
});

/////If the user forgets his password then a Reset Token is created which is sent to the mail
exports.passwordResetToken = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) return next(new AppError("Reset Token sent to your mail ID", 200));
  const resetToken = user.verifytoken();
  await user.save({ validateBeforeSave: false });
  const resetURL = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/users/passwordReset/${resetToken}`;
  const message = `Verify your mailID, Inorder to login into MUCO,${resetURL} `;
  const subject = "Your password reset token (valid for 10 min)";
  sendmail(res, user, message, subject, false);
});

/////On clicking the link, a page will open to create a new password
exports.passwordReset = catchAsync(async (req, res, next) => {
  const user = await User.findOne({
    verifyToken: req.params.id,
    verifyTokenExpires: { $gte: Date.now() },
  });
  if (!user)
    return next(new AppError("Try again, Invalid Token or token expired", 401));
  user.password = req.body.password;
  user.confirmpassword = req.body.confirmpassword;
  user.verifyTokenExpires = undefined;
  user.verifyToken = undefined;
  await user.save();
  res.status(201).json({
    status: "Success",
    message: "Password Changed",
    data: {
      user,
    },
  });
});

///To update the password
exports.passwordUpdate = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ _id: req._id }).select("+password");
  const compare = await user.correctPassword(
    req.body.currentPassword,
    user.password
  );
  if (!compare) return next(new AppError("Current Password is Invalid", 400));
  if (req.body.currentPassword === req.body.password)
    return next(
      new AppError("Password should not be same as the old one", 400)
    );
  user.password = req.body.password;
  user.confirmpassword = req.body.confirmpassword;
  await user.save();
  const token = signToken(user._id);
  res.status(200).json({
    status: "Success",
    message: "Your Password has been reset,Please Login again",
    url: `${req.protocol}://${req.get("host")}/api/v1/users/login`,
    token,
  });
});

///To update the Profile, which includes certain given fields
exports.updateMe = catchAsync(async (req, res, next) => {
  if (req.body.password)
    return next(
      new AppError("To change the password, go to update password", 401)
    );

  ///This function will eliminate the unauthorized fields
  const filteredobj = filterobj(req.body, "city", "name");

  const user = await User.updateOne({ _id: req._id }, filteredobj);
  res.status(201).json({
    status: "Success",
    message: `${Object.keys(filteredobj)} changed`,
  });
});
