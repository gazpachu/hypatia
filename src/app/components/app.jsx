import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { setUser, setUserData, changeViewport, setPanel, setNotification } from '../actions/actions';
import firebase from 'firebase';
import $ from 'jquery';
import _ from 'lodash';
import { USER_CONFIRM_EMAIL } from '../constants/constants';
import Helmet from 'react-helmet';
import TopNav from './common/topnav/topnav';
import Loader from './common/loader/loader';
import Chat from './common/chat/chat';
import Calendar from './common/calendar/calendar';
import Grades from './common/grades/grades';
import Help from './common/help/help';
import Footer from './common/footer/footer';
import Notification from './common/notification/notification';

const defaultProps = {
	breadcrumbs: []
};

const propTypes = {
	isDesktop: PropTypes.bool,
	changeViewport: PropTypes.func,
	user: PropTypes.object,
	breadcrumbs: PropTypes.array
};

class App extends Component {

	componentDidMount() {
		this.onResize();
		window.onresize = _.debounce(() => this.onResize(), 500);

		this.removeListener = firebase.auth().onAuthStateChanged((user) => {
			if (user) {
				if (user.emailVerified) {
					this.props.setUser(user);
					firebase.database().ref(`/users/${user.uid}`).once('value')
						.then((snapshot) => {
							if (snapshot.val()) this.props.setUserData(snapshot.val());
						});
				} else {
					this.props.setNotification({ message: USER_CONFIRM_EMAIL, type: 'info' });
				}
			}
		});
	}

	componentWillUnmount() {
		this.removeListener();
	}

	onResize() {
		const isDesktop = $(window).width() > 768;
		this.props.changeViewport(isDesktop);
	}

	render() {
		let title;

		if (!this.props.breadcrumbs[0]) {
			title = 'Hypatia';
		} else {
			title = `${this.props.breadcrumbs.reverse().join(' < ')} < Hypatia`;
		}

		const panelClass = (this.props.panel === '') ? '' : 'open';

		if (panelClass === 'open') $('.page').css('position', 'fixed');
		else $('.page').css('position', 'relative');

		return (
			<div>
				<Helmet title={String(title)} />

				<div className="main js-main">
					<Loader />
					<Notification />
					<TopNav location={this.props.location} />
					<div className="main-background"></div>
					<div className={`dropdown-panel js-dropdown-panel ${panelClass}`}>
						<Chat class={(this.props.panel === 'chat') ? 'open' : ''} />
						<Calendar class={(this.props.panel === 'calendar') ? 'open' : ''} />
						<Grades class={(this.props.panel === 'grades') ? 'open' : ''} />
						<Help class={(this.props.panel === 'help') ? 'open' : ''} />
					</div>
					{React.cloneElement(this.props.children, this.props)}
					<Footer />
				</div>
			</div>
		);
	}
}

App.propTypes = propTypes;
App.defaultProps = defaultProps;

const mapStateToProps = ({
	mainReducer: {
		isDesktop,
		breadcrumbs,
		user,
		panel
	}
}) => ({
	isDesktop,
	breadcrumbs,
	user,
	panel
});

const mapDispatchToProps = {
	changeViewport,
	setUser,
	setUserData,
	setPanel,
	setNotification
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
