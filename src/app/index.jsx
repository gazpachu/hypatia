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
import AccountSettings from './components/account/settings';
import AccountNotifications from './components/account/notifications';
import AccountRecord from './components/home/home';
import Listing from './components/common/listing/listing';
import Page from './components/common/page/page';
import Post from './components/common/post/post';
import Course from './components/common/course/course';
import Subject from './components/common/subject/subject';
import Module from './components/common/module/module';
import Activity from './components/common/activity/activity';
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
					if (!snapshot.val() || !snapshot.val().info.level || (snapshot.val().info.level < requiresLevel)) history.push('/');
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
				<Route path="/tour" component={Tour} />
				<Route path="/dashboard" component={Dashboard} onEnter={requireAuth} />
				<Route path="/account" component={AccountSettings} onEnter={requireAuth} />
					<Route path="/account/notifications" component={AccountNotifications} onEnter={requireAuth} />
					<Route path="/account/record" component={AccountRecord} onEnter={requireAuth} />
				<Route path="/courses" component={Listing} />
					<Route path="/courses/:slug" component={Course} />
						<Route path="/courses/:slug/register" component={Course} />
						<Route path="/courses/:slug/subjects" component={Course} />
						<Route path="/courses/:slug/fees" component={Course} />
						<Route path="/courses/:slug/requirements" component={Course} />
				<Route path="/subjects" component={Listing} />
					<Route path="/subjects/:slug" component={Subject} />
						<Route path="/subjects/:slug/modules" component={Subject} />
						<Route path="/subjects/:slug/activities" component={Subject} />
				<Route path="/modules" component={Listing} />
					<Route path="/modules/:slug" component={Module} />
				<Route path="/activities" component={Listing} />
					<Route path="/activities/:slug" component={Activity} />
				<Route path="/news" component={Listing} />
					<Route path="/news/:slug" component={Post} />
				<Route path="/about" component={Page} />
					<Route path="/about/research" component={Page} />
					<Route path="/about/people" component={Page} />
					<Route path="/about/contact" component={Page} />
				<Route path="/admin" component={Admin} level={ADMIN_LEVEL} onEnter={requireAuth} />
					<Route path="/admin/:type/:action" component={Admin} level={ADMIN_LEVEL} onEnter={requireAuth} />
					<Route path="/admin/:type/:action/:slug" component={Admin} level={ADMIN_LEVEL} onEnter={requireAuth} />
				<Route path="*" component={NotFound} />
			</Route>
		</Router>
  	</Provider>
, document.getElementById('react-root'));
