const {Schema, model} = require('mongoose')

const door = new Schema({
    titleDoor: { type: String, required: true },
    imgUrl: String,
    priceDoor: { type: Number, required: true },
    oldPriceDoor: Number,
    classDoor: String,
    badgeDoor1: String,
    badgeDoor2: String,
    specifications: Array,
    panelsParams: Array,
    descDoor1: String,
    descDoor2: String,
    descDoor3: String,
    assembly1: Object,
    assembly2: Object,
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
})

module.exports = model('Door', door)
