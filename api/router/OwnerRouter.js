const express = require("express");
const router = express.Router();
var OwnerController = require("../controller/OwnerController")

router.get("/", (req,res)=>{
    OwnerController.findAll(req,res);
});

router.post("/save", (req,res)=> {
    OwnerController.save(req,res);
});

router.get("/properties/:ownerId", (req,res)=> {
    OwnerController.findPropertiesByOwnerId(req,res);
})

module.exports = router;