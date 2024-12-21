const express = require("express");
const dotenv = require("dotenv");
dotenv.config();

const app = express();

const PORT = process.env.PORT || 5500;

app.get("/", (req, res, next) => {});

app.listen(PORT, () => console.log(`Server is running on PORT: ${PORT}`));
