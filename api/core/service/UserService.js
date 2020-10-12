const CustomerSchema = require("../../model/Customer");
const RoleSchema = require("../model/Role");
const UserSchema = require("../model/User");
const UserRoleSchema = require("../model/UserRole");

var UserService = function () {
    return {
        findAll: (callback) => {
            UserSchema.find({}, (err, user) => {
                return callback(user);
            })
        },

        findById: (id, callback) => {
            UserSchema.findById(id, (err, user) => {
                return callback(user);
            })
        },

        findByEmail: (email, password, done, callback) => {
            UserSchema.findOne({ email: email },
                (err, user) => {
                    if (err) {
                        return callback(done(err));
                    } else if (!user) {
                        return callback(done(null, false, { message: "Email is not registered" }));
                    } else if (!user.verifyPassword(password)) {
                        return callback(done(null, false, { message: "Password is not correct!" }))
                    } else {
                        return callback(done(null, user));
                    }
                })
        },

        saveCustomer: (customerDto, callback) => {
            if (customerDto) {
                var user = new UserSchema({
                    email: customerDto.email,
                    password: customerDto.password
                });

                //first add to user table
                user.save((err, doc) => {
                    var uId = "";
                    if (err) {
                        //if duplicate email error, create multiple roles for single user
                        if (err.name == "MongoError" && err.code == 11000) {
                            UserSchema.findOne({ "email": customerDto.email }, (err, u) => {
                                if (!err && u != null) {
                                    uId = u._id;
                                    createCustomer(uId, customerDto, (err, customer) => {
                                        callback(err, customer);
                                    });
                                } else {
                                    callback(err, u);
                                }
                            });
                        } else {
                            callback(err, doc);
                        }
                    }
                    else {
                        if (doc != null) {
                            uId = doc._id;
                            createCustomer(uId, customerDto, (err, customer) => {
                                callback(err, customer);
                            });
                        } else {
                            callback(err, doc);
                        }
                    }
                });
            } else {
                callback(null, null);
            }
        }
    }
}

function createCustomer(uId, customerDto, callback) {
    RoleSchema.findById("5f646263dde5559cc4abef3d", (err, r) => {
        CustomerSchema.findOne({ "userId": uId }, (err, existingCustomer) => {
            if (existingCustomer == null) {
                var customer = new CustomerSchema({
                    name: customerDto.firstName + " " + customerDto.lastName,
                    email: customerDto.email,
                    address: customerDto.address,
                    contactNo: customerDto.contactNo,
                    userId: uId
                });

                customer.save((err, customer) => {
                    var userRole = new UserRoleSchema({
                        userId: uId,
                        role: r
                    });
                    userRole.save();
                    callback(err, customer);
                })
            } else {
                callback(err, existingCustomer);
            }
        });
    });
}

module.exports = new UserService();