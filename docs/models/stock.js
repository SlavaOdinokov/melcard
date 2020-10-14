const {Schema, model} = require('mongoose')

const stockSchema = new Schema({
    name: String,
    string1: String,
    string2: String
})

module.exports = model('Stock', stockSchema)