var Db = require('../config/db');
var Mongoose = Db.Mongoose;

var Schema = Mongoose.Schema;

var PropertySchema = new Schema({
    "_id": Schema.Types.ObjectId,
    "location": String,
    "road": String,
    "area": String,
    "type": String,
    "price": String,
    "features": [],
    "owner": {
        "_id" : Schema.Types.ObjectId,
        "name" : String,
        "email" : String,
        "contactNo" : String
    },
    "propertyStatus": {
        "name" : String,
        "color" : String
    },
    "buyer": {
        "_id": Schema.Types.ObjectId,
        "name": String,
        "email": String,
        "address": String,
        "contactNo": String,
    },
    "photo": Schema.Types.Mixed
});

module.exports = Mongoose.model("Property", PropertySchema, "properties");