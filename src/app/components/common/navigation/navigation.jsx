import React, { Component, PropTypes } from 'react';
import { history } from '../../../store';
import { Link } from 'react-router';
import Breadcrumbs from '../breadcrumbs/breadcrumbs';
import Search from '../search/search';
import $ from 'jquery';
import Icon from '../lib/icon/icon';
import Star from '../../../../../static/star.svg';
import Mail from '../../../../../static/mail.svg';
import SearchIcon from '../../../../../static/search.svg';
import Close from '../../../../../static/x.svg';
import Forward from '../../../../../static/forward.svg';
import Back from '../../../../../static/back.svg';
import Logout from '../../../../../static/logout.svg';
import Chat from '../../../../../static/chat.svg';

class Navigation extends Component {

	constructor(props) {
		super(props);
		
		this.updateNav = this.updateNav.bind(this);
		this.resetNav = this.resetNav.bind(this);
		this.renderItem = this.renderItem.bind(this);
		this.clickItem = this.clickItem.bind(this);
		this.setItem = this.setItem.bind(this);
		
		this.state = {
			currentItem: null,
			initialised: false
		}
	}
	
	componentDidMount() {
		history.listen( location => {
			let id = location.pathname.substring(1);
			this.checkLocation(id);
		});
	}
	
	componentDidUpdate() {	
		if(this.props.topics && this.props.topics.data.length > 0 && !this.state.initialised) {
			this.setState({initialised: true}, function() {
				this.checkLocation(this.props.params.questionId);
			});
		}
	}
	
	checkLocation(id) {
		if (!this.searchIdIndex(id)) this.resetNav(id);
		else this.setItem(id);
	}
	
	resetNav(id) {
		if (id !== undefined) {
			(id === '') ? this.setState({currentItem: {id: 'home', level: 0, name: 'Home'}}) : this.setState({currentItem: {id: null, level: 0, name: ''}});
		}
	}
	
	setItem(id) {
		let index = this.searchIdIndex(id);
		
		if (index) {
			this.setState({currentItem: {id: id, level: this.props.topics.data[index].attributes.level, name: this.props.topics.data[index].attributes.name}});
		}
	}
	
	searchIdIndex(id) {
		// Look for the index of the given ID in the topics dataset
		let index = null;
		if (this.props.topics) {
			this.props.topics.data.map(function(item, i) {
				if (item.id === id) index = i;
			});
			return index;
		}
	}
	
	updateNav(id, updateHistory) {	
		if (updateHistory) {
			(id === 'home') ? history.push('/') : history.push(id);
			if (this.props.navigating) this.props.toggleNav();
		}
		else {
			this.setItem(id);
		}
	}
	
	clickItem(event) {
		let $el = $(event.currentTarget),
			id = $el.data('id');
		
		if (!$el.hasClass('disabled')) {
			if ($el.hasClass('has-children')) {
				this.setState({currentItem: {id: this.state.currentItem.id, level: this.state.currentItem.level+1, name: this.state.currentItem.name}});
			}
			else this.updateNav(id, true);
		}
	}
	
	renderItem(item, i) {
		
		let hidden = (this.state.currentItem && this.state.currentItem.level === item.attributes.level) ? '' : 'hidden';
		let active = (this.state.currentItem && this.state.currentItem.id === item.id) ? 'active' : '';
		let disabled = (item.attributes.status !== 'active') ? 'disabled' : '';
		let hasChildren = '';
		
		if (this.props.topics.data.length > 0) {
			for (var j=0; j<this.props.topics.data.length; j++) {
				let topic = this.props.topics.data[j];
				if (topic.relationships.parent.data && topic.relationships.parent.data.id === item.id) {
					hasChildren = 'has-children';
					break;
				}
			}
		}
		
		return <li className={`nav-item ${active} ${disabled} ${hidden} ${hasChildren}`} key={i} onClick={this.clickItem} data-parent={item.relationships.parent.data ? item.relationships.parent.data.id : ''} data-id={item.id} data-level={item.attributes.level}>{item.attributes.name}<Icon glyph={Forward} /></li>
	}
	
	render() {
		return (
			<nav className="navigation">
				<Breadcrumbs {...this.props} setItem={this.setItem} resetNav={this.resetNav} />
				<div className="sidenav js-sidenav flyout">
					<Link className="mobile-go-back" to="/" onClick={() => {this.props.toggleNav() }}><Icon glyph={Back} /></Link>
					<button className="mobile-close" onClick={() => {this.props.toggleNav() }}><Icon glyph={Close} className="icon close" /></button>
					<table className="mobile-nav-items">
						<tbody>
							<tr>
								<td><Link to="/favourites" className="mobile-nav-item" onClick={() => {this.props.toggleNav() }}><Icon glyph={Star} className="icon star" /></Link></td>
								<td><Link to="/inbox" className="mobile-nav-item" onClick={() => {this.props.toggleNav() }}><Icon glyph={Mail} className="icon mail" /></Link></td>
								<td><button className="mobile-nav-item" onClick={() => {this.props.toggleSearch() }}><Icon glyph={SearchIcon} className="icon search" /></button></td>
								<td><button className="mobile-nav-item"><Icon glyph={Chat} /></button></td>
								<td><button className="mobile-nav-item" onClick={() => {this.props.toggleLogout() }}><Icon glyph={Logout} className="icon logout" /></button></td>
							</tr>
						</tbody>
					</table>
					<ul className="nav-items">
						{this.props.topics ? this.props.topics.data.map((item, i) => this.renderItem(item, i)) : ''}
					</ul>
				</div>
				<Search closeSearch={this.props.closeSearch} />
			</nav>
		)
	}
}

export default Navigation;