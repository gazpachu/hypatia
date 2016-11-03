import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { history } from '../../../store';
import $ from 'jquery';
import classNames from 'classnames';

import Icon from '../lib/icon/icon';
import SearchIcon from '../../../../../static/search.svg';
import Forward from '../../../../../static/forward.svg';
import Close from '../../../../../static/x.svg';

class Search extends Component {

	constructor(props) {
		super(props);
		
		this.handleChange = this.handleChange.bind(this);
		
		this.state = {
			keyword: ''
		}
	}
	
	handleChange(event) {
		this.setState({keyword: event.target.value}, function() {
			if ($('.search-item.match').length === 0 && this.state.keyword !== '') $('.no-results-found').addClass('none');
			else $('.no-results-found').removeClass('none');
		});
	}
	
	render() {
		return (
			<div className="search-panel js-search-panel flyout">
				<button className="mobile-close" onClick={() => {this.props.closeSearch() }}><Icon glyph={Close} className="icon close" /></button>
				<input type="text" className="search-input" value={this.state.keyword} onChange={this.handleChange} /><Icon glyph={SearchIcon} className="search-icon icon" />
				<ul className="search-items">
					{this.props.topics ? this.props.topics.data.map((item, i) => (item.relationships.topics.data.length == 0) ? <li key={i} className={classNames('search-item', { match: item.attributes.name.toLowerCase().indexOf(this.state.keyword.toLowerCase()) !== -1 && this.state.keyword !== ''})}><Link to={`/${item.id}`} onClick={this.props.closeSearch}>{item.attributes.name}<Icon glyph={Forward} /></Link></li> : '') : ''}
					<li className="search-item no-results-found">-- no results found --</li>
				</ul>
			</div>
		)
	}
}

export default Search;