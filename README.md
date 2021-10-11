# Rules/Apps Solution

Welcome! You're looking at the repo for the client Rules/Apps frontend app. I built this frontend using this Auth0 SDK template which can be found here at this link: https://github.com/auth0-blog/auth0-express-pug-sample.

App Features:

-Auth0 protected solution

-Whitelisted users only capability

-Programmatic management token retrieval

-Returns readable list of all rules and their corresponding apps


# Instructions
Start by making a git clone of the code repo into your personal folder. 

Once you have the code repo downloaded, make sure to npm install in your terminal to download all the necessary packages.

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

Once you have your servers up and running, you can engage the frontend by opening two terminals at the directory and run "npm run dev" to start the app and run "npm run ui" in the other terminal to launch the ui in your browser. 



