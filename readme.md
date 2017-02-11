# Hypatia: open realtime education

[![Build Status](https://travis-ci.org/theonapps/hypatia.svg?branch=master)](https://travis-ci.org/theonapps/hypatia)
[![Github All Releases](https://img.shields.io/github/downloads/atom/atom/total.svg)]()
[![npm](https://img.shields.io/npm/l/express.svg)]()

## WARNING

The project is currently under development, with continuous changes and some bits and bobs not working. Feel free to test it if you like but don't expect it to be production-ready until mid 2017.

## More info

Demo: [https://hypatia-8d923.firebaseapp.com](https://hypatia-8d923.firebaseapp.com) (You need to sign up with a valid email address to access some pages)

Project's website: [https://theonapps.github.io/hypatia/](https://theonapps.github.io/hypatia/)

Slack group (invitation only): [https://hypatialms.slack.com](https://hypatialms.slack.com) To request for an invitation, please contact hello [@] theon {.} io

![Home](https://firebasestorage.googleapis.com/v0/b/hypatia-8d923.appspot.com/o/screenshots%2Fhome.jpg?alt=media&token=1421d0c1-97ad-486c-b040-695e128a9e4a)

![Page](https://firebasestorage.googleapis.com/v0/b/hypatia-8d923.appspot.com/o/screenshots%2Fpage.jpg?alt=media&token=4aa59160-68d2-46b0-a2f0-35740ecde21d)

![Admin](https://firebasestorage.googleapis.com/v0/b/hypatia-8d923.appspot.com/o/screenshots%2Fadmin.jpg?alt=media&token=6911a15b-d0ca-4bc0-8fd0-619d92c97706)

## Getting Started

Warning! This documentation is not super stable. Post an issue if you find any trouble or something is not clear

- Install Node.js >= 4.5.0 [https://nodejs.org/](https://nodejs.org/)

- Install a Git client. I recommend SourceTree [https://www.sourcetreeapp.com/](https://www.sourcetreeapp.com/)

- Clone this repository into a folder in your computer [https://help.github.com/articles/which-remote-url-should-i-use/](https://help.github.com/articles/which-remote-url-should-i-use/)

- Install the NPM dependencies:

````
npm install
````

- Create a new project in your [Firebase account](http://firebase.google.com)

- Create a file called `.env` in the root of your cloned repository and add the following code. Replace the values with the ones from the project you created in Firebase:

````
FIREBASE_API_KEY=your_firebase_api_key
FIREBASE_AUTH_DOMAIN=your_firebase_project.firebaseapp.com
FIREBASE_DATABASE_URL=https://your_firebase_project.firebaseio.com
FIREBASE_STORAGE_BUCKET=your_firebase_project.appspot.com
````

- If you want some demo data, import `/data/demo-data.json` into your Firebase database

- If you are going to use Firebase storage, you should give read access to everyone, otherwise only the authenticated users will be able to download images or files. In your [Firebase console](https://console.firebase.google.com), replace the rules with these ones:

````
allow read: if true;
allow write: if request.auth != null;
````

### Start development server with hot reloading

````
npm run dev
````

### Testing

Run test once

````
npm run test
````

Test watch

````
npm run test:watch
````

### Linting

Linting is using Airbnb Eslint configuration

````
npm run lint
````

### Deploy to production

Build for production

````
npm run build
````

Install Firebase tools (if you haven't done it yet)

````
npm install -g firebase-tools
````

Login and init the project

````
firebase login
firebase init
````

Deploy to Firebase

````
firebase deploy
````

## Credits

Icons from Flaticon.com (Freepik and Madebyoliver), triangles background by rvika from Fotolia and photos from Google Creative Commons search results

## Copyright & License

Copyright (c) 2016-2017 Joan Siddharta Mira Martos (Theon.io) - Released under the [GPLv2](https://www.gnu.org/licenses/old-licenses/gpl-2.0.html) license.