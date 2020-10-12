var Db = require('../config/db');
var Mongoose = Db.Mongoose;

var Schema = Mongoose.Schema;

var HouseDetailsSchema = new Schema({
    "noOfBedRoom": Number,
    "noOfBathRoom": Number,
    "noOfKitchen": Number,
    "propertyId": Schema.Types.ObjectId
})

module.exports = Mongoose.model("HouseDetails", HouseDetailsSchema, "house_details");