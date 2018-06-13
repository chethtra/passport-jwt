const passport = require('passport');
const passportJwt = require('passport-jwt');
let config = require('./config');
const users = require('./users');

const ExtractJwt= passportJwt.ExtractJwt;
const strategy = passportJwt.Strategy;


const option = {
    secretOrKey: config.secret,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
};

module.exports = function(){
    let strats = new strategy(option, (payload, done)=>{
        console.log(payload)
        let user = users.find((u)=>{
            return u.name === payload.name
        }) 
        
        if(user){
            return done(null, {
                name: user.name
            });
        }
        else{
            
            return done(new Error('Error'), null);
        }
    });

    passport.use(strats);

    return {
        initialize: ()=>{
            return passport.initialize();
        },
        authenticate: ()=>{
            return passport.authenticate('jwt', config.sessionStatus);
        }
    }
}