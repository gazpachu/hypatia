import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { history } from '../store';
import { setUser, changeViewport, setPanel, setNotification, setUserInfo } from '../actions/actions';
import { USER_CONFIRM_EMAIL, ADMIN_LEVEL } from '../constants/constants';
import firebase from 'firebase';
//import { auth } from '../constants/firebase';
import _ from "lodash";
import $ from 'jquery';
import ReactGA from 'react-ga';
import Helmet from "react-helmet";
import TopNav from './common/topnav/topnav';
import Loader from './common/loader/loader';
import Chat from './common/chat/chat';
import Calendar from './common/calendar/calendar';
import Grades from './common/grades/grades';
import Help from './common/help/help';
import Notification from './common/notification/notification';

import Icon from './common/lib/icon/icon';
import Close from '../../../static/svg/x.svg';

const defaultProps = {
	breadcrumbs: []
};

const propTypes = {
	isDesktop: PropTypes.bool,
	changeViewport: PropTypes.func,
	user: PropTypes.object,
	userInfo: PropTypes.object,
	breadcrumbs: PropTypes.array
};

class App extends Component {
	
	constructor(props) {
		super(props);
	}
	
	componentDidMount() {
		let isDesktop = ($(window).width() > 768) ? true : false;
		this.props.changeViewport(isDesktop);
		
		window.onresize = _.debounce(function() {
			let isDesktop = ($(window).width() > 768) ? true : false;
			this.props.changeViewport(isDesktop);
		}.bind(this), 500);
		
		this.removeListener = firebase.auth().onAuthStateChanged((user) => {
      		if (user) {
				if (user.emailVerified) {
					this.props.setUser(user);
					firebase.database().ref('/users/' + user.uid).once('value').then(function(snapshot) {
						if (snapshot.val()) this.props.setUserInfo(snapshot.val().info);
					}.bind(this));
				}
				else {
					user.sendEmailVerification();
					this.props.setNotification({message: USER_CONFIRM_EMAIL, type: 'info'});
				}
			}
      	});
	}
																
	componentWillUnmount() {
		this.removeListener();
	}
	
	render() {
		let title;

		if (!this.props.breadcrumbs[0]) {
			title = 'Hypatia';
		} else {
			title = this.props.breadcrumbs.reverse().join(' < ') + ' < Hypatia';
		}
		
		let panelClass = (this.props.panel === '') ? '' : 'open';
		
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
				</div>
			</div>
		)
	}
}

App.propTypes = propTypes;
App.defaultProps = defaultProps;

const mapStateToProps = ({ mainReducer: { isDesktop, breadcrumbs, user, userInfo, panel } }) => ({ isDesktop, breadcrumbs, user, userInfo, panel });

const mapDispatchToProps = {
	changeViewport,
	setUser,
	setPanel,
	setNotification,
	setUserInfo
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
