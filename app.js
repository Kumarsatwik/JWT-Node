const express = require("express");
const morgan = require("morgan");
const createError = require("http-errors");
require("dotenv").config();
require("./helpers/init_mongodb");
require("./helpers/init_redis");
const { verifyAccessToken } = require("./helpers/jwt_helper");
const mongoose = require('mongoose')

const authRoute = require("./Routes/Auth.route");

const app = express();
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", verifyAccessToken, async (req, res, next) => {
  console.log(req.headers["authorization"]);
  res.send("hello from express");
});

app.use("/auth", authRoute);

app.use(async (res, req, next) => {
  //   const error = new Error("Not Found");
  //   error.status = 404;
  next(createError.NotFound("This route does not exist"));
});
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    error: {
      status: err.status || 500,
      message: err.message,
    },
  });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log("server is running");
});
