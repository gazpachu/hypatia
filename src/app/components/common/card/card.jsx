import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { API_URL, API_PATH } from '../../../constants/constants';
import $ from 'jquery';

import ModalBox from '../modalbox/modalbox';
import BasicAreaChart from '../../common/charts/basicareachart';
import Button from '../lib/button/button';
import Icon from '../lib/icon/icon';
import Remove from '../../../../../static/remove.svg';

class Card extends Component {
	
	constructor(props) {
		super(props);
		
		this.modalAnswer = this.modalAnswer.bind(this);
	}
	
	modalAnswer(state) {
		if (state === 'accept') {
			
		}
	}
	
	showModalBox() {
		$('.js-overlay').show().animateCss('fadeIn');
		$('#ModalBox_' + this.props.id).show();
	}	

	render () {
		return (
			<div>
				<div className="card js-card col-sm-4">
					<div className="inner">				
						<div className="head">
							<Link to={`/${this.props.id}`} className="title">{this.props.title}</Link>						
						</div>
						<div className="body">
							<div className="chart">
								{/*<BasicAreaChart {...this.props}/>*/}
							</div>
						</div>
						<div className="footer">
							<span className="remove" onClick={this.showModalBox.bind(this)}>
								<Icon glyph={Remove} />
							</span>
							<span className="date"><span className="last-updated">last updated</span>{this.props.date}</span>
						</div>
					</div>
				</div>
				<div>
					<ModalBox answer={this.modalAnswer} {...this.props} />
				</div>
			</div>
		)
	}
}

export default Card;