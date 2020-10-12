var express = require("express");
var router = express.Router();
var PropertySchema = require('../model/Property');
var propertyController = require('../controller/PropertyController');
const multer = require("multer");
var PropertyController = new propertyController.PropertyController();
var mongoose = require('mongoose');
var fs = require('fs');
const { base } = require("../model/Property");

// Multer File upload settings
const baseDIR = './public/';

let uuId = "";
let extension = ""

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (!fs.existsSync(baseDIR)) {
            fs.mkdirSync(baseDIR);
        }
        
        let DIR = baseDIR +  req.body.type;
        if (!fs.existsSync(DIR)) {
            fs.mkdirSync(DIR);
        }
        cb(null, DIR);
    },
    filename: (req, file, cb) => {
        uuId = mongoose.Types.ObjectId();
        let fileNameSplitted = file.originalname.split(".");
        if (uuId) {
            extension = fileNameSplitted[fileNameSplitted.length - 1];
            fileName = uuId + "." + extension;
            cb(null, fileName)
        }
    }
});

// Multer Mime Type Validation
var upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
            cb(null, true);
        } else {
            let errorMsg = 'Only .png, .jpg and .jpeg format allowed!';
            req.fileValidationError = errorMsg; 
            return cb(null, false, new Error(errorMsg));
        }
    }
});

router.get("/", (req, res) => {
    PropertyController.findAll(req, res);
});

router.get("/array", (req, res) => {
    PropertyController.findInIdList(req, res);
});

router.get("/:id", (req, res) => {
    PropertyController.findById(req, res);
});

router.get("/details/type/:type/:id", (req, res) => {
    PropertyController.findDetailsById(req, res);
});

router.get("/interestedCustomers/:id", (req, res) => {
    PropertyController.findInterestedCustomersByPropertyId(req, res);
});

router.post("/save", upload.single('photo'), (req, res, next) => {
    if(req.fileValidationError){
        res.json({ status: 500, message: req.fileValidationError});
    }else{
        if (uuId && extension) {
            PropertyController.save(req, res, uuId, extension);
        }
    }
});

router.post("/verify/:id", (req, res) => {
    PropertyController.verify(req, res);
});

router.post("/sell/:id", (req, res) => {
    PropertyController.sell(req, res);
});
module.exports = router;