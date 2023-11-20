const { topicData } = require("../db/data/test-data/index");
const { retrieveTopics } = require("../models/models");


exports.getTopics = (req, res) => {
    console.log(req.body)
    retrieveTopics().then((topics) => res.status(200).send({ topics }));
};



