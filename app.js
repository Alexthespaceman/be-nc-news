const express = require("express");
const { handle500s } = require("./errors");
const app = express();
const apiRouter = require("./routes/apiRouter");

app.use(express.json());

app.use("/api", apiRouter);

app.use(handle404);

app.use(handle500s);

module.exports = app;
