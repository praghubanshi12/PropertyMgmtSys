var express = require("express");
var router = express.Router();
const CustomerController = new require("./../controller/CustomerController").CustomerController();

router.get("/", (req,res)=> {
    CustomerController.findAll(req,res);
});

router.get("/:id", (req,res)=> {
    CustomerController.findById(req,res);
});

router.get("/:customerId/properties/interested", (req,res)=> {
    CustomerController.findInterestedProperties(req, res);
});

router.get("/:customerId/properties/interested/:propertyId", (req,res)=> {
    CustomerController.checkIfPropertyInterested(req, res);
});

router.get("/:customerId/properties/bought/count", (req,res)=> {
    CustomerController.findBoughtPropertiesCount(req, res);
});

router.post("/properties/save/:propertyId", (req,res)=> {
    CustomerController.saveInterestedProperty(req, res);
});

module.exports = router;