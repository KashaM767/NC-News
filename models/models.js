const db = require('../db/connection');


exports.retrieveTopics = () => {
    return db.query("SELECT * FROM topics;");
};

exports.retrieveArticleById = (id) => {
    return db.query("SELECT * FROM articles WHERE article_id = $1;", [id])
        .then(({ rows }) => {
            return rows
        })
}