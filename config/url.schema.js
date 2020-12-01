const mongoose = require('mongoose');
const shortId = require('short-id');

exports.urlSchema = new mongoose.Schema({
    full: {
        type: String,
        required: true,
    },
    short: {
        type: String,
        required: true,
        default: shortId.generate,
    },
});
