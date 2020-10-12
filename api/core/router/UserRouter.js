const express = require("express");
const router = express.Router();
const UserController = require("../controller/UserController");
const jwtHelper = require("../../config/jwtHelper");

router.get("/", (req,res)=>{
    UserController.findAll(req,res);
});

router.get("/:id", (req,res)=>{
    UserController.findById(req,res);
});

router.post("/customers/register", (req,res)=> {
    UserController.saveCustomer(req, res);
});

router.post("/authenticate", (req,res)=> {
    UserController.authenticate(req,res);
});

router.get("/loggedInUser/info/:role", jwtHelper.verifyJwtToken, (req,res)=> {
    UserController.getUserInfo(req,res);
});

module.exports = router;

