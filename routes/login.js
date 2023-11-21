const { connectToDB } = require(`../modules/database`);
const { isAuthenticated, notAuthenticated } = require(`../modules/authentication`);
const passport = require('passport');
const app = require(`../app`)

app.get(`/login`, notAuthenticated, async (req, res) => {
    res.render(`login`)
});

app.post('/login', notAuthenticated, passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: false,
  }));
  