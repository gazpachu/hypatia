import React, { Component, PropTypes } from 'react';
import { setNotification } from '../../../actions/actions';
import { connect } from 'react-redux';
import $ from 'jquery';

import Icon from '../lib/icon/icon';
import Tick from '../../../../../static/svg/tick.svg';
import Close from '../../../../../static/svg/close.svg';
import Info from '../../../../../static/svg/info.svg';

const defaultProps = {
	notification: {message: '', type: ''}
};

const propTypes = {
	notification: PropTypes.object
};

class Notification extends Component {
	
	showNotification () {
		let $el = $('.js-notification');
		
		setTimeout(function() {
			$el.show().animateCss('slideInRight');
		}.bind(this), 1000);
		
		setTimeout(function() {
			$el.animateCss('slideOutRight', function() {
				$el.hide();
				this.props.setNotification(defaultProps.notification);
			}.bind(this));
		}.bind(this), 7000);
	}
	
	componentWillReceiveProps(newProps) {
		if (newProps.notification.message !== '') {
			this.showNotification();
		}
	}

	render () {		
		return (
			<div className={`notification js-notification ${this.props.notification.type}`}>
				<Icon className="icon success-icon" glyph={Tick} />
				<Icon className="icon error-icon"glyph={Close} />
				<Icon className="icon info-icon"glyph={Info} />
				<span className="message">{this.props.notification.message}</span>
			</div>
		)
	}
}

Notification.propTypes = propTypes;
Notification.defaultProps = defaultProps;

const mapDispatchToProps = {
	setNotification
}

const mapStateToProps = ({ mainReducer: { notification } }) => ({ notification });

export default connect(mapStateToProps, mapDispatchToProps)(Notification);