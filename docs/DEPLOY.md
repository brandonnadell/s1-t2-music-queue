#DEPLOYMENT INSTRUCTIONS

#step 1: install node
- if you type node --version on your local system and you see a version that is 10.* or higher you can skip this step  
- if not refer to:  
  - MacOS: https://ucsb-cs48.github.io/jstopics/node_macos/  
  - Windows: https://ucsb-cs48.github.io/jstopics/node_windows/  
  - Linux: https://ucsb-cs48.github.io/jstopics/node_linux/  
- when finished you should be able to type the following into the terminal and get the following responses:
  - type node --version and get a number that is 10.* or higher (e.g. v10.16.3)
  - type npm --version and get a version number (as opposed to command not found)
  - type npx --version and get a version number (as opposed to command not found)
  
#step 2: npm install  
- make sure you are in the files main directory and type npm install  
- make sure to fix all dependency issues 

#step 3: Setting up OAuth  
- create .env from .env.SAMPLE by typing the following:  
   ```
   cp .env.SAMPLE .env  
   ```
- create an account with auth0 (https://auth0.com/signup) 
  - if you already have an account sign in  
- navigate to the APPLICATIONS page in the sidebar and click the "Create Application" button  
- name the application  
- in the application that was just created click on the settings tab  
- Find "Application URIs" and entter the following:
   | Field                 | Value                                |
   | --------------------- | ------------------------------------ |
   | Application Login URI | (leave this blank)                   |
   | Allowed Callback URLs | `http://localhost:3000/api/callback` |
   | Allowed Logout URLs   | `http://localhost:3000`              |
- scroll to the bottom and click "Save Changes"
- scroll up and look under "Basic Information"
- copy the values of "Domain", "Client Id", and "Client Secret" into .env file

#step 4: Setting up Firebase
- go to https://console.firebase.google.com and sign up for a firebase account
  - just log in if you already have one
- on the dashboard click on add project
- name the project
- click continue on google analytics (doesn't really matter whether or not you enable it)
- accept the terms and conditions and create the project
- press continue when project is ready
- under "Get started by adding Firebase to your app" press the icon </> (next to android) which corresponds to a web app
- add an app nickname
- 
#step 5: Setting Up the Youtube API  
- create youtube_api.js from youtube_api.js.SAMPLE in /utils by typing  
  ```
   cp /utils/youtube_api.js.SAMPLE /utils/.yotube_api.js  
   ```
   - we will now get the youtube api key to fill into youtube_api.js
- navigate to https://console.developers.google.com/ and login or create an account
- create a new project and name it
- go to the search bar and search for the `YouTube Data API v3` API  
- click credentials on the sidebar  
- click "Create Credentials" button and select "API KEY" from the menu
- copy this API KEY onto your clipboard
- navigate to /utils/youtube_api.js and delete "enter api key here"
- paste API Key where "enter api key here" was
  - note make sure the api key is surrounded by quotation marks

#step 6: Start Deploying on Heroku  
- login or create an account on https://heroku.com
- install Heroku CLI on system
  - follow directions on https://devcenter.heroku.com/articles/heroku-cli
- go back to dashboard and create a new app on HEROKU and name it
- log in to heroku on the command line by typing
``` 
heroku login -i
```
- after logging in run npm install
- run the following command:
```
npx heroku-dotenv push --app cs48-s20-cgaucho-lab00
```
- go to deploy tab on dashboard
- connect github repo to the Heroku app and click deploy to the master branch

#step 7: adding heroku to auth0
- login at  https://auth0.com/ 
- click on Applciation on sidebar
- select the application that was made earlier
- go to the settings tab
- your proudction url will be of the form 
``` 
https://my-app-name.herokuapp.com
```
- wherever you see localhost:3000, you want to put a comma and add the same exact string, except replacing ```http://localhost:3000``` with ```https://my-app-name.herokuapp.com``` 
- for example, it goes from:  
Allowed Callback URLs:  
```http://localhost:3000/api/callback```  
to this:  
Allowed Callback URLs:  
```http://localhost:3000/api/callback, https://my-app-name.herokuapp.com/api/callback```  

#step 8: finish deploying on Heroku
- go back to the settings page on the heroku dashboard
- add two config variables
- Find "Application URIs" and entter the following:
   | Key                      | Value                                     |
   | ------------------------ | ----------------------------------------- |
   | REDIRECT_URI             | proudction URL with /api/callback appended|
   | POST_LOGOUT_REDIRECT_URI | Your production URL                       |
  




