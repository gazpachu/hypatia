import React, { Component, PropTypes } from 'react';
import { history } from '../../../store';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import $ from 'jquery';
import Navigation from '../navigation/navigation';
import { setUser } from '../../../actions/actions';
import { auth, login, logout } from '../../../helpers/auth';

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
		});	
	}
	
	componentDidUpdate() {
		if (this.props.isDesktop === true) {
			$('#mode').prop('checked', false);
			$('.js-page').removeClass('list-view');
		} else if (this.props.isDesktop === false) {
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
			$('.js-dropdown-panel').removeClass('open');
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
			$('.js-dropdown-panel').removeClass('open');
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
	
	handleSignup = (e) => {
		e.preventDefault()
    	auth(this.email.value, this.pw.value)
	}
	
	handleSignin = (e) => {
		e.preventDefault()
    	console.log(login(this.email.value, this.pw.value));
	}
	
	render() {			
		let noSortingStyle = { display: (this.props.alphaSorting === '') ? 'inline-block' : 'none' };
		let sortAscendingStyle = { display: (this.props.alphaSorting === 'ascending') ? 'inline-block' : 'none' };
		let sortDescendingStyle = { display: (this.props.alphaSorting === 'descending') ? 'inline-block' : 'none' };
		
		return (
            <section className="top-nav js-top-nav">
				<div className="top-nav-bar">
					<div className="top-nav-item nav-icon js-nav-icon" onClick={() => {this.toggleNav() }}>
						<span></span>
						<span></span>
						<span></span>
						<span></span>
					</div>
					<Link to="/favourites" className="top-nav-item" onClick={() => {this.closeNav(); this.closeSearch() }}><Icon glyph={Star} className="icon star" /></Link>
					<Link to="/inbox" className="top-nav-item" onClick={() => {this.closeNav(); this.closeSearch() }}><Icon glyph={Mail} className="icon mail" /></Link>
					<button className="top-nav-item" onClick={() => {this.toggleSearch() }}>{this.state.searching ? <Icon glyph={Close} className="icon close-search" /> : <Icon glyph={Search} className="icon search" />}</button>
					
					<Icon glyph={Logo} className="icon logo" />
					
					{(!this.props.user) ? 
						<div className="user-form">
							<form className="sign-up" onSubmit={this.handleSignup}>
								<input type="text" className="form-control" ref={(email) => this.email = email} placeholder="Email" />
								<input type="password" className="form-control" placeholder="Password" ref={(pw) => this.pw = pw} />
								<button type="submit" className="btn btn-primary">Sign up</button>
							</form>
							<form className="sign-in" onSubmit={this.handleSignin}>
								<input type="text" className="form-control" ref={(email) => this.email = email} placeholder="Email" />
								<input type="password" className="form-control" placeholder="Password" ref={(pw) => this.pw = pw} />
								<button type="submit" className="btn btn-primary">Sign in</button>
							</form>
						</div>:
						<div className="user-form">
							<div>{this.props.user.email}</div>
							<button onClick={() => {
								logout();
								this.props.setUser(null);
								history.push('/');
							}}>Sign out</button>
						</div>
					}
				</div>
				<Navigation location={this.props.location} toggleNav={this.toggleNav} openNav={this.openNav} closeNav={this.closeNav} toggleSearch={this.toggleSearch} openSearch={this.openSearch} closeSearch={this.closeSearch} searching={this.state.searching} navigating={this.state.navigating} toggleLogout={this.toggleLogout} />
				<div className="overlay js-overlay" onClick={() => {this.closeNav(); this.closeSearch() }}></div>
            </section>
		)
	}
}

const mapStateToProps = ({ mainReducer: { user } }) => ({ user });

const mapDispatchToProps = {
	setUser
};

export default connect(mapStateToProps, mapDispatchToProps)(TopNav);