const express = require("express");
const { handle500s, handle400s, handleCustomError } = require("./errors");
const app = express();
const apiRouter = require("./routes/apiRouter");

app.use(express.json());

app.use("/api", apiRouter);

app.use(handle400s);

app.use(handleCustomError);

app.use(handle500s);

module.exports = app;
