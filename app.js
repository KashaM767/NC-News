const express = require("express");
const { getTopics, listApis, listComments, getArticleById, } = require("./controllers/controllers");
const { handleSqlErrors, handleCustomErrors, handleServerErrors } = require("./errors");

const app = express();
app.use(express.json());

app.get('/api/topics', getTopics)

app.get('/api/articles/:article_id', getArticleById)

app.get('/api', listApis)

app.get('/api/articles/:article_id/comments', listComments)

app.all("*", (req, res) => {
    res.status(404).send({ msg: "path not found" });
});

app.use(handleSqlErrors);
app.use(handleCustomErrors);
app.use(handleServerErrors);


module.exports = app;