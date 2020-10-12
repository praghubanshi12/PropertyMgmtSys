const CustomerPropertyInterested = require('../model/CustomerPropertyInterested');
const CustomerSchema = require('../model/Customer');
const PropertySchema = require('../model/Property');

module.exports.CustomerService = function(){
    return {
        findAll(callback) {
            CustomerSchema.find({}, (err, customers)=> {
                callback(err, customers);
            })
        },
        findById(id, callback) {
            CustomerSchema.findById(id, (err, customer)=> {
                callback(err, customer);
            })
        },
        findInterestedProperties(customerId, callback){
            CustomerPropertyInterested.find({"customer._id": customerId}, (err, result)=> {
                callback(err,result);
            })
        },
        checkIfPropertyInterested(customerId, propertyId, callback){
            CustomerPropertyInterested.find({"customer._id": customerId, "propertyId": propertyId}, (err, result)=> {
                callback(err,result);
            })
        },
        saveInterestedProperty(customer, propertyId, callback){
            var interestedProperty = new CustomerPropertyInterested({
                propertyId : propertyId,
                customer : {
                    _id: customer._id,
                    name : customer.name,
                    email : customer.email,
                    address : customer.address,
                    contactNo : customer.contactNo,
                }
            });

            interestedProperty.save((err, doc)=> {
                callback(err,doc);
            })
        },
        findBoughtPropertiesCount(customerId, callback){
            PropertySchema.count({"buyer._id": customerId}, (err, count)=> {
                if(!err){
                    return callback(err, count);
                }
            })
        }
    }
}


