var Db = require('../config/db');
var Mongoose = Db.Mongoose;

var Schema = Mongoose.Schema;

var LandDetailsSchema = new Schema({
    "facing": String,
    "propertyId": Schema.Types.ObjectId
})

module.exports = Mongoose.model("LandDetails", LandDetailsSchema, "land_details");