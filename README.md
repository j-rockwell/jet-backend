# JET (Backend)
JET is short for John's Exercise Tracker. JET was designed as a fun utility app for myself and my friends to track our exercises and share them with eachother. It's heavily inspired by [Gravitus](https://gravitus.com). There's really no intent to compete or even push this to the App Store it's more of a learning experience and to show people "hey that fella knows how to use React Native let's throw billions of dollars at him he's so cool and brave we have so much startup money we dont even know what to do with it hey why are we in silicon valley agai-".
  
This repository goes hand-in-hand with the JET Frontend repository which is developed in JavaScript utilizing the [React Native](https://reactnative.dev) framework. To make anything happen visually, you're probably going to want to start there.

# Setup
* Install node.js/npm
* Install MongoDB and make sure the database is running
* Create a .env file in the main directory with the following parameters
    * **NODE_ENV=development** (Accepts **development** and **production**)
    * **SERVER_PORT=3000**
    * **MONGO_URI=mongodb://localhost:27017/jet**
    * **SALT_ROUNDS=10**
* Run command `npm install` in the main directory
* Run command `npm run dev` to start the server automatically in development mode, or `npm run prod` to start the server in production mode

### API Keys
When you run the JET Backend in development mode for the first time, a testing API Key is automatically generated with the value **123**. By default, all requests passed to JET require this API Key present with the name **token**.

If you switch to production, this key will be deleted automatically on first launch.

# Routes
### Users
`/users/create`  
Creates a new JET User
Required parameters:
* email
* firstName
* lastName
* password
* token

`/users/login`  
Authorizes an existing JET User
Required parameters:
* email
* password
* token

`/users/update/info`  
Updates account information for a JET User
Required parameters:
* id
* email
* firstName
* lastName
* token

`/users/update/password`  
Updates account password for a JET User
Required parameters:
* id
* password
* token

### Sessions
`/session/create`  
Creates a new workout session
* data (Must match the SessionSchema!)
* token

`/session/get`   
Retrieves data for an existing exercise session
* id
* token

`/session/delete`  
Delete an existing exercise session
* id
* token
