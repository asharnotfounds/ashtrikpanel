const { isAuthenticated, notAuthenticated } = require(`../modules/authentication`);
const { connectToDB } = require(`../modules/database`)
const app = require(`../app`);



app.get(`/`, isAuthenticated, async (req, res) => {
  res.render(`index`, {
    username : req.user.username
  })
});
  