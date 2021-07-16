const mongoose = require('mongoose')

const UmpatanSchema = mongoose.Schema({
    umpatan: String,
    date: String
}, {
    collection: "umpatans"
})

module.exports = mongoose.model('Umpatan',UmpatanSchema)