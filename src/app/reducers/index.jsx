import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import { firebaseStateReducer } from 'redux-react-firebase';
import mainReducer from './mainReducer';

const rootReducer = combineReducers({
  mainReducer,
  firebase: firebaseStateReducer,
  routing: routerReducer
});

export default rootReducer;
