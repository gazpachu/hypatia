import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import store, { history } from './store';
import { Router, Route, IndexRoute } from 'react-router';
import ReactGA from 'react-ga';
import rootReducer from './reducers/index';
import './components/bundle.scss';

import App from './components/app';
import Home from './components/home/home';
import Dashboard from './components/home/home';
import Account from './components/home/home';
import AccountSettings from './components/home/home';
import AccountNotifications from './components/home/home';
import AccountRecord from './components/home/home';
import ListingPage from './components/home/home';
import DetailPage from './components/home/home';
import NotFound from './components/notFound/notFound';

// Google Analytics initializacion
ReactGA.initialize('UA-00000000-1', {
	debug: false,
	titleCase: false,
	gaOptions: {}
});

function logPageView() {
	if (process.env.NODE_ENV === 'production') {
		ReactGA.set({ page: window.location.href });
		ReactGA.pageview(window.location.href);
	}
}

// Router initialization
ReactDOM.render(
  	<Provider store={store}>
		<Router onUpdate={() => window.scrollTo(0, 0), logPageView} history={history}>
			<Route path="/" component={App}>
				<IndexRoute component={Home} />
				<Route path="/dashboard" component={Dashboard} />
				<Route path="/account" component={Account} />
					<Route path="/account/settings" component={AccountSettings} />
					<Route path="/account/notifications" component={AccountNotifications} />
					<Route path="/account/record" component={AccountRecord} />
				<Route path="/courses" component={ListingPage} />
				<Route path="/modules" component={ListingPage} />
				<Route path="/subjects" component={ListingPage} />
				<Route path="/news" component={ListingPage} />
				<Route path="/about" component={DetailPage} />
					<Route path="/about/history" component={DetailPage} />
					<Route path="/about/research" component={DetailPage} />
					<Route path="/about/people" component={ListingPage} />
					<Route path="/about/contact" component={DetailPage} />
				<Route path="*" component={NotFound} />
			</Route>
		</Router>
  	</Provider>
, document.getElementById('react-root'));
