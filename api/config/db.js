var mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/property", {useNewUrlParser: true, useUnifiedTopology: true});

module.exports.Mongoose = mongoose;