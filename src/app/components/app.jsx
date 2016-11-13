import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { setLoading, setBreadcrumbs, changeViewport } from '../actions/actions';
import { readEndpoint,  setEndpointHost, setEndpointPath, setAccessToken } from 'redux-json-api';
import { API_URL, API_PATH } from '../constants/constants';
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
		
		this.props.setEndpointHost(API_URL);
		this.props.setEndpointPath(API_PATH);
		this.props.readEndpoint('start').then(function(data) {
			this.props.setAccessToken(data.data.attributes.token);
			
			if (process.env.NODE_ENV === 'production') {
				if (this.props.header.data[0].attributes.email !== null) {
					// if the user is logged in with Yammer, then use user email
					ReactGA.set({ userId: this.props.header.data[0].attributes.email });
				} else {
					// if the user is not using/logged in with Yammer, then use custom string
					var d = new Date(),
						formattedDate = d.getDate() + '/' + (d.getMonth()+1) + '/' + d.getFullYear(),
						nonEmail = 'Non Yammer User on ' + formattedDate;	
					ReactGA.set({ userId: nonEmail });
				}		
			}
			this.props.readEndpoint('topics').then(function(data) {
				// Check for errors
			}.bind(this));
		}.bind(this));
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

const mapStateToProps = ({ mainReducer: { isDesktop, breadcrumbs }, api: { header = { data: [] } } }) => ({ isDesktop, breadcrumbs, header });

const mapDispatchToProps = {
	changeViewport,
	readEndpoint,
	setEndpointHost,
	setEndpointPath,
	setAccessToken
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
