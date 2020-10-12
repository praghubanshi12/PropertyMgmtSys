var Db = require("../config/db")
var Mongoose = Db.Mongoose;

var Schema = Mongoose.Schema;

var CustomerSchema = new Schema({
    "name": String,
    "email": String,
    "address": String,
    "contactNo": String,
    "userId": Schema.Types.ObjectId
});

module.exports = Mongoose.model("Customer", CustomerSchema, "customers");