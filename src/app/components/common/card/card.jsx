import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { API_URL, API_PATH } from '../../../constants/constants';
import $ from 'jquery';
import moment from 'moment';

import ModalBox from '../modalbox/modalbox';
import BasicAreaChart from '../../common/charts/basicareachart';
import Icon from '../lib/icon/icon';
import Remove from '../../../../../static/svg/remove.svg';
import Close from '../../../../../static/svg/close.svg';
import SpeechBubble from '../../../../../static/svg/speech-bubble.svg';


class Card extends Component {
	
	constructor(props) {
		super(props);
		
		this.showModalBox = this.showModalBox.bind(this);
		this.showCommentBox = this.showCommentBox.bind(this);
		this.hideCommentBox = this.hideCommentBox.bind(this);
	}
	
	showModalBox() {
		$('.js-overlay').show().animateCss('fadeIn');
		$('.js-modal-box').show();
		this.props.modalTitle(this.props.cardMetaData.attributes.name);
		this.props.setCardData(this.props.cardData);
	}
	
	showCommentBox(e) {
		$('#CardFront_' + this.props.id).removeClass('flipInX').addClass('flipOutX');
		$('#CardBack_' + this.props.id).removeClass('flipOutX u-hide').addClass('flipInX');
		
		
	}
	
	hideCommentBox(e) {
		$('#CardBack_' + this.props.id).removeClass('flipInX').addClass('flipOutX');
		$('#CardFront_' + this.props.id).removeClass('flipOutX').addClass('flipInX');
	}
	

	render () {
		return (
			<div>
				<div className="card js-card col-sm-4">
					<div className="card-front animated" id={'CardFront_' + this.props.id}>				
						<div className="head">{/* replace 1 with ${this.props.id} when DB has more questions */}
							<Link to={`/insights?question_id=1`} className="title">{this.props.cardMetaData.attributes.name}</Link>
							{ this.props.location.pathname.substring(1) === 'inbox' ?
								<div className="sent-by">sent by
									<span className="sender-name">{this.props.cardMetaData.attributes.sender_name}</span>
									<span onClick={this.showCommentBox}>
										<Icon glyph={SpeechBubble} className="icon speech-bubble animated rubberBand" />
									</span>
								</div>
							: '' }
						</div>
						<div className="body">
							<div className="chart">
								<BasicAreaChart snapshot={this.props.snapshot} />
							</div>
						</div>
						<div className="footer">
							<span className="remove" onClick={this.showModalBox}>
								<Icon glyph={Remove} />
							</span>
							<span className="date"><span className="last-updated">last updated</span>{moment(this.props.cardMetaData.attributes.updated_at).format('D/M/YYYY')}</span>
						</div>
					</div>
					{ this.props.location.pathname.substring(1) === 'inbox' ?
						<div className="card-back u-hide animated" id={'CardBack_' + this.props.id}>
							<span onClick={this.hideCommentBox}>
								<Icon glyph={Close} className="icon close" />
							</span>
							<div className="report-title">{this.props.cardMetaData.attributes.name}</div>
							<div className="report-comment">{this.props.cardMetaData.attributes.comment}</div>
							<div className="report-sender">{this.props.cardMetaData.attributes.sender_name}</div>
						</div>
					: '' }
				</div>
			</div>
		)
	}
}

export default Card;