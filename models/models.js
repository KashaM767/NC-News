const db = require('../db/connection');
const endpoints = require('../endpoints.json')

exports.retrieveTopics = () => {
    return db.query("SELECT * FROM topics;");
};

exports.readAllApis = () => {
    return endpoints
}




