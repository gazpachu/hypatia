import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import $ from 'jquery';

class ModalBox extends Component {
	
	closeModalBox () {
		$('.js-modal-box').hide();
		
		$('.js-overlay').animateCss('fadeOut', function() {
			$('.js-overlay').hide();
		});	
		
		this.props.answer('cancel');
	}
	
	submitModalBox () {
		$('.js-modal-box').hide();
		
		$('.js-overlay').animateCss('fadeOut', function() {
			$('.js-overlay').hide();
		});
		
		this.props.answer('accept');
	}


	render () {		
		return (
			<div className="modal-box js-modal-box">
				<h4 className="modal-box-title">Remove &ldquo;{this.props.title}&rdquo; from <span className="text-capitalize">{this.props.location.pathname ? this.props.location.pathname.substring(1) : ''}</span>?</h4>
				<button className="btn btn-outline btn-xs" onClick={this.closeModalBox.bind(this)}>cancel</button>
				<button className="btn btn-primary btn-xs" onClick={this.submitModalBox.bind(this)}>submit</button>
			</div>
		)
	}
}

export default ModalBox;