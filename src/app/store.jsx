import { syncHistoryWithStore } from 'react-router-redux';
import { browserHistory } from 'react-router';
import { createStore, compose } from 'redux';
import { reduxReactFirebase } from 'redux-react-firebase';
import rootReducer from './core/reducers/index';

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.FIREBASE_DATABASE_URL,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET
};

const createStoreWithFirebase = compose(reduxReactFirebase(firebaseConfig), window.devToolsExtension
  ? window.devToolsExtension()
  : f => f)(createStore);

const store = createStoreWithFirebase(rootReducer, {});

export const history = syncHistoryWithStore(browserHistory, store);

export default store;
