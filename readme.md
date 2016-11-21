# Hypatia: realtime education

## More info

Project's website: [https://gazpachu.github.io/hypatia/](https://gazpachu.github.io/hypatia/)

## Getting Started

- Install Node.js >= 4.5.0 [https://nodejs.org/](https://nodejs.org/)

- Install a Git client. I recommend SourceTree [https://www.sourcetreeapp.com/](https://www.sourcetreeapp.com/)

- Clone this repository to a folder in your computer [https://help.github.com/articles/which-remote-url-should-i-use/](https://help.github.com/articles/which-remote-url-should-i-use/)

- npm install dependencies

````
npm install
````

- Create a file called `firebase.jsx` in `/app/src/constants/` and add the following code with your details from Firebase:

````
export const firebaseConfig = {
  	apiKey: "",
    authDomain: "",
    databaseURL: "",
	storageBucket: "",
    messagingSenderId: ""
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
