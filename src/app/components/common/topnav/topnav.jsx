import React, { Component, PropTypes } from 'react';
import { history } from '../../../store';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import $ from 'jquery';
import Navigation from '../navigation/navigation';
import md5 from 'md5';
import { USER_CONFIRM_EMAIL } from '../../../constants/constants';
import { setUser, setPanel, setNotification } from '../../../actions/actions';
import firebase from 'firebase';

import Icon from '../lib/icon/icon';
import Logo from '../../../../../static/svg/logo.svg';
import LogoWording from '../../../../../static/svg/logo-wording.svg';
import Avatar from '../../../../../static/svg/avatar.svg';
import Trophy from '../../../../../static/svg/trophy.svg';
import Calendar from '../../../../../static/svg/calendar.svg';
import Info from '../../../../../static/svg/info.svg';
import Search from '../../../../../static/svg/search.svg';
import Close from '../../../../../static/svg/x.svg';
import SortPassive from '../../../../../static/svg/sort-passive.svg';
import SortActiveUp from '../../../../../static/svg/sort-active-up.svg';
import SortActiveDown from '../../../../../static/svg/sort-active-down.svg';
import Logout from '../../../../../static/svg/logout.svg';
import Chat from '../../../../../static/svg/chat.svg';

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
		this.showForm = this.showForm.bind(this);
		this.closeForm = this.closeForm.bind(this);
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
			$('.js-overlay').show().animateCss('fade-in');
			$('.js-sidenav').addClass('opened').removeClass('closed');
			$('.js-nav-icon').addClass('opened');
			$('.js-dropdown-panel').removeClass('open');
			this.setState({searching: false, navigating: true});
		}
	}
	
	closeNav() {
		if ($('.js-sidenav').hasClass('opened')) {
			$('.js-sidenav').removeClass('opened').addClass('closed');
			$('.js-overlay').animateCss('fade-out', function() {
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
			$('.js-overlay').show().animateCss('fade-in');
			$('.search-input').focus();
			$('.js-dropdown-panel').removeClass('open');
			this.setState({searching: true, navigating: false});
		}
	}
	
	closeSearch() {
		let $searchPanel = $('.js-search-panel');
		if ($searchPanel.hasClass('opened')) {
			$searchPanel.removeClass('opened').addClass('closed');
			$('.js-overlay').animateCss('fade-out', function() {
				$('.js-overlay').hide();
			});
			this.setState({searching: false, navigating: false});
		}
	}
	
	toggleView(e) {
		$(e.currentTarget).is(':checked') ? $('.js-page').addClass('list-view') : $('.js-page').removeClass('list-view');
	}
	
	showForm(event) {
		$('.user-form').removeClass('active');
		$(event.target).next().addClass('active');
		$('.js-overlay').show().animateCss('fade-in');
	}
	
	closeForm() {
		$('.user-form').removeClass('active');
		$('.js-overlay').animateCss('fade-out', function() {
			$('.js-overlay').hide();
		});
	}
	
	handleSignup = (e) => {
		e.preventDefault();
		
		if (this.pwSignup.value === this.pw2.value) {
			$('.js-btn-signup').hide();
			$('.js-signup-loader').show();
			
			const email = String(this.emailSignup.value);
			
			firebase.auth().createUserWithEmailAndPassword(email, this.pwSignup.value).then(function(user) {
				this.saveUser(user, this.firstName.value, this.lastName.value, email);
			}.bind(this)).catch(function(error) {
				$('.js-btn-signup').show();
				$('.js-signup-loader').hide();
				this.props.setNotification({message: String(error), type: 'error'});
			}.bind(this));
		}
		else {
			this.props.setNotification({message: PASSWORD_MATCH_ERROR, type: 'error'});
		}
	}
	
	saveUser(user, firstname, lastname, email) {
		return firebase.database().ref(`users/${user.uid}/info`).set({
      		firstName: firstname,
			lastName1: lastname,
			email: email,
			displayName: firstname + ' ' + lastname
    	}).then(function() {
			user.sendEmailVerification();
			$('.js-btn-signup').show();
			$('.js-signup-loader').hide();
			$('.js-overlay').animateCss('fade-out', function() {
				$('.js-overlay').click();
				$('.js-overlay').hide();
			});
			this.props.setNotification({message: USER_CONFIRM_EMAIL, type: 'success'});
		}.bind(this)).catch(function(error) {
			$('.js-btn-signup').show();
			$('.js-signup-loader').hide();
			this.props.setNotification({message: String(error), type: 'error'});
		}.bind(this))
	}
	
	handleSignin = (e) => {
		e.preventDefault();
		$('.js-btn-signin').hide();
		$('.js-signin-loader').show();
		
		const email = String(this.email.value);
		firebase.auth().signInWithEmailAndPassword(email, this.pw.value).then(function() {
			$('.js-btn-signin').show();
			$('.js-signin-loader').hide();
			$('.js-overlay').animateCss('fade-out', function() {
				$('.js-overlay').hide();
			});
		}.bind(this)).catch(function(error) {
			$('.js-btn-signin').show();
			$('.js-signin-loader').hide();
			this.props.setNotification({message: String(error), type: 'error'});
		}.bind(this));
	}
	
	changePanel(panel) {
		this.closeNav();
		this.closeSearch();
		
		if (this.props.panel === panel) this.props.setPanel('');
		else this.props.setPanel(panel);
	}
	
	render() {			
		return (
            <section className="top-nav js-top-nav">
				<div className="top-nav-bar">
					<div className="top-nav-item nav-icon js-nav-icon" onClick={() => {this.toggleNav() }}>
						<span></span>
						<span></span>
						<span></span>
						<span></span>
					</div>
					<button className="top-nav-item" onClick={() => {this.toggleSearch() }}>{this.state.searching ? <Icon glyph={Close} className="icon close-search" /> : <Icon glyph={Search} className="icon search" />}</button>
					
					{(this.props.user) ? <div className="top-nav-item" onClick={() => {this.changePanel('calendar') }}>{this.props.panel === 'calendar' ? <Icon glyph={Close} /> : <Icon glyph={Calendar} className="icon calendar" />}</div> : ''}
					
					{(this.props.user) ? <div className="top-nav-item" onClick={() => {this.changePanel('grades') }}>{this.props.panel === 'grades' ? <Icon glyph={Close} /> : <Icon glyph={Trophy} className="icon trophy" />}</div> : ''}
					
					{(this.props.user) ? <div className="top-nav-item" onClick={() => {this.changePanel('help') }}>{this.props.panel === 'help' ? <Icon glyph={Close} /> : <Icon glyph={Info} className="icon info" />}</div> : ''}
					
					<Link to="/" className="logo">
						<Icon glyph={Logo} />
						<Icon glyph={LogoWording} className="icon logo-wording" />
					</Link>
					
					{(!this.props.user) ? 
						<div className="user-controls">
							<div className="lang">EN</div>
							<div className="user-controls-cta sign-up-cta">
								<span onClick={this.showForm}>Sign up</span>
								<form className="user-form sign-up" onSubmit={this.handleSignup}>
									<input type="text" className="input-field" ref={(firstName) => this.firstName = firstName} placeholder="First name" />
									<input type="text" className="input-field" ref={(lastName) => this.lastName = lastName} placeholder="Last name" />
									<input type="text" className="input-field" ref={(emailSignup) => this.emailSignup = emailSignup} placeholder="Email" />
									<input type="password" className="input-field" placeholder="Password" ref={(pwSignup) => this.pwSignup = pwSignup} />
									<input type="password" className="input-field" placeholder="Repeat password" ref={(pw2) => this.pw2 = pw2} />
									<button type="submit" className="btn btn-primary js-btn-signup">Sign up</button>
									<div className="loader-small js-signup-loader"></div>
								</form>
							</div>
							<div className="user-controls-cta sign-in-cta">
								<span onClick={this.showForm}>Sign in</span>
								<form className="user-form sign-in" onSubmit={this.handleSignin}>
									<input type="text" className="input-field" ref={(email) => this.email = email} placeholder="Email" />
									<input type="password" className="input-field" placeholder="Password" ref={(pw) => this.pw = pw} />
									<button type="submit" className="btn btn-primary js-btn-signin">Sign in</button>
									<div className="loader-small js-signin-loader"></div>
								</form>
							</div>
						</div>
					:
						<div className="user-controls">
							<div className="lang">EN</div>
							<button className="chat-icon" onClick={() => {this.changePanel('chat') }}>{this.props.panel === 'chat' ? <Icon glyph={Close} className="icon close-chat" /> : <Icon glyph={Chat} className="icon chat" />}</button>
							
							<div className="user-controls-cta account-cta">
								{(this.props.user) ? <Link to="/dashboard">{(this.props.user.email) ? <img className="photo" src={`https://www.gravatar.com/avatar/${md5(this.props.user.email)}.jpg?s=20`} /> : <Icon glyph={Avatar} />} <span>{this.props.userInfo ? this.props.userInfo.displayName : ''}</span></Link> : ''}
								<button onClick={() => { firebase.auth().signOut(); this.props.setUser(null);}}><Icon glyph={Logout} className="icon sign-out" /></button>
							</div>
						</div>
					}
				</div>
				<Navigation location={this.props.location} toggleNav={this.toggleNav} openNav={this.openNav} closeNav={this.closeNav} toggleSearch={this.toggleSearch} openSearch={this.openSearch} closeSearch={this.closeSearch} searching={this.state.searching} navigating={this.state.navigating} />
				<div className="overlay js-overlay" onClick={() => {this.closeNav(); this.closeSearch(); this.closeForm() }}></div>
            </section>
		)
	}
}

const mapStateToProps = ({ mainReducer: { user, panel, userInfo } }) => ({ user, panel, userInfo });

const mapDispatchToProps = {
	setUser,
	setPanel,
	setNotification
};

export default connect(mapStateToProps, mapDispatchToProps)(TopNav);