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
    return db.query("SELECT article_id, article_img_url, author, created_at, title, topic, votes FROM articles ORDER BY created_at DESC;");
};




