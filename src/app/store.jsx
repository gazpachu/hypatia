import { syncHistoryWithStore } from 'react-router-redux';
import { browserHistory } from 'react-router';
import { createStore, combineReducers, compose } from 'redux';
import rootReducer from './reducers/index';
import { reduxReactFirebase } from 'redux-react-firebase';
import { createHistory } from 'history';
import { firebaseConfig } from './constants/firebase';

const createStoreWithFirebase = compose(
    reduxReactFirebase(firebaseConfig),
	window.devToolsExtension ? window.devToolsExtension() : f => f
)(createStore);

const store = createStoreWithFirebase(rootReducer, {});

export const history = syncHistoryWithStore(browserHistory, store);

export default store;