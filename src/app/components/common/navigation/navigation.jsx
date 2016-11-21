import React, { Component, PropTypes } from 'react';
import { history } from '../../../store';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import Breadcrumbs from '../breadcrumbs/breadcrumbs';
import Search from '../search/search';
import Helpers from '../../common/helpers';
import $ from 'jquery';
import Icon from '../lib/icon/icon';
import Trophy from '../../../../../static/trophy.svg';
import Calendar from '../../../../../static/calendar.svg';
import Info from '../../../../../static/info.svg';
import SearchIcon from '../../../../../static/search.svg';
import Close from '../../../../../static/x.svg';
import Forward from '../../../../../static/forward.svg';
import Back from '../../../../../static/back.svg';
import Logout from '../../../../../static/logout.svg';
import Chat from '../../../../../static/chat.svg';

const defaultProps = {
	nav_items: [{
		id: 0,
		title: 'Dashboard',
		link: '/dashboard'
	},
	{
		id: 10,
		title: 'Account',
		children: [{
			id: 11,
			title: 'Summary',
			link: '/account'
		},
		{
			id: 12,
			title: 'Settings',
			link: '/account/settings'
		},
		{
			id: 13,
			title: 'Notifications',
			link: '/account/notifications'
		},
		{
			id: 14,
			title: 'Record',
			link: '/account/record'
		}]
	},
	{
		id: 5,
		title: 'News',
		link: '/news'
	},
	{
		id: 1,
		title: 'Courses',
		link: '/courses'
	},
	{
		id: 2,
		title: 'Subjects',
		link: '/subjects'
	},
	{
		id: 3,
		title: 'Modules',
		link: '/modules'
	},
	{
		id: 4,
		title: 'About',
		children: [{
			id: 15,
			title: 'About',
			link: '/about'
		},
		{
			id: 6,
			title: 'History',
			link: '/about/history'
		},
		{
			id: 7,
			title: 'Research',
			link: '/about/research'
		},
		{
			id: 8,
			title: 'People',
			link: '/about/people'
		},
		{
			id: 9,
			title: 'Contact',
			link: '/about/contact'
		}]
	}]
};

const propTypes = {
	nav_items: PropTypes.array.isRequired,
	location: PropTypes.object.isRequired,
	toggleNav: PropTypes.func.isRequired,
	toggleSearch: PropTypes.func.isRequired,
	closeSearch: PropTypes.func.isRequired
};

class Navigation extends Component {

	constructor(props) {
		super(props);
		
		this.renderItem = this.renderItem.bind(this);
		this.clickItem = this.clickItem.bind(this);
	}
	
	componentDidMount() {
		
	}
	
	clickItem(event) {
		let $el = $(event.currentTarget).closest('.nav-item');
		$el.toggleClass('opened');
	}
														   
	renderItem(item, i) {
		let itemActive = (this.props.location.pathname === item.link) ? 'active' : '',
			hasChildren = (item.children) ? 'has-children' : '';
		
		return <li key={i} className={`nav-item ${hasChildren}`}>
			{(item.children) ? <span className="title" onClick={this.clickItem}>{item.title}<Icon glyph={Forward} /></span> : <Link to={item.link} className="title">{item.title}</Link>}
			{(item.children) ? <ul className="nav-children">
				{item.children.map((child, j) => <li key={j} className={`nav-child`}><Link to={child.link}>{child.title}</Link></li>)}
			</ul> : ''}
		</li>;
	}
														   
	render() {
		return (
			<nav className="navigation">
				<Breadcrumbs location={this.props.location} setItem={this.setItem} resetNav={this.resetNav} />
				<div className="sidenav js-sidenav flyout">
					<button className="mobile-close" onClick={() => {this.props.toggleNav() }}><Icon glyph={Close} className="icon close" /></button>
					<table className="mobile-nav-items">
						<tbody>
							<tr>
								<td><div className="mobile-nav-item" onClick={() => {this.props.toggleNav() }}><Icon glyph={Calendar} className="icon calendar" /></div></td>
								<td><div className="mobile-nav-item" onClick={() => {this.props.toggleNav() }}><Icon glyph={Trophy} className="icon trophy" /></div></td>
								<td><div className="mobile-nav-item" onClick={() => {this.props.toggleNav() }}><Icon glyph={Info} className="icon info" /></div></td>
								<td><button className="mobile-nav-item" onClick={() => {this.props.toggleSearch() }}><Icon glyph={SearchIcon} className="icon search" /></button></td>
								<td><button className="mobile-nav-item"><Icon glyph={Chat} /></button></td>
							</tr>
						</tbody>
					</table>
					<div className="nav-scroll">
						<ul className="nav-items">
							{this.props.nav_items ? this.props.nav_items.map((item, i) => this.renderItem(item, i)) : ''}
						</ul>
					</div>
				</div>
				<Search closeSearch={this.props.closeSearch} />
			</nav>
		)
	}
}

Navigation.propTypes = propTypes;
Navigation.defaultProps = defaultProps;

const mapStateToProps = ({ }) => ({ });

export default connect(mapStateToProps)(Navigation);