import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { history } from '../store';
import { setUser, changeViewport, setPanel } from '../actions/actions';
import { firebaseAuth } from '../helpers/firebase';
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
	header: PropTypes.object,
	breadcrumbs: PropTypes.array
};

class App extends Component {
	
	constructor(props) {
		super(props);
		
		this.state = {
			redirectTo: '/'
		}
		
		this.isPrivatePage = this.isPrivatePage.bind(this);
	}
	
	componentDidMount() {
		let isDesktop = ($(window).width() > 768) ? true : false;
		this.props.changeViewport(isDesktop);
		
		window.onresize = _.debounce(function() {
			let isDesktop = ($(window).width() > 768) ? true : false;
			this.props.changeViewport(isDesktop);
		}.bind(this), 500);
		
		this.removeListener = firebaseAuth().onAuthStateChanged((user) => {
      		if (user) {
				this.props.setUser(user);
				history.push(this.state.redirectTo);
			}
			else if (this.isPrivatePage()) history.push('/');
      	});
		
		this.unlisten = history.listen( location => {
			if (this.isPrivatePage(location.pathname) && !this.props.user) {
				this.setState({ redirectTo: location.pathname });
				history.push('/');
			}
		});
	}
																
	componentWillUnmount() {
		this.removeListener();
		this.unlisten();
	}
	
	isPrivatePage(location) {
		location = location || this.props.location.pathname;
		if (location == '/dashboard' || location.indexOf('account') !== -1) return true;
		else return false;
	}
	
	render() {
		let title;
		if (this.props.breadcrumbs[0] === 'Home') {
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

const mapStateToProps = ({ mainReducer: { isDesktop, breadcrumbs, user, panel } }) => ({ isDesktop, breadcrumbs, user, panel });

const mapDispatchToProps = {
	changeViewport,
	setUser,
	setPanel
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
