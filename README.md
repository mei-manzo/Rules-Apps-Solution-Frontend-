
Welcome! This is the repo for the client Rules/Apps frontend app. I built this frontend using the Auth0 Express SDK template which can be found here at this link: https://github.com/auth0-blog/auth0-express-pug-sample.

# Rules/Apps Solution

App features:

-Auth0 protected solution

-Whitelisted users only capability

-Programmatic management token retrieval

-Returns readable list of all rules and their corresponding apps


# Instructions
Start by making a git clone of the code repo into your personal folder. Once you have the code repo downloaded, make sure to npm install in your terminal to download all the necessary packages.

There are a few fields where you will need to add your own client/domain info so that the app can render your customized tenant information. Make sure to go into .env and update the following values with your information: 

DEV_PORT=4041

PROD_PORT=4040

AUTH0_ISSUER_BASE_URL='YOUR_DOMAIN_HERE'

AUTH0_CLIENT_ID="YOUR_ID"

BASE_URL=http://localhost:4040

SESSION_SECRET="YOUR_SESSION_SECRET"

In order for the frontend to render the data from our Management API, you'll need to download and run the two required backend servers. You can access them at these links:

First server: https://github.com/mei-manzo/Backend-Server-One

Second server: https://github.com/mei-manzo/Backend-Server-Two

Make sure your servers are connected, otherwise your app won't be able to render the data. Feel free to take a look at the README.md files in the servers' repos if you'd like some tips on how to get set up. The frontend app will automatically retrieve the HTTP request data from the backend servers so you don't need to worry about configuring a connection. Simply turn your servers on in your terminals using "npm run dev" and the connection will occur. 

Once you have your servers up and running, you can engage the frontend by opening two terminals at the directory and run "npm run dev" to start the app and run "npm run ui" in the other terminal to launch the ui in your browser. Tip: The authentication can sometimes "stick" and lock the user out, if this happens to you, open up an "incognito" tab in your browser to start a new session.


# Restrict to "Whitelisted Users Only"

To restrict the app to "Whitelisted Users" only, you'll need to go into your User Dashboard and create a new rule. Go to your main Dashboard -> Auth Pipeline -> Rules -> Create Empty Rule. Scroll down to the rule templates and click on "Whitelist for a Specific App". The following script should populate:


function userWhitelistForSpecificApp(user, context, callback) {

  // Access should only be granted to verified users.
  
  if (!user.email || !user.email_verified) {
  
    return callback(new UnauthorizedError('Access denied.'));
    
  }


  // only enforce for NameOfTheAppWithWhiteList
  
  // bypass this rule for all other apps
  
  if (context.clientName !== 'YOUR_APP_NAME') { //add the url for your solutions app
  
    return callback(null, user, context);
    
  }
  

  const whitelist = ['user1@email.com', 'user2@email.com']; // add your whitelisted users
  
  const userHasAccess = whitelist.some(function (email) {
  
    return email === user.email;
    
  });
  

  if (!userHasAccess) {
  
    return callback(new UnauthorizedError('Access denied.'));
    
  }
  

  callback(null, user, context);
  
}



Fill in the "clientName" and "whitelist" content with your own information, then scroll down and click "Save Changes". Now our solution will only be visible to our whitelisted users.


