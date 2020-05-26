# DEPLOYMENT INSTRUCTIONS

Video accompanying deployment instructions:  
https://www.youtube.com/watch?v=kpaP3NtNJ4s&feature=youtu.be

## Step 0: Fork this repo

- Fork the project repo to your own personal GitHub account by clicking on the "Fork" button at the upper right hand of the repo's page on GitHub. This creates a personal copy of the repo under your own GitHub account. This is necessary because you can't deploy an app to Heroku unless you have admin access to the repo.

## step 1: install node

- if you type node --version on your local system and you see a version that is 10.\* or higher you can skip this step
- if not refer to:
  - MacOS: https://ucsb-cs48.github.io/jstopics/node_macos/
  - Windows: https://ucsb-cs48.github.io/jstopics/node_windows/
  - Linux: https://ucsb-cs48.github.io/jstopics/node_linux/
- when finished you should be able to type the following into the terminal and get the following responses:

  - type `node --version` and get a number that is 10.\* or higher (e.g. v10.16.3)
  - type `npm --version` and get a version number (as opposed to command not found)
  - type `npx --version` and get a version number (as opposed to command not found)

## step 2: npm install

- make sure you are in the files main directory and type npm install

## step 3: Setting up Auth0

- create .env from .env.SAMPLE by typing the following:
  ```
  cp .env.SAMPLE .env
  ```
- create an account with auth0 (https://auth0.com/signup)
  - if you already have an account sign in at https://manage.auth0.com/
- navigate to the APPLICATIONS page in the sidebar and click the "Create Application" button
- name the application
- in the application that was just created click on the settings tab
- Find "Application URIs" and entter the following:
  | Field | Value |
  | --------------------- | ------------------------------------ |
  | Application Login URI | (leave this blank) |
  | Allowed Callback URLs | `http://localhost:3000/api/callback` |
  | Allowed Logout URLs | `http://localhost:3000` |
- scroll to the bottom and click "Save Changes"
- scroll up and look under "Basic Information"
- copy the values of "Domain", "Client Id", and "Client Secret" into .env file

## step 4: Setting up Firebase

- go to https://console.firebase.google.com and sign up for a firebase account
  - just log in if you already have one
- on the dashboard click on add project
- name the project
- click continue on google analytics (doesn't really matter whether or not you enable it)
- accept the terms and conditions and create the project
- press continue when project is ready
- under "Get started by adding Firebase to your app" press the icon </> (next to android) which corresponds to a web app
- add an app nickname
- click continue
- now press "Database" in the sidebar and then press "Create Database"
  - press "start in production mode"
  - choose where you want your server to be located and press "Done"
- now press "Cloud Firestore" on the right of "Database" and click on "Realtime Database" in the drop down menu
- click on the "Rules" tab
- change the values from `false` to `auth.uid != NULL`

  - should end up looking like

  ```
  {
  "rules": {
    ".read": "auth.uid != null",
    ".write": "auth.uid != null;"
    }
   }
  ```

- Now click the gear wheel next to "Project Overview" and press "Project Settings" in the drop down
- Scroll down untill you see a section called "Firebase SDK snippet"
- copy the respective values to the keys into prodConfig in /client/firebase.js
  - note: devConfig may only have empty quotes
  - note: if there are already keys there, they will not work since they are restricted
- navigate back to the settings tab (gear wheel next to "Project Overview") and press "Project Settings" in the drop down
- in the top menu bar select "Service Accounts" and scroll down and click on the button that says "Generate New Private Key"
  - this will download a file with keys and values
- navigate to `.env`
- type in `PRODUCTION` for `FIREBASE_ENV`
- type the respect values for the keys `FIREBASE_PRIVATE_KEY`, `FIREBASE_CLIENT_EMAIL`, and `FIREBASE_PROJECT_ID` from the downloaded file in `.env`
  - note: values not surrounded by quotes

## step 5: Setting Up the Youtube API

- navigate to https://console.developers.google.com/ and login or create an account
- create a new project and name it
- go to the search bar and search for the `YouTube Data API v3` API
- click credentials on the sidebar
- click "Create Credentials" button and select "API KEY" from the menu\*\*
- copy this API KEY onto your clipboard
- navigate to /utils/youtube_api.js and delete "enter api key here"
- paste API Key as value of variable API_KEY was

  - note: make sure the api key is surrounded by quotation marks
  - note: if there is already a key there, it will not work since they are restricted

- The API key is going to be restricted at a later step. If you want to deploy on both localhost and Heroku, create another API key by following \*\* again, and follow the "Restrictions if deploying to Heroku" steps (in step 8) for just one of the keys.
  - restrictions must be put on
- There is no need to specify restrictions if only deploying to localhost

## Step 6: Deploying on local host

- run `npm run dev` and the app should be deployed successfully on http://localhost:3000

## step 7: Start Deploying on Heroku

- login or create an account on https://heroku.com
- install Heroku CLI on system
  - follow directions on https://devcenter.heroku.com/articles/heroku-cli
- go back to dashboard and create a new app on HEROKU and name it(will be referenced as my-app-name)

## step 8: adding heroku to auth0 and youtube API

- login at https://manage.auth0.com/
- click on Applciation on sidebar
- select the application that was made earlier
- go to the settings tab
- your proudction url will be of the form

```
https://my-app-name.herokuapp.com
```

- wherever you see localhost:3000, you want to put a comma and add the same exact string, except replacing `http://localhost:3000` with `https://my-app-name.herokuapp.com`
- for example, it goes from:  
  Allowed Callback URLs:  
  `http://localhost:3000/api/callback`  
  to this:  
  Allowed Callback URLs:  
  `http://localhost:3000/api/callback, https://my-app-name.herokuapp.com/api/callback`

### Restrictions if deploying to Heroku

- make sure you are on the Credentials Tab
- click on the API KEY name under "API Keys" for the api key you are going to use when deploying to Heroku
- after clicking the name you are going to want to scroll down to the "Application restrictions tab
- select HTTP referrers
- Under "Website restrictions" type in "https://my-app-name.herokuapp.com/*"
  - note:this is the production link with /\* appended to it
- Make sure the API Key listed under utils/youtube.js is the one corresponding to the one with restrictions, since it will be public.

## step 9: finish deploying on Heroku

- go back to the settings page on the heroku dashboard
- add two config variables
- Find "Application URIs" and entter the following:
  | Key | Value |
  | ------------------------ | ----------------------------------------- |
  | REDIRECT_URI | proudction URL with /api/callback appended|
  | POST_LOGOUT_REDIRECT_URI | Your production URL |
  - log in to heroku on the command line by typing

```
heroku login -i
```

- after logging in run npm install
- then run

```
git add .
git commit -m "commit message"
git push origin master
```

- run the following command:

```
npx heroku-dotenv push --app my-app-name
```

- go to deploy tab on dashboard
- connect github repo to the Heroku app and click deploy to the master branch