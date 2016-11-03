import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import store, { history } from './store';
import { Router, Route, IndexRoute } from 'react-router';

import App from './components/app';
import Home from './components/home/home';

import rootReducer from './reducers/index';

import './components/bundle.scss';

ReactDOM.render(
  	<Provider store={store}>
		<Router onUpdate={() => window.scrollTo(0, 0)} history={history}>
			<Route path="/" component={App}>
				<IndexRoute component={Home} />
			</Route>
		</Router>
  	</Provider>
, document.getElementById('react-root'));
