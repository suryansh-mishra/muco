const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const app = require("./app");
const mongoose = require("mongoose");
process.on("uncaughtException", (err) => {
  console.log(`Error:  ${err.message}`);
  console.log(`Shutting down the server  due to  uncaught Exception `);
  process.exit(1);
});

const server = app.listen(process.env.PORT, () => {
  console.log(`Server is Working on  http://localhost:${process.env.PORT}`);
});
const DB = process.env.DATABASE.replace(
  "<password>",
  process.env.DATABASE_PASSWORD
);
console.log(DB);
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log("DB connection successful!"));

process.on("unhandledRejection", (err) => {
  console.log(`Error:  ${err.message}`);
  console.log(`Shutting down the server  due to unhandled  promise rejection `);
  server.close(() => {
    process.exit(1);
  });
});
