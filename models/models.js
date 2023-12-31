const db = require('../db/connection');
const fs = require('fs/promises');
const { checkExists } = require('./checkExists');
const articles = require('../db/data/test-data/articles');

exports.selectApis = () => {
    return fs.readFile('./endpoints.json', 'utf-8')
        .then((data) => {
            const parsedData = JSON.parse(data);
            return parsedData;
        });
};

exports.retrieveTopics = () => {
    return db.query("SELECT * FROM topics;").then(({ rows }) => {
        return rows
    })
};

exports.retrieveArticleById = (article_id) => {
    return db.query(`SELECT a.*, CAST(COUNT(c.body) AS int) AS comment_count FROM articles a LEFT OUTER JOIN comments c ON c.article_id = a.article_id WHERE a.article_id = $1 GROUP BY a.article_id;`, [article_id])
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

exports.retrieveArticles = (topic, sort_by = "created_at", order = "desc") => {

    const validSortingCriteria = ["article_id", "title", "topic", "author", "created_at", "votes", "comment_count"];
    if (!validSortingCriteria.includes(sort_by)) {
        return Promise.reject({ status: 400, msg: 'bad request' });
    }

    const validOrderCriteria = ["asc", "desc"];
    if (!validOrderCriteria.includes(order)) {
        return Promise.reject({ status: 400, msg: 'bad request' });
    }

    let queryString = "select a.article_id, a.article_img_url, a.author, a.created_at, a.title, a.topic, a.votes, cast(count(c.body) as int) as comment_count from articles a left outer join comments c on c.article_id = a.article_id "
    const queryValues = [];

    if (topic) {
        queryValues.push(topic);
        queryString += `WHERE topic = $1 `;
    }

    queryString += `group by a.article_id ORDER BY ${sort_by} ${order}`;

    return db.query(queryString, queryValues).then(({ rows }) => {
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

exports.updateCommentVotes = (comment_id, input) => {
    const updateVotes = Object.values(input)[0]
    return db.query(`UPDATE comments SET votes = votes + $1 WHERE comment_id = $2 RETURNING *;`, [updateVotes, comment_id])
        .then(({ rows }) => {
            if (!rows.length) {
                return Promise.reject({ status: 404, msg: 'not found' });
            }
            return (rows[0])
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
    return db.query("SELECT * FROM users;").then(({ rows }) => {
        return rows
    })
};

exports.retrieveByUsername = (username) => {
    return db.query(`SELECT * FROM users WHERE username = $1;`, [username])
        .then(({ rows }) => {
            if (!rows.length) {
                return Promise.reject({ status: 404, msg: 'not found' });
            }
            return rows[0]
        })
};

exports.addArticle = (newArticle) => {
    const { title, topic, author, body, article_img_url = "https://images.unsplash.com/photo-1586339949216-35c2747cc36d?q=80&w=2666&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" } = newArticle;
    return db.query(`INSERT INTO articles (title, topic, author, body, article_img_url) VALUES ($1, $2, $3, $4, $5) RETURNING *`, [title, topic, author, body, article_img_url])
        .then(({ rows }) => {
            return rows[0]
        })
};

exports.addTopic = (newTopic) => {
    const { slug, description } = newTopic;
    return db.query(`INSERT INTO topics (slug, description) VALUES ($1, $2) RETURNING *`, [slug, description])
        .then(({ rows }) => {
            return rows[0]
        })
}

exports.removeArticle = (article_id) => {
    return db.query("DELETE FROM comments WHERE article_id = $1", [article_id])
        .then(() => {
            return db.query("DELETE FROM articles WHERE article_id = $1", [article_id])
        })
}