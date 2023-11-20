const db = require('../db/connection');

exports.retrieveTopics = () => {
    return db.query("SELECT * FROM topics;");
};