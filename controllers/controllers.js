const { topicData } = require("../db/data/test-data/index");
const { retrieveTopics, retrieveArticleById } = require("../models/models");


exports.getTopics = (req, res, next) => {
    retrieveTopics()
        .then((topics) => res.status(200).send({ topics }))
        .catch(next)
};

exports.getArticleById = (req, res) => {
    const { id } = req.params.article_id
    retrieveArticleById(id).then((rows) => {
        res.status(200).send(rows)
    })
}


