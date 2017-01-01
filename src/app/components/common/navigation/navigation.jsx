import React, { Component, PropTypes } from 'react';
import { history } from '../../../store';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import Breadcrumbs from '../breadcrumbs/breadcrumbs';
import { ADMIN_LEVEL } from '../../../constants/constants';
import Search from '../search/search';
import Helpers from '../../common/helpers';
import $ from 'jquery';
import Icon from '../lib/icon/icon';
import Trophy from '../../../../../static/svg/trophy.svg';
import Calendar from '../../../../../static/svg/calendar.svg';
import Info from '../../../../../static/svg/info.svg';
import SearchIcon from '../../../../../static/svg/search.svg';
import Close from '../../../../../static/svg/x.svg';
import Forward from '../../../../../static/svg/forward.svg';
import Back from '../../../../../static/svg/back.svg';
import Logout from '../../../../../static/svg/logout.svg';
import Chat from '../../../../../static/svg/chat.svg';
import User from '../../../../../static/svg/avatar.svg';
import Course from '../../../../../static/svg/course.svg';
import Subject from '../../../../../static/svg/subject.svg';
import Module from '../../../../../static/svg/module.svg';
import Activity from '../../../../../static/svg/activity.svg';
import Post from '../../../../../static/svg/post.svg';
import Admin from '../../../../../static/svg/cog.svg';
import Dashboard from '../../../../../static/svg/dashboard.svg';
import Team from '../../../../../static/svg/team.svg';
import Account from '../../../../../static/svg/account.svg';

const defaultProps = {
	nav_items: [{
		id: 0,
		title: 'Dashboard',
		icon: Dashboard,
		link: '/dashboard'
	},
	{
		id: 10,
		title: 'Account',
		icon: Account,
		children: [
		{
			id: 12,
			title: 'My account',
			link: '/account'
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
		id: 1,
		title: 'Courses',
		icon: Course,
		link: '/courses'
	},
	{
		id: 2,
		title: 'Subjects',
		icon: Subject,
		link: '/subjects'
	},
	{
		id: 3,
		title: 'Modules',
		icon: Module,
		link: '/modules'
	},
	{
		id: 3,
		title: 'Activities',
		icon: Activity,
		link: '/activities'
	},
	{
		id: 1,
		title: 'News',
		icon: Post,
		link: '/news'
	},
	{
		id: 4,
		title: 'About',
		icon: Team,
		children: [{
			id: 7,
			title: 'Summary',
			link: '/about'
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
	},
	{
		id: 1,
		title: 'Admin',
		icon: Admin,
		link: '/admin',
		level: ADMIN_LEVEL
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
	
	clickItem(event) {
		let $el = $(event.currentTarget).closest('.nav-item');
		$el.toggleClass('opened');
	}
														   
	renderItem(item, i) {
		let itemActive = (this.props.location.pathname === item.link) ? 'active' : '',
			hasChildren = (item.children) ? 'has-children' : '';
		
		return (!item.level || (item.level && item.level <= this.props.userInfo.level)) ? <li key={i} className={`nav-item ${hasChildren}`}>
			{(item.icon) ? <Icon glyph={item.icon} className="icon item-icon" /> : ''}
			{(item.children) ? <span className="title" onClick={this.clickItem}>{item.title}<Icon glyph={Forward} className="icon arrow"/></span> : <Link to={item.link} className="title" onClick={this.props.toggleNav}>{item.title}</Link>}
			{(item.children) ? <ul className="nav-children">
				{item.children.map((child, j) => <li key={j} className={`nav-child`}><Link to={child.link} onClick={this.props.toggleNav}>{child.title}</Link></li>)}
			</ul> : ''}
		</li> : '';
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

const mapStateToProps = ({ mainReducer: { user, userInfo } }) => ({ user, userInfo });

export default connect(mapStateToProps)(Navigation);