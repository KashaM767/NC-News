const articles = require("../db/data/test-data/articles");
const { topicData, articleData, userData, commentData } = require("../db/data/test-data/index");
const { checkExists } = require("../models/checkExists");
const { retrieveTopics, readAllApis, retrieveArticles, insertComment, commentsByArticle, retrieveArticleById, updateArticle, retrieveUsers, removeComment, retrieveByUsername, updateCommentVotes } = require("../models/models");

exports.getTopics = (req, res, next) => {
    retrieveTopics()
        .then((rows) => res.status(200).send({ topics: rows }))
        .catch(next)
};

exports.listApis = (req, res, next) => {
    readAllApis().then((apis) => {
        res.status(200).send({ apis })
    }).catch(next)
};

exports.getArticles = (req, res, next) => {
    const { topic, sort_by, order } = req.query;
    const topicPromises = [retrieveArticles(topic, sort_by, order)]

    if (topic) {
        topicPromises.push(checkExists("topics", "slug", topic));
    }
    Promise.all(topicPromises)
        .then((resolvedPromises) => {
            const rows = resolvedPromises[0]
            res.status(200).send({ articles: rows })
        }).catch(next)
};

exports.listComments = (req, res, next) => {
    const { article_id } = req.params
    const articlePromises = [commentsByArticle(article_id)];

    if (article_id) {
        articlePromises.push(checkExists("articles", "article_id", article_id));
    }

    Promise.all(articlePromises)
        .then((resolvedPromises) => {
            const rows = resolvedPromises[0]
            res.status(200).send({ comments: rows });
        })
        .catch(next);
}

exports.getArticleById = (req, res, next) => {
    const { article_id } = req.params
    retrieveArticleById(article_id).then((rows) => {
        res.status(200).send({ article: rows })
    }).catch(next)
};

exports.postComment = (req, res, next) => {
    const newComment = req.body;
    const { article_id } = req.params
    insertComment(newComment, article_id).then((comment) => {
        res.status(201).send({ comment })
    }).catch(next)
}

exports.deleteComment = (req, res, next) => {
    const { comment_id } = req.params;
    removeComment(comment_id).then((comment) => {
        if (comment.rowCount === 0) {
            res.status(404).send({ msg: 'not found' })
        } else {
            res.status(204).send()
        }
    }).catch(next)
}
exports.updateArticleById = (req, res, next) => {
    const { article_id } = req.params
    updateArticle(article_id, req.body).then((rows) => {
        res.status(200).send({ article: rows })
    }).catch(next)
};

exports.getUsers = (req, res, next) => {
    retrieveUsers().then((rows) => {
        res.status(200).send({ users: rows })
    }).catch(next)
};

exports.getByUsername = (req, res, next) => {
    const { username } = req.params;
    retrieveByUsername(username).then((rows) => {
        res.status(200).send({ user: rows })
    }).catch(next)
};

exports.patchCommentVotes = (req, res, next) => {
    const { comment_id } = req.params;
    updateCommentVotes(comment_id, req.body).then((rows) => {
        res.status(200).send({ comment: rows })
    }).catch(next)
}