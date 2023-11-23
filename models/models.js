const db = require('../db/connection');
const fs = require('fs/promises');
const { checkExists } = require('./comments');
const articles = require('../db/data/test-data/articles');


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
    return db.query(`SELECT a.*, COUNT(c.body) AS comment_count FROM articles a LEFT OUTER JOIN comments c ON c.article_id = a.article_id WHERE a.article_id = $1 GROUP BY a.article_id;`, [article_id])
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

exports.retrieveArticles = () => {
    return db.query("select a.article_id, a.article_img_url, a.author, a.created_at, a.title, a.topic, a.votes, count(c.body) as comment_count from articles a left outer join comments c on c.article_id = a.article_id group by a.article_id order by a.created_at desc;").then(({ rows }) => {
        return rows
    })
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

exports.insertComment = (newComment, article_id) => {

    const body = newComment.body;
    const author = newComment.username

    return db.query(`INSERT INTO comments (body, article_id, author) VALUES ($1, $2, $3) RETURNING *;`, [body, article_id, author])
        .then(({ rows }) => {
            return rows[0]
        })
}
exports.updateArticle = (article_id, input) => {
    const alterVotes = Object.values(input)[0]
    return db.query(`UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *;`, [alterVotes, article_id])
        .then(({ rows }) => {
            if (!rows.length) {
                return Promise.reject({ status: 404, msg: 'not found' });
            }
            return rows[0]
        })
}

exports.retrieveUsers = () => {
    return db.query("SELECT * FROM users;");
};

