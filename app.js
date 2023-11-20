const express = require("express");
const { getTopics, listApis } = require("./controllers/controllers");


const app = express();
app.use(express.json());

app.get('/api/topics', getTopics)

app.get('/api', listApis)

app.all("*", (req, res) => {
    res.status(404).send({ msg: "path not found" });
});

app.use((err, req, res, next) => {
    res.status(500).send({ msg: "internal server error" });
})



module.exports = app;