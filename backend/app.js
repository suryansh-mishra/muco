const express = require("express");
const userRouter = require("./Routes/userRoute");
const cityRouter = require("./Routes/cityRoute");
const globalErrorHandler = require("./Controllers/errorController");
const app = express();
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const helmet = require("helmet");
const AppError = require("./utlis/appError");
const postRouter = require("./Routes/postRoute");
app.use(express.json());
app.use(helmet());
app.use(mongoSanitize());
app.use(xss());
// route imports
app.use("/api/v1/users", userRouter);
app.use("/api/v1/city", cityRouter);
app.use("/api/v1/post", postRouter);
////To handle unhandled route
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

////Global middleware to handle all sorts of errors
app.use(globalErrorHandler);
module.exports = app;
