import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import store, { history } from './store';
import { Router, Route, IndexRoute } from 'react-router';
import ReactGA from 'react-ga';

import App from './components/app';
import Home from './components/home/home';
import NotFound from './components/notFound/notFound';

import rootReducer from './reducers/index';
import './components/bundle.scss';

ReactGA.initialize('UA-00000000-1', {
	debug: false,
	titleCase: false,
	gaOptions: {
		userId: ''
	}
});

function logPageView() {
	if (process.env.NODE_ENV === 'production') {
		ReactGA.set({ page: window.location.href });
		ReactGA.pageview(window.location.href);
	}
}

ReactDOM.render(
  	<Provider store={store}>
		<Router onUpdate={() => window.scrollTo(0, 0), logPageView} history={history}>
			<Route path="/" component={App}>
				<IndexRoute component={Home} />;
				<Route path="*" component={NotFound} />
			</Route>
		</Router>
  	</Provider>
, document.getElementById('react-root'));
