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

- Create a file called `store.jsx` in `/app/src/` and add the following code with your details from Firebase:

````
import { syncHistoryWithStore } from 'react-router-redux';
import { browserHistory } from 'react-router';
import { createStore, combineReducers, compose } from 'redux';
import rootReducer from './reducers/index';
import { reduxReactFirebase } from 'redux-react-firebase';
import { createHistory } from 'history';

const config = {
	apiKey: "",
    authDomain: "",
    databaseURL: "",
	storageBucket: "",
    messagingSenderId: ""
};

const createStoreWithFirebase = compose(
    reduxReactFirebase(config),
	window.devToolsExtension ? window.devToolsExtension() : f => f
)(createStore);

const store = createStoreWithFirebase(rootReducer, {});

export const history = syncHistoryWithStore(browserHistory, store);

export default store;
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
