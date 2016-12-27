import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import $ from 'jquery';

class ModalBox extends Component {
	
	closeModalBox () {
		$('.js-modal-box-wrapper').animateCss('fade-out', function() {
			$('.js-modal-box-wrapper').hide();
		});	
		this.props.answer('cancel');
	}
	
	submitModalBox () {
		$('.js-modal-box-wrapper').animateCss('fade-out', function() {
			$('.js-modal-box-wrapper').hide();
		});
		this.props.answer('accept');
	}


	render () {		
		return (
			<div className="modal-box-wrapper js-modal-box-wrapper">
				<div className="modal-box">
					<h4 className="modal-box-title">{this.props.title}</h4>
					<button className="btn btn-outline btn-xs" onClick={this.closeModalBox.bind(this)}>cancel</button>
					<button className="btn btn-primary btn-xs" onClick={this.submitModalBox.bind(this)}>accept</button>
				</div>
				<div className="overlay" />
			</div>
		)
	}
}

export default ModalBox;