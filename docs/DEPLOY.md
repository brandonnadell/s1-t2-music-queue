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
  - cp .env.SAMPLE .env  
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
