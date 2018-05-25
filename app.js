const express = require("express");
const mongoose = require("mongoose");
const keys = require("./config/keys.js");
const cookieSession = require("cookie-session");
const passport = require("passport");
const bodyParser = require("body-parser");
mongoose.connect(keys.mongoURI);


require("./models/User");
require("./models/Survey");
require('./services/passport');
const app = express();
app.use(bodyParser.json());
// tell express to use cookie
app.use(cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 100,
    keys: [keys.cookieKey]
}));
// tell passport to use cookie
app.use(passport.initialize());
app.use(passport.session());

require('./routes/authRoutes')(app);
require('./routes/billingRoutes')(app);
require('./routes/surveyRoutes.js')(app);
if(process.env.NODE_ENV ==='production'){
    //express will serve up production assets
    //like our main.js file ,or main.css file!
    app.use(express.static('client/build'));
    //express will serve up the index.html file
    //if it doesn't recognize the route
    const path = require('path');
    app.get("*",(req,res)=>{
        res.sendFile(path.resolve(__dirname,'client','build','index.html'));
    });
}
const PORT = process.env.PORT||5000;
app.listen(PORT);
