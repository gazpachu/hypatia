# Hypatia: realtime education

## WARNING

The project is currently under development, with countinous changes and some bits and bobs not working. Feel free to test it if you like but don't expect it to be production-ready until mid 2017.

## More info

Demo: [https://hypatia-8d923.firebaseapp.com](https://hypatia-8d923.firebaseapp.com)

You can sign up or use the demo account (read-only): demo@hypatialms.com / demouser

Project's website: [https://gazpachu.github.io/hypatia/](https://gazpachu.github.io/hypatia/)

Slack group (invitation only): [https://hypatialms.slack.com](https://hypatialms.slack.com) To request for an invitation, contact me at hello [@] joanmira {.} com

![Home module](https://firebasestorage.googleapis.com/v0/b/hypatia-8d923.appspot.com/o/screenshots%2Fhome.png?alt=media&token=07e2df57-71cf-4b50-99cb-c25ad83fa13c)

![Chat module](https://firebasestorage.googleapis.com/v0/b/hypatia-8d923.appspot.com/o/screenshots%2Fchat.png?alt=media&token=4479e9db-aff7-48a6-8e02-0b5fe4326cf5)

![Account module](https://firebasestorage.googleapis.com/v0/b/hypatia-8d923.appspot.com/o/screenshots%2Faccount.png?alt=media&token=6a035c52-84df-4acc-a56d-c15e352f34da)

![Calendar module](https://firebasestorage.googleapis.com/v0/b/hypatia-8d923.appspot.com/o/screenshots%2Fcalendar.png?alt=media&token=17ab3011-9c46-4afd-adf5-124797422217)

## Getting Started

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
