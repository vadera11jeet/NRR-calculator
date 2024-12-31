const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const { status } = require("http-status");
const { errorResponse } = require("./configs/responseConfig");
const AppError = require("./utils/appError");
const routes = require("./routes");

dotenv.config();

const app = express();

app.use(express.json());

const whiteList = ["http://localhost:3000", "http://localhost:5173"];

const corsOptions = {
  origin: function (origin, callback) {
    if (whiteList.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};

app.use(cors(corsOptions));

const PORT = process.env.PORT || 5500;

// health check route
app.get("/", (_, res, next) => {
  res.status(status.OK).send("Hello world");
});

app.use("/api/v1", routes);

app.all("*", (_, res, next) => {
  next(new AppError("Can't find route", status.NOT_FOUND));
});

app.use((err, _, res, next) => {
  if (res.headersSent) {
    return next(err);
  }
  console.log(err.stack);
  errorResponse(
    res,
    err.statusCode ?? status.INTERNAL_SERVER_ERROR,
    err.message
  );
});

app.listen(PORT, () => console.log(`Server is running on PORT: ${PORT}`));
