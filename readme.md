# Hypatia: realtime education

## More info

Project's website: [https://gazpachu.github.io/hypatia/](https://gazpachu.github.io/hypatia/)

Slack group (invitation only): [https://hypatialms.slack.com](https://hypatialms.slack.com) To request for an invitation, contact me at hello [@] joanmira {.} com

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

- Create a new group in Slack.com and a custom integration (BOT)

- Create a file called `slack.jsx` in `/app/src/constants/` and add the following code with the API Token of the BOT you created:

````
export const slackConfig = {
  	apiToken: ""
}
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

### Production

Build for production

````
npm run build
````

Start production server

````
npm run start
````
