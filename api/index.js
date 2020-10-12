var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
const passport = require("passport")

var PropertyRouter = require('./router/PropertyRouter');
var UserRouter = require('./core/router/UserRouter');
var OwnerRouter = require('./router/OwnerRouter');
var CustomerRouter = require('./router/CustomerRouter');

var app = express();
app.use(cors());
app.use(passport.initialize());
app.use(bodyParser.json());
const port = 9000;

app.use("/PMS/api/properties", PropertyRouter);
app.use("/PMS/api/users", UserRouter);
app.use("/PMS/api/owners", OwnerRouter);
app.use("/PMS/api/customers", CustomerRouter);
app.use(express.static('public'));

app.listen(port, ()=>{
    console.log("Server is running at port : " + port);
})