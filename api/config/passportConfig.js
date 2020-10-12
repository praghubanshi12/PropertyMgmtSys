const passport = require("passport");
const localStratergy = require("passport-local").Strategy;
const User = require("../core/model/User")

var UserService = require("../core/service/UserService")

passport.use(
    new localStratergy({ usernameField: 'email', passwordField: 'password' },
        (email, password, done) => {
            UserService.findByEmail(email,password,done, (result)=> {
                return result; 
            });
        }
    )
)