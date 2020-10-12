var Db = require("../config/db")
var Mongoose = Db.Mongoose;

var Schema = Mongoose.Schema;

var CustomerPropertySchema = new Schema({
    "customer": {
        "_id": Schema.Types.ObjectId,
        "name" : String,
        "email" : String,
        "address" : String,
        "contactNo" : String
    },
    "propertyId": Schema.Types.ObjectId
});

module.exports = Mongoose.model("CustomerPropertySchema", CustomerPropertySchema, "customers_properties_interested");