const db = require('../db/connection');
const fs = require('fs/promises');
const { checkExists } = require('./comments');


exports.selectApis = () => {
    return fs.readFile('./endpoints.json', 'utf-8')
        .then((data) => {
            const parsedData = JSON.parse(data);
            return parsedData;
        });
};


exports.retrieveTopics = () => {
    return db.query("SELECT * FROM topics;");
};

exports.retrieveArticleById = (article_id) => {
    return db.query(`SELECT * FROM articles WHERE article_id = $1;`, [article_id])
        .then(({ rows }) => {
            if (!rows.length) {
                return Promise.reject({ status: 404, msg: 'not found' });
            }
            return rows[0]
        })
}
exports.readAllApis = () => {
    return fs.readFile(`${__dirname}/../endpoints.json`, 'utf-8')
        .then((data) => {
            const parsedData = JSON.parse(data);
            return parsedData;
        });
};

exports.commentsByArticle = (article_id) => {
    return db.query(`SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC;`, [article_id])
        .then(({ rows }) => {
            return rows
        })
}

exports.removeComment = (comment_id) => {
    return db.query("DELETE FROM comments WHERE comment_id = $1", [comment_id])
}



