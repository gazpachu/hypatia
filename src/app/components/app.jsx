import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { setLoading, setBreadcrumbs, changeViewport } from '../actions/actions';
import { API_URL, API_PATH } from '../constants/constants';
import Helpers from './common/helpers';
import $ from 'jquery';

import TopNav from './common/topnav/topnav';
import Loader from './common/loader/loader';

class App extends Component {
	
	constructor(props) {
		super(props);
	}
	
	componentDidMount() {
		let isDesktop = ($(window).width() > 768) ? true : false;
		this.props.changeViewport(isDesktop);
		
		window.onresize = Helpers.debounce(function() {
			let isDesktop = ($(window).width() > 768) ? true : false;
			this.props.changeViewport(isDesktop);
		}.bind(this));
	}
	
	render() {
		return (
			<div className="main js-main">
				<Loader {...this.props} />
				<TopNav {...this.props} />
				{React.cloneElement(this.props.children, this.props)}
			</div>
		)
	}
}

const mapStateToProps = ({ mainReducer: { isLoading, isDesktop, breadcrumbs } }) => ({ isLoading, isDesktop, breadcrumbs });

const mapDispatchToProps = {
	setLoading,
	setBreadcrumbs,
	changeViewport
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
