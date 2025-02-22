const express = require( 'express' );
const app = express();
const path = require('path');
const {expressjwt: expressJwt} = require('express-jwt');
const jwt = require( 'jsonwebtoken' );

const PORT = 3000;
const bodyParser = require( 'body-parser' );

const secretkey = 'My super secret key';
const jwtMW = expressJwt({
    secret: secretkey,
    algorithms: ['HS256']
});


let users = [
    {
        id: 1,
        username: 'Akshitha',
        password: 'Akshitha'
    },
    {
        id: 2,
        username: 'Arun',
        password: 'Arun'
    },
    {
        id: 3,
        username: 'Lipsa',
        password: 'Lipsa'
    },
]


app.use ( bodyParser.json() );
app.use(bodyParser.urlencoded({ extended:true }));
app.use((req,res,next) => {
    res.setHeader('Access-Control-Allow-Origin',`http://localhost:${PORT}`);
    res.setHeader('Access-Control-Allow-Headers','Content-type,Aythorization');
    next();
});

app.get('/', (req, res) => {
    res.sendFile( path.join(__dirname, 'index.html') );
});

app.post('/api/login', (req,res) => {
    const { username, password } = req.body;
    console.log( username, password );
    for(let user of users) {
        if(username == user.username && password == user.password) {
            let token = jwt.sign({ id : user.id , username : user.username },secretkey,{expiresIn :'3m'});
            res.json({
                success: true,
                err: null,
                token: token
            });
            break;
        }
        else {
            res.status(401).json({
                success: false,
                token: null,
                err: 'username or password is incorrect !!!'
            });
        }
    }
    
});

app.get('/api/dashboard', jwtMW , (req,res) => {
    res.json({
        success: true,
        myContent:'Secret content that only logged in people can see.'
    });
});

//added new route settings
app.get('/api/settings', jwtMW , (req,res) => {
    res.json({
        success: true,
        myContent:'This is the Secret settings page'
    });
});


app.get('/api/prices', jwtMW , (req,res) => {
    res.json({
        success: true,
        myContent:'This is the price $3.99'
    });
});




app.use(function(err, req, res, next) {
    if(err.name ==='UnauthorizedError') {
        res.status(401).json({
            success: false,
            officialError: err,
            err: 'Username or password is incorrect 2'
        });
    }
    else {
        next(err);
    }
});

app.listen( PORT, () => {
    console.log( `Server on port: ${PORT}`);
} );