const { topicData } = require("../db/data/test-data/index");
const { retrieveTopics, retrieveArticleById } = require("../models/models");


exports.getTopics = (req, res, next) => {
    retrieveTopics()
        .then((topics) => res.status(200).send({ topics }))
        .catch(next)
};

exports.getArticleById = (req, res, next) => {
    const { article_id } = req.params
    retrieveArticleById(article_id).then((rows) => {
        res.status(200).send({ article: rows })
    }).catch(next)
}


