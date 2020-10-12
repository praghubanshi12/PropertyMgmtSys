var Db = require("../../config/db");
var Mongoose = Db.Mongoose;

var Schema = Mongoose.Schema;

var RoleSchema = new Schema({
    "name": String
});

module.exports = Mongoose.model("RoleSchema", RoleSchema, "roles")