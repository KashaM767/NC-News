const express = require("express");
const { listApis } = require("./controllers/controllers");
const { handleSqlErrors, handleCustomErrors, handleServerErrors } = require("./errors");
const apiRouter = require("./routes/api-router.js");

const app = express();
app.use(express.json());
app.use('/api', apiRouter);


app.get('/api', listApis);

app.all("*", (req, res) => {
    res.status(404).send({ msg: "path not found" });
});

app.use(handleSqlErrors);
app.use(handleCustomErrors);
app.use(handleServerErrors);


module.exports = app;