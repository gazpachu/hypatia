import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import $ from 'jquery';
import Helpers from '../helpers';
import Icon from '../lib/icon/icon';
import LoaderLogo from '../../../../../static/lighthouse-logo.svg';

class Loader extends Component {

	constructor(props) {
		super(props);
	}
	
	show() {
		$('.js-loader').animateCss('fadeIn');
		$('.js-main').addClass('loading');
	}
	
	hide() {
		$('.js-loader').animateCss('fadeOut', function() {
            $('.js-loader').hide();
			$('.js-main').removeClass('loading');
        });
	}
	
	render() {
		if (this.props.isLoading) this.show();
		else this.hide();
		
		return (
			<section className="loader js-loader">
				<div className="loader__circle"></div>
				<div className="loader__line-mask">
					<div className="loader__line"></div>
				</div>
				<Icon glyph={LoaderLogo} className="loader__logo" />
			</section>
		)
	}
}

export default Loader;
