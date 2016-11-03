import { createStore, applyMiddleware, compose } from 'redux';
import { syncHistoryWithStore } from 'react-router-redux';
import { browserHistory } from 'react-router';
import thunk from 'redux-thunk';
import rootReducer from './reducers/index';
import { createHistory } from 'history';

const store = createStore(rootReducer, compose(applyMiddleware(thunk),
    window.devToolsExtension ? window.devToolsExtension() : f => f
  ));

export const history = syncHistoryWithStore(browserHistory, store);

export default store;
