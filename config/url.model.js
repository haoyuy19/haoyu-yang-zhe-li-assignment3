const mongoose = require('mongoose');
const urlSchema = require('./url.schema').urlSchema;
const urlModel = mongoose.model('url', urlSchema);

function insertUrl(url) {
    return urlModel.create(url);
}

function getAllUrl() {
    return urlModel.find().exec();
}

module.exports = {
    insertUrl,
    getAllUrl,
};
