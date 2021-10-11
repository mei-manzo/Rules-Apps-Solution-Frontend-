/**
 * Required External Modules
 */

const express = require("express");
const path = require("path");
const { auth, requiresAuth } = require("express-openid-connect");
// const { auth } = require("express-openid-connect");

require("dotenv").config();

/**
 * App Variables
 */

const env = process.env.NODE_ENV || "development";
const app = express();
const port =
  env === "development" ? process.env.DEV_PORT : process.env.PROD_PORT;

/**
 *  App Configuration
 */

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
app.use(express.static(path.join(__dirname, "..", "public")));
app.use(
  auth({
    issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
    baseURL: process.env.BASE_URL,
    clientID: process.env.AUTH0_CLIENT_ID,
    secret: process.env.SESSION_SECRET,
    authRequired: false,
    auth0Logout: true,
  })
);

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.oidc.isAuthenticated();
  res.locals.activeRoute = req.originalUrl;
  next();
});

/**
 * Routes Definitions
 */

// > Home

app.get("/", (req, res) => {
  res.render("home");
});

// > Profile

app.get("/profile", requiresAuth(), (req, res) => {
  res.render("profile", {
    user: req.oidc.user,
  });
});
// > External API

app.get("/external-api", (req, res) => {
  res.render("external-api");
});

// > Backend data retrieval

//Initiate localStorage:
var LocalStorage = require('node-localstorage').LocalStorage, //here we are defining the localstorage variable
localStorage = new LocalStorage('./scratch');



// > Authentication
app.get("/sign-up/:page", (req, res) => {
  const { page } = req.params;

  res.oidc.login({
    returnTo: page,
    authorizationParams: {
      screen_hint: "signup",
    },
  });
});

app.get("/login/:page", (req, res) => {
  const { page } = req.params;

  res.oidc.login({
    returnTo: page,
  });
});

app.get("/logout/:page", (req, res) => {
  const { page } = req.params;

  res.oidc.logout({
    returnTo: page,
  });
});

///CALL ON MANAGEMENT DATA

var axios = require("axios").default; 
const { PassThrough } = require("stream");

var options = {
  method: 'GET',
  url: 'http://localhost:2000/',
};

var ruleList = {};
var ruleKeys = [];
var ruleNames = [];

axios.request(options).then(function (response) {
  rulescript = response.data;
  var someData = JSON.stringify(rulescript);
  var aData = JSON.parse(someData);
  var clientsFirst = aData[0]
  for (var i=0; i<Object.keys(aData).length; i++){
    if ((aData[i].script).includes("clientName")){
      ruleList[aData[i].name] = (aData[i].script);
      ruleKeys.push(aData[i].script);//create a dictionary of rules values
      ruleNames.push(aData[i].name);//create dictionary for rule
    }
    else{
      ruleList[aData[i].name] ="no app specified";
    }
  }
});


var clientOptions = {
  method: 'GET',
  url: 'http://localhost:7000/',
};

var clientDict = [];

axios.request(clientOptions).then(function (response) {
  clientData = response.data;
  // console.log(ruleKeys);
  var someClientData = JSON.stringify(clientData);
  var bData = JSON.parse(someClientData);
  for (var y= 0; y<Object.keys(bData).length; y++){
    clientDict.push(bData[y].name);//dict containing all app names

  }
  // console.log(clientDict[7]);
  for (var t = 0; t<ruleKeys.length; t++){
    for (var u=0; u<clientDict.length; u++){
      if ((ruleKeys[t]).includes(clientDict[u])){//check to see if rulekeys has client dict
        ruleKeys[t] = clientDict[u];//if it does, replace it
      } if (!(ruleKeys[t]).includes(clientDict[u])){
        //pass
      }
    }
  }
// console.log(ruleKeys);
  for (var r=0; r<ruleKeys.length; r++){
    if (ruleKeys[r].length > 20){
      ruleKeys[r] = "N/A - app removed or invalid";
    }
  }
  console.log(ruleKeys); //this is our complete list of apps for their corresponding rules

  for (var a=0; a<ruleNames.length; a++){
    // for (var w=0; w<ruleKeys.length; w++){
      ruleList[ruleNames[a]] = ruleKeys[a];
    
  }
  console.log(ruleList);

});



app.get("/solution", requiresAuth(), (req, res) => {
  res.render("solution", {
    user: req.oidc.user,
    rulescript: rulescript,
    ruleList: ruleList
  });
});



/**
 * Server Activation
 */

app.listen(port, () => {
  console.log(`Listening to requests on http://localhost:${port}`);
}); 