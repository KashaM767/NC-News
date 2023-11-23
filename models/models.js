const db = require('../db/connection');
const fs = require('fs/promises');

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
    return db.query("select a.article_id, a.article_img_url, a.author, a.created_at, a.title, a.topic, a.votes, count(c.body) as comment_count from articles a left outer join comments c on c.article_id = a.article_id group by a.article_id order by a.created_at desc;").then(({ rows }) => {
        return rows
    })
};



