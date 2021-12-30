require("dotenv").config();
const cookieParser = require("cookie-parser");
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const CLIENT_ID = process.env.CLIENT_ID;
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(CLIENT_ID);
// const cors = require('cors');

//middleware for setting ejs engine
app.set('view engine', 'ejs');

app.use(express.json());
// app.use(cors());
app.use(cookieParser());
//login

app.get("/login", (req, res) => {
    res.render('login')
});

app.post('/login', (req, res) => {
    const token = req.body.token;
    console.log(token);
    async function verify() {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: CLIENT_ID,
        });
        const payload = ticket.getPayload();
        const userId = payload['sub'];
        console.log(userId);
        console.log(payload);
    }
    verify()
    .then(() => {
        res.cookie('session-token', token);
        res.send("success");
    })
    .catch(console.error);
});

// app.get('/profile', checkAuthenticated ,(req, res) => {

// })

app.get("/protectedrouter", (req, res) => {
    res.render('protectedrouter')
});

app.get("/dashboard", checkAuthenticated ,(req, res) => {
    const user = req.user;
    res.render('dashboard.ejs', {user});
});

app.get("/logout", (req, res) => {
    res.clearCookie('session-token');
    res.redirect('/login');
});

function checkAuthenticated(req, res, next) {
    let token = req.cookies['session-token'];
    const user = {};
    async function verify() {
        const ticket = await client.verifyIdToken({
            idToken:token,
            audience: CLIENT_ID,
        });
        const payload = ticket.getPayload();
        user.name = payload.name;
        user.email = payload.email;
        user.picture = payload.picture;
    };
    verify()
    .then(() => {
        req.user = user;
        next();
    })
    .catch(err=>{
        console.log(err);
        res.redirect('/login');
    })
}

app.listen((port), () => {
    console.log(`Server is running on port : ${port}`)
});

