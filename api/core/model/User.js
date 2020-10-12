var Db = require("../../config/db");
const Bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

var Mongoose = Db.Mongoose;

var Schema = Mongoose.Schema;

var UserSchema = new Schema({
    "email": {
        type: String,
        unique: true
    },
    "password": String,
    "saltSecret": String
});

UserSchema.pre("save", function (next) {
    Bcrypt.genSalt(10, (err, salt) => {
        Bcrypt.hash(this.password, salt, (err, hash) => {
            this.password = hash;
            this.saltSecret, salt;
            next();
        });
    });
});

UserSchema.methods.verifyPassword = function(password){
    //compare password with hash
    return Bcrypt.compareSync(password, this.password);
}

UserSchema.methods.generateJwt = function(){
    return jwt.sign({_id: this._id}, 
        "Secret@123", 
    {
        expiresIn: "10m"
    });
}

module.exports = Mongoose.model("User", UserSchema, "users")