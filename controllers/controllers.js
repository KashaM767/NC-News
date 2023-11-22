const { topicData, articleData, userData, commentData } = require("../db/data/test-data/index");
const { retrieveTopics, readAllApis, commentsByArticle } = require("../models/models");


exports.getTopics = (req, res, next) => {
    retrieveTopics()
        .then((topics) => res.status(200).send({ topics }))
        .catch(next)
};

exports.listApis = (req, res, next) => {
    readAllApis().then((apis) => {
        res.status(200).send({ apis })
    }).catch(next)
};

exports.listComments = (req, res, next) => {
    const { article_id } = req.params
    commentsByArticle(article_id).then((rows) => {
        res.status(200).send({ rows })
    }).catch(next)
}





