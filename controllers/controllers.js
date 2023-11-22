const { topicData, articleData, userData, commentData } = require("../db/data/test-data/index");
const { retrieveTopics, readAllApis, retrieveArticleById } = require("../models/models");


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



exports.listApis = (req, res, next) => {
    readAllApis().then((apis) => {
        res.status(200).send({ apis })
    }).catch(next)
};

exports.getArticleById = (req, res, next) => {
    const { article_id } = req.params
    retrieveArticleById(article_id).then((rows) => {
        res.status(200).send({ article: rows })
    }).catch(next)
};


