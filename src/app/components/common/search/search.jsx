import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { history } from '../../../store';
import Helpers from '../../common/helpers';
import $ from 'jquery';
import classNames from 'classnames';

import Icon from '../lib/icon/icon';
import SearchIcon from '../../../../../static/svg/search.svg';
import Forward from '../../../../../static/svg/forward.svg';
import Close from '../../../../../static/svg/x.svg';
import Expand from '../../../../../static/svg/expand.svg';

class Search extends Component {

	constructor(props) {
		super(props);
		
		this.handleChange = this.handleChange.bind(this);
		
		this.state = {
			keyword: ''
		}
	}
	
	handleChange(event) {
		
//		this.setState({keyword: event.target.value, questions: foundQuestions}, function() {
//			if ($('.search-item.match').length === 0 && this.state.keyword !== '') $('.no-results-found').addClass('none');
//			else $('.no-results-found').removeClass('none');
//		});
	}
	
	renderItem(question, i) {
		let maxLength = 20;
		
		let textBefore = question.title.substring(0, question.index),
			textMiddle = question.title.substring(question.index, question.index + this.state.keyword.length),
			textAfter = question.title.substring(question.index + this.state.keyword.length, question.title.length);
		
		let titleBefore = React.createElement('span', {className: 'before'}, textBefore),
			titleMiddle = React.createElement('span', {className: 'middle'}, textMiddle),
			titleAfter = React.createElement('span', {className: 'after'}, textAfter);
		
		return <li key={i} className={classNames('search-item', { match: question.index !== -1 && this.state.keyword !== ''}, {disabled: question.status != 'active'})}>
			{(question.status == 'active') ?
				<Link className="search-item-wrapper" to={`/insights?question_id=${question.id}`} onClick={this.props.closeSearch}>
					{titleBefore}{titleMiddle}{titleAfter}
					<Icon glyph={Forward} />
					<div className="meta">
						{question.status ? <span className={`status ${question.status}`}>{question.status.replace(/_/g, ' ')}</span> : ''}
						{question.topic ? <span className="parent">{question.topic}</span> : ''}
					</div>
				</Link> :
				<div className="search-item-wrapper">
					{titleBefore}{titleMiddle}{titleAfter}
					<div className="meta">
						{question.status ? <span className={`status ${question.status}`}>{question.status.replace(/_/g, ' ')}</span> : ''}
						{question.topic ? <span className="parent">{question.topic}</span> : ''}
					</div>
				</div>}
		</li>
	}
	
	expandPanel() {
		$('.js-search-panel').toggleClass('expanded');
	}
	
	render() {
		return (
			<div className="search-panel js-search-panel flyout">
				<button className="mobile-close" onClick={() => {this.props.closeSearch() }}><Icon glyph={Close} className="icon close" /></button>
				<input type="text" className="search-input input-field" value={this.state.keyword} onChange={this.handleChange} /><Icon glyph={SearchIcon} className="search-icon icon" /><button className="expand-icon" onClick={this.expandPanel}><Icon glyph={Expand} /></button>
				<div className="search-scroll">
					<p>Sorry, this feature will be available in the following weeks.</p>
					<ul className="search-items">
						<li className="search-item no-results-found">-- no results found --</li>
					</ul>
				</div>
			</div>
		)
	}
}

const mapStateToProps = ({ }) => ({ });

export default connect(mapStateToProps)(Search);