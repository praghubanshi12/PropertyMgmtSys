var Db = require("../../config/db");
var Mongoose = Db.Mongoose;

var Schema = Mongoose.Schema;

var UserRoleSchema = new Schema({
    "userId": Schema.Types.ObjectId,
    "role": {
        "_id": Schema.Types.ObjectId,
        "name": String
    }
});

module.exports = Mongoose.model("UserRoleSchema", UserRoleSchema, "user_roles")