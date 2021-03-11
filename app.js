const express = require("express");
const { handle500s } = require("./errors");
const app = express();
const apiRouter = require("./routes/apiRouter");

app.use("/api", apiRouter);

app.use(handle500s);

module.exports = app;
