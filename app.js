const { connectToDB } = require(`./modules/database`);
const cookieParser = require('cookie-parser');
const session = require('express-session');
const bodyParser = require('body-parser');
const passport = module.exports = require('passport');
const { secretKey } = require(`./config.json`);
const express = require(`express`);
const bcrypt = require('bcrypt'); 
const path = require(`path`);
const fs = require(`fs`);

var app = module.exports = express()
let { port } = require(`./config.json`)

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '/web/assets/')));
app.set('view engine', 'ejs');

app.set('views', path.join(__dirname, './web/public/'));

app.use(session({
  resave: true, // don't save session if unmodified
  saveUninitialized: true, // don't create session until something stored
  secret: secretKey
}));


app.use(passport.initialize());
app.use(passport.session());
  

const LocalStrategy = require('passport-local').Strategy;
passport.use(new LocalStrategy(
  { usernameField: 'username', passwordField: 'password' },
  async (username, password, done) => {
    try {
      const adb = await connectToDB();
      const [result] = await adb.query('SELECT * FROM users WHERE username = ?', [username]);
      adb.end();
  
      if (result.length === 1) {
        const user = result[0];
        // Use bcrypt to compare the hashed password with the provided password
        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) {
            return done(err);
          }
          if (isMatch) {
            return done(null, user);
          } else {
            return done(null, false, { message: 'Invalid username or password.' });
          }
        });
      } else {
        return done(null, false, { message: 'Invalid username or password.' });
      }
    } catch (error) {
      return done(error);
    }
  }
));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const adb = await connectToDB();
    const [result] = await adb.query('SELECT * FROM users WHERE id = ?', [id]);
    adb.end();

    if (result.length === 1) {
      return done(null, result[0]);
    } else {
      return done(new Error('User not found'));
    }
  } catch (error) {
    return done(error);
  }
});
  

const routes =  searchForJSFiles(`./routes/`)
const modules =  searchForJSFiles(`./modules/`)

routes.forEach((loader) => {
  require(`./routes/${loader}`)
  console.log(`[Loader] : loaded ${loader}`)
})

modules.forEach((loader) => {
  require(`./modules/${loader}`)
  console.log(`[Moduler] : loaded ${loader}`)
})


app.listen(port, () => {
    console.log(`Express started on port 3000`);
})




function searchForJSFiles(directory) {
  const files = fs.readdirSync(directory);
  const jsFiles = [];

  for (const file of files) {
    const filePath = path.join(directory, file);
    const stats = fs.statSync(filePath);

    if (stats.isDirectory()) {
      const subDirectoryFiles = searchForJSFiles(filePath);
      jsFiles.push(...subDirectoryFiles);
    } else if (path.extname(file) === '.js') {
      jsFiles.push(file);
    }
  }
  
  return jsFiles;
  
}