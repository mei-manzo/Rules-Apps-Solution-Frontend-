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


//Initiate XMLHttpRequest:
// var XMLHttpRequest = require ("xhr2");
  
// var xhr = new XMLHttpRequest();

// xhr.onreadystatechange = function () {
//         if (this.readyState != 4) return;

//         if (this.status == 200) {
//             // console.warn(xhr.responseText)
//             var data = JSON.parse(this.responseText);
//             console.log(data);
//             localStorage.setItem("rules", JSON.stringify(data));
//             // we get the returned data
//         }
    
//         // end of state change: it can be after some time (async)
// };
    
// xhr.open('GET', 'http://localhost:7000/', true);
// xhr.send();

////GET CLIENTS
// xhr.onreadystatechange = function () {
//   if (this.readyState != 4) return;

//   if (this.status == 200) {
//       // console.warn(xhr.responseText)
//       var data = JSON.parse(this.responseText);
//       console.log(data);
//       localStorage.setItem("clients", JSON.stringify(data));
//       // we get the returned data
//   }

//   // end of state change: it can be after some time (async)
// };

// xhr.open('GET', 'http://localhost:7001/', true);
// xhr.send();

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

////////////////

var axios = require("axios").default; ////WATCH OUT FOR IF THIS BREAKS SOMETHING

var options = {
  method: 'GET',
  url: 'http://localhost:2000/',
};

var ruleList = {};

axios.request(options).then(function (response) {
  rulescript = response.data;
  var someData = JSON.stringify(rulescript);
  var aData = JSON.parse(someData);
  var clientsFirst = aData[0]
  for (var i=0; i<Object.keys(clientsFirst).length; i++){
    if ((aData[i].script).includes("clientName")){
      ruleList[aData[i].name] = (aData[i].script);
    }
    else{
      ruleList[aData[i].name] ="no app specified";
    }
  }
  //need to make a dictionary of clients, check if clients exist within rules, if so then add as value
  // console.log(ruleList);
});


var clientOptions = {
  method: 'GET',
  url: 'http://localhost:7000/',
};


axios.request(clientOptions).then(function (response) {
  clientData = response.data;
  var someClientData = JSON.stringify(clientData);
  var bData = JSON.parse(someClientData);

  console.log(bData[0].name);
});


app.get("/solution", requiresAuth(), (req, res) => {
  res.render("solution", {
    user: req.oidc.user,
    // newRule: newRule,
    rulescript: rulescript,
    ruleList: ruleList
    // Rules: JSON.stringify(localStorage.getItem("rulesData")),
  });
});



/**
 * Server Activation
 */

app.listen(port, () => {
  console.log(`Listening to requests on http://localhost:${port}`);
});

