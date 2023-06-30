const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session')
const MongoDBStore = require('connect-mongodb-session')(session)
const mongoose = require('mongoose');
const csrf = require('csurf')
const flash = require('connect-flash')
require('dotenv').config()

const errorController = require('./controllers/error');
const User = require('./models/user');

MONGO_URI = process.env.DATABASE;

const app = express();

const store = new MongoDBStore({
  uri:MONGO_URI,
  collection:'session'
})

const csrfProtection = csrf()
app.use(flash())

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth')
const { log } = require('console');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({secret:'sec',resave:false,saveUninitialized:false,store:store}))

// console(req.session.user._id)
app.use(csrfProtection)

app.use((req, res, next) => {
  if (!req.session.user) {
     return next()
    
  }
  User.findById(req.session.user._id)
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => console.log(err));
});

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
}) 




app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes)

app.use(errorController.get404);

const port = process.env.PORT
app.listen(5000,() => {
  console.log('app is running at 5000');
})


mongoose.connect(MONGO_URI,{ useNewUrlParser: true,useUnifiedTopology: true 
    
})

.then(() =>{
    console.log('connection is succesfull!!!');
}).catch((e)=>{
    console.log("no connection");
})
