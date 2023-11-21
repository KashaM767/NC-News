const { topicData, articleData, userData, commentData } = require("../db/data/test-data/index");
const { retrieveTopics, readAllApis, retrieveArticles, articleComments } = require("../models/models");


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

exports.getArticles = (req, res) => {
    retrieveArticles().then((articles) => {
        console.log(articleComments())
        res.status(200).send(articles.rows)
    })
}





