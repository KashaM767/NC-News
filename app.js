const express = require("express");
const { getTopics, listApis, getArticles } = require("./controllers/controllers");


const app = express();
app.use(express.json());

app.get('/api/topics', getTopics)

app.get('/api', listApis)

app.get('/api/articles', getArticles)

app.all("*", (req, res) => {
    res.status(404).send({ msg: "path not found" });
});

app.use((err, req, res, next) => {
    if (err.code === "22P02") {
        res.status(400).send({ msg: "bad request" });
    } else if (err.status) {
        res.status(err.status).send({ msg: err.msg });
    } else if (err.status) {
        res.status(500).send({ msg: "internal server error" });
    }
})



module.exports = app;