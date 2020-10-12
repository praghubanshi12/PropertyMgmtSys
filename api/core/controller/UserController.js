var UserService = require("../service/UserService");
const passortConfig = require("../../config/passportConfig");
const passport = require("passport");
const _ = require("lodash");
const User = require("../model/User");
const UserRole = require("../model/UserRole");
const Customer = require("../../model/Customer");
const Owner = require("../../model/Owner");

var UserController = function () {
    return {
        findAll: (req, res) => {
            UserService.findAll((user) => {
                res.send(user)
            });
        },

        findById: (req, res) => {
            UserService.findById(req.params.id, (user) => {
                res.send(user);
            })
        },

        saveCustomer: (req, res) => {
            UserService.saveCustomer(req.body, (err, customer) => {
                if (!err) {
                    res.status(200).json({ "customer": customer });
                } else {
                    res.status(500).json({ "error": err });
                }
            })
        },

        authenticate: (req, res, next) => {
            passport.authenticate("local", (err, user, info) => {
                if (err) {
                    return res.status(400).json(err);
                } else if (user) {
                    UserRole.find({ userId: user._id }, (err, userRole) => {
                        let currentRole = "multiple";
                        let multipleRoles = [];
                        if (userRole.length == 1) {
                            currentRole = userRole[0].role.name;
                        } else if (userRole.length > 1) {
                            userRole.forEach(ur => {
                                multipleRoles.push(ur.role.name);
                            })
                        }
                        return res.status(200).json({ "token": user.generateJwt(), "user": user, "currentRole": currentRole, "multipleRoles": multipleRoles });
                    });
                } else {
                    return res.status(404).json(info);
                }
            })(req, res);
        },

        getUserInfo: (req, res, next) => {
            User.findOne({ _id: req._id }, (err, user) => {
                if (!user) {
                    return res.status(404).json({ status: false, message: "User not found" });
                } else {
                    let userRole = req.params.role;
                    let uId = user["_id"];
                    if (userRole == "customer") {
                        Customer.find({ userId: uId }, (err, c) => {
                            return res.status(200).json({ status: true, role: userRole, userInfo: c });
                        });
                    }
                    if (userRole == "owner") {
                        Owner.find({ userId: uId }, (err, o) => {
                            return res.status(200).json({ status: true, role: userRole, userInfo: o });
                        });
                    }
                    if (userRole == "superadmin") {
                        return res.status(200).json({ status: true, role: userRole, userInfo: _.pick(user, ['_id', 'email']) });
                    }
                }
            })
        }
    }
}

module.exports = new UserController();