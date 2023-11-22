const { topicData, articleData, userData, commentData } = require("../db/data/test-data/index");
const { retrieveTopics, readAllApis, retrieveArticles, makeLookUp, lookupObj } = require("../models/models");


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

exports.getArticles = (req, res, next) => {
    return retrieveArticles()
        .then((articles) => {
            const lookup = {
                9: 2,
                3: 2,
                5: 2,
                6: 1,
                1: 11
            }

            for (let article of articles.rows) {
                if (article.article_id in lookup) {
                    article.comment_count = lookup[article.article_id]
                } else {
                    article.comment_count = 0
                }
            }
            res.status(200).send(articles.rows)
        }).catch(next)
};








