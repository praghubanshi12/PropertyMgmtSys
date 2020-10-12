const multer = require('multer')
const Property = require("../model/Property");
var PropertySchema = require("../model/Property")
var OwnerService = new require("../service/OwnerService").OwnerService();
const HouseDetails = require("../model/HouseDetail");
const LandDetails = require("../model/LandDetail");
var Db = require('../config/db');
const _ = require("lodash");
const CustomerPropertyInterested = require("../model/CustomerPropertyInterested");
const { base } = require('../model/Property');


module.exports.PropertyService = function () {
    return {
        findInIdList: (ids, callback) => {
            let objectIds = [];
            ids.split(",").forEach(id => {
                objectIds.push(Db.Mongoose.Types.ObjectId(id));
            })

            PropertySchema.find({
                "_id": {
                    $in: objectIds
                }
            }, (err, properties) => {
                callback(err, properties);
            })
        },
        findAll: (callback) => {
            PropertySchema.find({}, (err, properties) => {
                callback(properties);
            })
        },

        findById: (propertyId, callback) => {
            PropertySchema.findOne({ _id: propertyId }, (err, property) => {
                return callback(property);
            })
        },

        save: (propertyDto, fileUrl, uuId, extension, callback) => {
            findOwnerByIdAsync(propertyDto.ownerId).then((ownerObj) => {
                var property = new Property({
                    _id: uuId,
                    location: propertyDto.location,
                    area: propertyDto.area,
                    road: propertyDto.road,
                    type: propertyDto.type,
                    price: propertyDto.price,
                    features: propertyDto.features,
                    photo: fileUrl + '/' + propertyDto.type + "/" + uuId + "." + extension,
                    owner: ownerObj,
                    propertyStatus: propertyDto.status
                });
                property.save((err, property) => {
                    if (!err && property != null) {
                        var pId = property._id;
                        var type = property.type;
                        if (type == "house") {
                            var houseDetail = new HouseDetails({
                                noOfBedRoom: propertyDto.houseDetails.noOfBedroom,
                                noOfBathRoom: propertyDto.houseDetails.noOfBathroom,
                                noOfKitchen: propertyDto.houseDetails.noOfKitchen,
                                propertyId: pId
                            });
                            houseDetail.save((err, houseDetail) => {
                                callback(err, houseDetail)
                            })
                        }

                        else if (type == "land") {
                            var landDetail = new LandDetails({
                                facing: propertyDto.landDetails.facing,
                                propertyId: pId
                            });
                            landDetail.save((err, landDetail) => {
                                callback(err, landDetail)
                            })
                        }
                        else {
                            callback(err, null);
                        }
                    } else {
                        callback(err, null);
                    }
                });
            })
        },

        findDetailsById: (type, id, callback) => {
            if (id != undefined || null) {
                if (type == "house") {
                    HouseDetails.findOne({ propertyId: id }, (err, houseDetail) => {
                        var result = _.pick(houseDetail, ['noOfBedRoom', 'noOfBathRoom', 'noOfKitchen']);
                        if (!err) {
                            callback(result);
                        } else {
                            callback(result, err)
                        }
                    })
                    HouseDetails.findOne({ propertyId: id }).select()
                }

                if (type == "land") {
                    LandDetails.findOne({ propertyId: id }, (err, landDetail) => {
                        var result = _.pick(landDetail, ['facing']);
                        if (!err) {
                            callback(result);
                        } else {
                            callback(result, err)
                        }
                    })
                }
            } else {
                callback(null, "Internal server error");
            }
        },
        findInterestedCustomersByPropertyId(propId, callback) {
            CustomerPropertyInterested.find({ "propertyId": propId }, (err, doc) => {
                let interestedCustomer = [];
                doc.forEach(customerProperty => {
                    interestedCustomer.push(customerProperty.customer);
                });
                callback(err, interestedCustomer);
            })
        },
        verify(propertyId, callback) {
            PropertySchema.findByIdAndUpdate(propertyId, {
                propertyStatus: { name: "pending", color: "warning" }
            },
                { new: true },
                (err, res) => {
                    callback(err, res);
                });
        },
        sell(propertyId, customer, callback) {
            PropertySchema.findByIdAndUpdate(propertyId, {
                propertyStatus: { name: "sold", color: "info" },
                buyer: customer
            },
                { new: true },
                (err, res) => {
                    callback(err, res);
                });
        }
    }
}

async function findOwnerByIdAsync(id) {
    var owner = await getOwner(id); // awaits for a fulfilled result!
    return owner;
}

function getOwner(id) {
    return new Promise(function (resolve, reject) {
        OwnerService.findById(id, (err, owner) => {
            if (!err) {
                resolve(owner);
            }
            reject(err);
        })
    })
}