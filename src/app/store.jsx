import { syncHistoryWithStore } from 'react-router-redux';
import { browserHistory } from 'react-router';
import { createStore, combineReducers, compose } from 'redux';
import rootReducer from './reducers/index';
import { reduxReactFirebase } from 'redux-react-firebase';
import { createHistory } from 'history';

const config = {
	apiKey: "AIzaSyA2ljx48Wz1Q9_4sIz9WEyThnClAKDZMxM",
    authDomain: "hypatia-2c96c.firebaseapp.com",
    databaseURL: "https://hypatia-2c96c.firebaseio.com",
	storageBucket: "hypatia-2c96c.appspot.com",
    messagingSenderId: "1094477494968"
};

const createStoreWithFirebase = compose(
    reduxReactFirebase(config),
	window.devToolsExtension ? window.devToolsExtension() : f => f
)(createStore);

const store = createStoreWithFirebase(rootReducer, {});

export const history = syncHistoryWithStore(browserHistory, store);

export default store;