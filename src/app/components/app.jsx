import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { history } from '../store';
import { setUser, changeViewport } from '../actions/actions';
import { firebaseAuth } from '../helpers/firebase';
import _ from "lodash";
import $ from 'jquery';
import ReactGA from 'react-ga';
import Helmet from "react-helmet";
import TopNav from './common/topnav/topnav';
import Loader from './common/loader/loader';

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
	}
	
	componentDidMount() {
		let isDesktop = ($(window).width() > 768) ? true : false;
		this.props.changeViewport(isDesktop);
		
		window.onresize = _.debounce(function() {
			let isDesktop = ($(window).width() > 768) ? true : false;
			this.props.changeViewport(isDesktop);
		}.bind(this), 500);
		
		this.removeListener = firebaseAuth().onAuthStateChanged((user) => {
			console.log(user);
      		if (user) this.props.setUser(user);
			else if (this.isPrivatePage()) history.push('/');
      	});
		
		this.unlisten = history.listen( location => {
			if (this.isPrivatePage(location.pathname)) history.push('/');
		});
	}
																
	componentWillUnmount() {
		this.removeListener();
		this.unlisten();
	}
	
	isPrivatePage(location) {
		location = location || this.props.location.pathname;
		(location == '/dashboard' || location.indexOf('account') !== -1) ? true : false;
	}
	
	render() {
		let title = "Hypatia | " + this.props.breadcrumbs.join(' > ');		
		
		return (
			<div>
				<Helmet title={String(title)} />

				<div className="main js-main">
					<Loader />
					<TopNav location={this.props.location} />
					{React.cloneElement(this.props.children, this.props)}
				</div>
			</div>
		)
	}
}


App.propTypes = propTypes;
App.defaultProps = defaultProps;

const mapStateToProps = ({ mainReducer: { isDesktop, breadcrumbs, user } }) => ({ isDesktop, breadcrumbs, user });

const mapDispatchToProps = {
	changeViewport,
	setUser
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
