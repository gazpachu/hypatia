import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { history } from '../store';
import { setAuthenticated, changeViewport } from '../actions/actions';
import { firebaseAuth } from '../helpers/auth';
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
      		if (user) this.props.setAuthenticated(true);
			else {
				if (this.props.location.pathname == '/dashboard' || this.props.location.pathname.indexOf('account') !== -1)
					history.push('/');
			}
      	});
	}
																
	componentWillUnmount() {
		this.removeListener()		
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

const mapStateToProps = ({ mainReducer: { isDesktop, breadcrumbs, authenticated } }) => ({ isDesktop, breadcrumbs, authenticated });

const mapDispatchToProps = {
	changeViewport,
	setAuthenticated
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
