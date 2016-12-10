import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import store, { history } from './store';
import { Router, Route, IndexRoute } from 'react-router';
import ReactGA from 'react-ga';
import rootReducer from './reducers/index';
import './components/bundle.scss';
import firebase from 'firebase';
import { firebaseConfig } from './constants/firebase';
import { ADMIN_LEVEL } from './constants/constants';
import App from './components/app';
import Home from './components/home/home';
import Dashboard from './components/dashboard/dashboard';
import Notifications from './components/account/notifications';
import Settings from './components/account/settings';
import AccountNotifications from './components/home/home';
import AccountRecord from './components/home/home';
import ListingPage from './components/home/home';
import DetailPage from './components/home/home';
import NotFound from './components/notFound/notFound';
import Admin from './components/admin/admin';

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

function requireAuth(nextState, replace, callback) {
	firebase.auth().onAuthStateChanged((user) => {
		if (!user || !user.emailVerified) history.push('/');
		else {
			let requiresLevel = 0;
			nextState.routes.map(function(route, i) {
				if (route.level) requiresLevel = route.level;				 
			})
			if (requiresLevel > 0) {
				firebase.database().ref('/users/' + user.uid).once('value').then(function(snapshot) {
					if (!snapshot.val().info.level || snapshot.val().info.level < requiresLevel) history.push('/');
					else callback();
				});
			}
			else callback();
		}
	});
}

// Router initialization
ReactDOM.render(
  	<Provider store={store}>
		<Router onUpdate={() => window.scrollTo(0, 0), logPageView} history={history}>
			<Route path="/" component={App}>
				<IndexRoute component={Home} />
				<Route path="/dashboard" component={Dashboard} onEnter={requireAuth} />
				<Route path="/account" component={Settings} onEnter={requireAuth} />
					<Route path="/account/notifications" component={AccountNotifications} onEnter={requireAuth} />
					<Route path="/account/record" component={AccountRecord} onEnter={requireAuth} />
				<Route path="/courses" component={ListingPage} />
				<Route path="/modules" component={ListingPage} />
				<Route path="/subjects" component={ListingPage} />
				<Route path="/news" component={ListingPage} />
				<Route path="/about" component={DetailPage} />
					<Route path="/about/research" component={DetailPage} />
					<Route path="/about/people" component={ListingPage} />
					<Route path="/about/contact" component={DetailPage} />
				<Route path="/admin" component={Admin} level={ADMIN_LEVEL} onEnter={requireAuth} />
				<Route path="*" component={NotFound} />
			</Route>
		</Router>
  	</Provider>
, document.getElementById('react-root'));
