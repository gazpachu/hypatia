# Hypatia: open realtime education

[![Build Status](https://travis-ci.org/theonapps/hypatia.svg?branch=master)](https://travis-ci.org/theonapps/hypatia)

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

## WARNING

This documentation is not stable. Don't test it yet!

- Install Node.js >= 4.5.0 [https://nodejs.org/](https://nodejs.org/)

- Install a Git client. I recommend SourceTree [https://www.sourcetreeapp.com/](https://www.sourcetreeapp.com/)

- Clone this repository into a folder in your computer [https://help.github.com/articles/which-remote-url-should-i-use/](https://help.github.com/articles/which-remote-url-should-i-use/)

- Install the NPM dependencies:

````
npm install
````

- Create a new project in your Firebase account

- Create a file called `firebase.jsx` in `/app/src/constants/` and add the following code with the details from the project you created:

````
export const firebaseConfig = {
  	apiKey: "",
    authDomain: "",
    databaseURL: "",
	storageBucket: "",
    messagingSenderId: ""
}
````

- Import `/data/hypatia-export.json` into your Firebase database

- Set the Firebase database rules to:

````
".read": "true",
".write": "auth != null"
````

- Create a `posts` folder in Firebase storage and upload demo images with the same filename as the posts' slugs (i.e.: /posts/new-virtual-campus.jpg)

- Set the Firebase storage rules to:

````
allow read: if true;
allow write: if request.auth != null;
````

- Create as many groups (teams) in Slack.com as you want and add a custom integration (BOT) to each one of them

- Create a file called `slack.jsx` in `/app/src/constants/` with the following structure. Enter the apiToken for each BOT you created and enter the details that make more sense to your groups

````
export const slackGroups = [{
		name: 'Maths',
		id: 'maths',
		slug: 'MA',
		apiToken: ""
	},
	{
		name: 'English',
		id: 'english',
		slug: 'EL',
		apiToken: ""
	}						
]
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