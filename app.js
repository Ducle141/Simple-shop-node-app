const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const productRoutes = require("./api/routes/products");
const orderRoutes = require("./api/routes/orders");

mongoose.connect(
  "mongodb+srv://brianfire113:" +
    process.env.MONGO_ATLAS_PW +
    "@node-rest-shop-dqrpw.mongodb.net/test?retryWrites=true&w=majority",
  {
    useMongoClient: true
  }
);

mongoose.Promise = global.Promise;

//routes hangle get request
app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Header",
    "Origin, X-Request-With, Content-Type, Accept, Authorization"
  );
  if (req.method == "OPTIONS") {
    res.header("Access-Control-Allow-Header", "PUT, POST, PATCH, DELETE");
    return res.status(200).json({});
  }
  next();
});

//From the server to the client, in the header, we tells the browser that OK you can
//access it => client can access to that server

app.use("/products", productRoutes);
app.use("/orders", orderRoutes);

app.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});

module.exports = app;
