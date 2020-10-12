const UserSchema = require('../core/model/User');
const RoleSchema = require('../core/model/Role');
const UserRoleSchema = require('../core/model/UserRole');
const OwnerSchema = require('../model/Owner')
const PropertySchema = require('../model/Property')

module.exports.OwnerService = function () {
    return {
        findAll(callback) {
            OwnerSchema.find({}, (err, owner) => {
                return callback(owner);
            });
        },
        findById(id, callback) {
            OwnerSchema.findById(id, (err, owner) => {
                return callback(err, owner);
            });
        },
        findPropertiesByOwnerId(ownerId, callback) {
            PropertySchema.find({ "owner._id": ownerId }, (err, property) => {
                return callback(err, property);
            });
        },
        save(ownerDto, callback) {
            if (ownerDto) {
                var user = new UserSchema({
                    email: ownerDto.email,
                    password: "P@ssw0rd"
                });
                user.save((err, doc) => {
                    let uId = "";
                    if (err) {
                        //if duplicate email in users table, create many roles to one user
                        if (err.name == "MongoError" && err.code == 11000) {
                            UserSchema.findOne({ email: ownerDto.email }, (err, u) => {
                                if (!err && u != null) {
                                    uId = u._id;
                                    createNewOwner(uId, ownerDto, (err, owner) => {
                                        callback(err, owner);
                                    });
                                }
                            });
                        } else {
                            callback(err, doc);
                        }
                    } else {
                        if (doc != null) {
                            uId = doc._id;
                            createNewOwner(uId, ownerDto, (err, owner) => {
                                callback(err, owner);
                            });
                        } else {
                            callback("Error saving in users table", doc);
                        }
                    }
                })
            } else {
                callback("Bad Parameters", null);
            }
        }
    }
}

function createNewOwner(uId, ownerDto, callback) {
    OwnerSchema.findOne({ userId: uId }, (err, existingOwner) => {
        if (existingOwner == null) {
            RoleSchema.findById("5f646263dde5559cc4abef3c", (err, r) => {
                if (!err) {
                    var owner = new OwnerSchema({
                        name: ownerDto.name,
                        email: ownerDto.email,
                        contactNo: ownerDto.contactNo,
                        userId: uId
                    });
                    owner.save((err, owner) => {
                        var userRole = new UserRoleSchema({
                            "userId": uId,
                            "role": r
                        });
                        userRole.save();
                        callback(err, owner);
                    });
                } else {
                    callback(err, null);
                }
            });
        } else {
            callback(err, existingOwner);
        }
    })


}

