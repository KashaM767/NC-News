const db = require("../db/connection");

exports.checkExists = (article_id) => {
    return db.query(`SELECT * FROM articles WHERE article_id = $1;`, [article_id])
        .then(({ rows }) => {
            if (!rows.length) {
                return Promise.reject({ status: 404, msg: "not found" });
            }
        })
};

exports.checkTopic = (topic) => {
    return db.query(`SELECT * FROM topics WHERE slug = $1;`, [topic])
        .then(({ rows }) => {
            if (!rows.length) {
                return Promise.reject({ status: 404, msg: "not found" });
            }
        })
};