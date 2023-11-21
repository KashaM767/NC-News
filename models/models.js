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
            console.log(parsedData)
            return parsedData;
        });
};




