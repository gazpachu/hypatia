import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import { reducer as api } from 'redux-json-api';
import mainReducer from './mainReducer';

const rootReducer = combineReducers({mainReducer: mainReducer, api: api, routing: routerReducer});

export default rootReducer;