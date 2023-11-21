const db = require('../db/connection');
const fs = require('fs/promises');
const format = require("pg-format");


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

exports.readAllApis = () => {
    return fs.readFile(`${__dirname}/../endpoints.json`, 'utf-8')
        .then((data) => {
            const parsedData = JSON.parse(data);
            return parsedData;
        });
};

exports.retrieveArticles = () => {
    return db.query("SELECT article_id, article_img_url, author, created_at, title, topic, votes FROM articles ORDER BY created_at DESC;");
};

exports.articleComments = () => {
    return db.query("select count(*) from comments join articles on comments.article_id = articles.article_id group by articles.article_id order by articles.created_at desc;").then(({ rows }) => {
        return rows
    })
};

exports.countComments = () => {
    return db.query("SELECT article_id, count(*) from comments group by article_id;")
}




