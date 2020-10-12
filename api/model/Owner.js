var Db = require("../config/db")
var Mongoose = Db.Mongoose;

var Schema = Mongoose.Schema;

var OwnerSchema = new Schema({
    "name": String,
    "email": String,
    "contactNo": String,
    "userId": Schema.Types.ObjectId
});

module.exports = Mongoose.model("Owner", OwnerSchema, "owners");