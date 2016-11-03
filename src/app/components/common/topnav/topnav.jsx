import React, { Component, PropTypes } from 'react';
import { history } from '../../../store';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import $ from 'jquery';
import Navigation from '../navigation/navigation';
import { setAlphaSorting } from '../../../actions/actions';

import Icon from '../lib/icon/icon';
import Logo from '../../../../../static/logo.svg';
import Avatar from '../../../../../static/avatar.svg';
import Star from '../../../../../static/star.svg';
import Mail from '../../../../../static/mail.svg';
import Search from '../../../../../static/search.svg';
import Close from '../../../../../static/x.svg';
import SortPassive from '../../../../../static/sort-passive.svg';
import SortActiveUp from '../../../../../static/sort-active-up.svg';
import SortActiveDown from '../../../../../static/sort-active-down.svg';
import Logout from '../../../../../static/logout.svg';
import Chat from '../../../../../static/chat.svg';

class TopNav extends Component {
    
	constructor(props) {
		super(props);
		
		this.state = {
			avatar: '',
			searching: false,
			navigating: false
		}
		
		this.toggleNav = this.toggleNav.bind(this);
		this.openNav = this.openNav.bind(this);
		this.closeNav = this.closeNav.bind(this);
		this.toggleSearch = this.toggleSearch.bind(this);
		this.openSearch = this.openSearch.bind(this);
		this.closeSearch = this.closeSearch.bind(this);
		this.toggleView = this.toggleView.bind(this);
	}
	
	componentDidMount() {
		history.listen( location =>  {
			let page = location.pathname.substring(1);

			if (page === 'favourites' || page === 'inbox') {
				$('.js-card-controls').show();
			} else {
				$('.js-card-controls').hide();
			}
		});	
	}
	
	componentDidUpdate() {
		if (this.props.isDesktop) {
			$('#mode').prop('checked', false);
			$('.js-page').removeClass('list-view');
		} else {
			$('#mode').prop('checked', true);
			$('.js-page').addClass('list-view');
		}
    }	
	
	toggleNav() {
		if (!$('.js-sidenav').hasClass('opened')) this.openNav();
		else this.closeNav();
	}
	
	openNav() {
		if (!$('.js-sidenav').hasClass('opened')) {
			$('.flyout').removeClass('opened');
			$('.js-overlay').show().animateCss('fadeIn');
			$('.js-sidenav').addClass('opened').removeClass('closed');
			$('.js-nav-icon').addClass('opened');
			this.setState({searching: false, navigating: true});
		}
	}
	
	closeNav() {
		if ($('.js-sidenav').hasClass('opened')) {
			$('.js-sidenav').removeClass('opened').addClass('closed');
			$('.js-overlay').animateCss('fadeOut', function() {
				$('.js-overlay').hide();
			});
			$('.js-nav-icon').removeClass('opened');
			this.setState({searching: false, navigating: false});
		}
	}
	
	toggleSearch() {
		if (!$('.js-search-panel').hasClass('opened')) this.openSearch();
		else this.closeSearch();
	}
	
	openSearch() {
		let $searchPanel = $('.js-search-panel');
		if (!$searchPanel.hasClass('opened')) {
			$('.flyout').removeClass('opened');
			$searchPanel.addClass('opened').removeClass('closed');
			$('.js-nav-icon').removeClass('opened');
			$('.js-overlay').show().animateCss('fadeIn');
			$('.search-input').focus();
			this.setState({searching: true, navigating: false});
		}
	}
	
	closeSearch() {
		let $searchPanel = $('.js-search-panel');
		if ($searchPanel.hasClass('opened')) {
			$searchPanel.removeClass('opened').addClass('closed');
			$('.js-overlay').animateCss('fadeOut', function() {
				$('.js-overlay').hide();
			});
			this.setState({searching: false, navigating: false});
		}
	}
	
	toggleView(e) {
		$(e.currentTarget).is(':checked') ? $('.js-page').addClass('list-view') : $('.js-page').removeClass('list-view');
	}
	
	toggleLogout() {
		$('.js-exit-items').toggleClass('active');
	}
	
	alphabeticSort(e) {
		if (this.props.alphaSorting === '' || this.props.alphaSorting === 'descending') {
			this.props.setAlphaSorting('ascending');
		} else {
			this.props.setAlphaSorting('descending');
		}
	}
	
	render() {			
		let noSortingStyle = { display: (this.props.alphaSorting === '') ? 'inline-block' : 'none' };
		let sortAscendingStyle = { display: (this.props.alphaSorting === 'ascending') ? 'inline-block' : 'none' };
		let sortDescendingStyle = { display: (this.props.alphaSorting === 'descending') ? 'inline-block' : 'none' };
		
		return (
            <section className="top-nav js-top-nav">
				<div className="top-nav-bar">
					<div className="top-nav-item nav-icon js-nav-icon" onClick={() => {this.toggleNav(event) }}>
						<span></span>
						<span></span>
						<span></span>
						<span></span>
					</div>
					<Link to="/favourites" className="top-nav-item" onClick={() => {this.closeNav(); this.closeSearch() }}><Icon glyph={Star} className="icon star" /></Link>
					<Link to="/inbox" className="top-nav-item" onClick={() => {this.closeNav(); this.closeSearch() }}><Icon glyph={Mail} className="icon mail" /></Link>
					<button className="top-nav-item" onClick={() => {this.toggleSearch() }}>{this.state.searching ? <Icon glyph={Close} className="icon close-search" /> : <Icon glyph={Search} className="icon search" />}</button>
					
					<h1 className="logo">Hypatia</h1>
					
					<div className="user-info">
						<Icon glyph={Chat} className="icon chat" />
						<Icon glyph={Avatar} className="icon avatar" />
					</div>
					
					<div className="card-controls js-card-controls">
						{/*<div className="top-nav-item sort-item from-sort">from<Icon glyph={SortPassive} className="icon sort-passive" /></div>*/}
						<div className="top-nav-item sort-item alphabetical-sort js-alphabetical-sort" onClick={this.alphabeticSort.bind(this)}>AZ
							<Icon glyph={SortPassive} className="icon sort-passive" style={noSortingStyle} />
							<Icon glyph={SortActiveUp} className="icon sort-ascending" style={sortAscendingStyle} />
							<Icon glyph={SortActiveDown} className="icon sort-descending" style={sortDescendingStyle} />
						</div>
						{/*<div className="top-nav-item sort-item date-sort">date<Icon glyph={SortActiveDown} className="icon sort-active-down" /></div>*/}
						{/*<div className="top-nav-item sort-item read-sort">read<Icon glyph={SortActiveDown} className="icon sort-active-down" /></div>*/}
						<span className="top-nav-item sort-item view-as">view as:</span>
						<span className="toggle-switch">
							<input type="checkbox" id="mode" name="mode" value="cards" onClick={(e) => {this.toggleView(e) }} />
							<label className="radio" htmlFor="mode"></label>								
						</span>
					</div>
				</div>
				<Navigation {...this.props} toggleNav={this.toggleNav} openNav={this.openNav} closeNav={this.closeNav} toggleSearch={this.toggleSearch} openSearch={this.openSearch} closeSearch={this.closeSearch} searching={this.state.searching} navigating={this.state.navigating} toggleLogout={this.toggleLogout} />
				<div className="overlay js-overlay" onClick={() => {this.closeNav(); this.closeSearch() }}></div>
            </section>
		)
	}
}

const mapStateToProps = ({ mainReducer: { alphaSorting } }) => ({ alphaSorting });

const mapDispatchToProps = {
	setAlphaSorting
};

export default connect(mapStateToProps, mapDispatchToProps)(TopNav);