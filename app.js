const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const jwt = require('jwt-simple');
const auth = require('./auth')();
const users = require('./users');
const config = require('./config');

app.use(bodyParser.json());
app.use(auth.initialize());

app.get('/', (req,res)=>{
    console.log(req.body);
    res.end();
})

app.post('/login', (req,res)=>{
    
    if(req.body.username && req.body.password){
        let name = req.body.username;
        let password = req.body.password;

        let user = users.find((user)=>{
            return(user.name === name && user.password === password);
        })
        
        if(user){
            let payload = {
                name: user.name
            };

            let token = jwt.encode(payload, config.secret);

            res.json({
                token: token
            });
        }
        else{
            res.sendStatus(401);
        }
    }
    else{
        res.sendStatus(401);
    }
})

app.get('/user',auth.authenticate('jwt', { session: false }), (req,res)=>{
    res.json(req.user.name)
})


app.listen(3000,()=>{
    console.log('connect')
})