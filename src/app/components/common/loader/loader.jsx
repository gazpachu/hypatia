import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import $ from 'jquery';
import Helpers from '../helpers';
import Icon from '../lib/icon/icon';
import LoaderLogo from '../../../../../static/lighthouse-logo.svg';

class Loader extends Component {

	constructor(props) {
		super(props);
	}
	
	render() {
		let isLoading = (this.props.isLoading) ? 'fade-in' : 'fade-out';
		
		return (
			<section className={`loader js-loader ${isLoading}`}>
				<div className="loader__circle"></div>
				<div className="loader__line-mask">
					<div className="loader__line"></div>
				</div>
				<Icon glyph={LoaderLogo} className="loader__logo" />
			</section>
		)
	}
}

const mapStateToProps = ({ mainReducer: { isLoading } }) => ({ isLoading });

export default connect(mapStateToProps)(Loader);