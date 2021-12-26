const mongoose = require("mongoose");
const postSchema = new mongoose.Schema(
  {
    discription: {
      type: String,
      required: true,
      minlength: [10, "Discription shall be atleast of 10 words"],
      maxlength: [200, "Discription shall not exceed above 200 words"],
    },
    photos: {
      type: [String],
      //require: true,
    },
    address: {
      type: String,
      required: true,
    },
    city: {
      type: mongoose.Schema.ObjectId,
      ref: "City",
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    location: {
      type: {
        type: String,
        default: "Point",
        enum: ["Point"],
      },
      coordinate: [Number],
      address: String,
      discription: String,
    },
    likes: {
      type: Number,
      default: 0,
    },
    likedBy: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    status: {
      type: String,
      enum: [
        "Pending",
        "Accepted",
        "Inprogress",
        "Failed",
        "Success",
        "Rejected",
      ],
      default: "Pending",
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
postSchema.virtual("reply", {
  ref: "Reply",
  foreignField: "post",
  localField: "_id",
});
postSchema.pre(/^find/, function (next) {
  this.populate({ path: "user", select: "name _id profile" });
  next();
});
postSchema.methods.populateReply = function () {
  this.constructor.populate({ path: "reply" });
};
const Post = mongoose.model("Post", postSchema);
module.exports = Post;
