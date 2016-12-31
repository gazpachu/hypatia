import React, { Component, PropTypes } from 'react';
import { history } from '../../store';
import { setLoading, setUser, setNotification, setUserInfo } from '../../actions/actions';
import * as CONSTANTS from '../../constants/constants';
import {connect} from 'react-redux';
import md5 from 'md5';
import $ from 'jquery';
import firebase from 'firebase';

import Icon from '../common/lib/icon/icon';
import Avatar from '../../../../static/svg/avatar.svg';

const defaultProps = {

};

const propTypes = {
	isDesktop: PropTypes.bool,
	user: PropTypes.object.isRequired,
	userInfo: PropTypes.object.isRequired
};

class Settings extends Component {
    
	constructor(props) {
		super(props);
		
		this.state = {
			email: '',
			password: '',
			password2: '',
			firstName: '',
			lastName1: '',
			lastName2: '',
			displayName: '',
			photoURL: '',
			address: '',
			address2: '',
			postcode: '',
			city: '',
			province: '',
			country: '',
			language: ''
		}
		
		this.handleChange = this.handleChange.bind(this);
	}
	
	componentDidMount() {
		this.props.setLoading(false);  // Move this to API callback when implemented (if ever)
		$('.js-main').removeClass().addClass('main js-main account-settings-page');
	
		this.unlisten = history.listen( location => {
			if (location.pathname === '/account') {
				this.fetchInfo();
			}
		});
	}
	
	componentWillUnmount() {
		this.unlisten();
	}
	
	componentWillReceiveProps(newProps) {
		this.fetchInfo(newProps);
	}
	
	fetchInfo(newProps) {
		newProps = newProps || this.props;
		if (newProps.user) {
			firebase.database().ref('/users/' + newProps.user.uid).once('value').then(function(snapshot) {
				if (snapshot.val()) this.setState({
					email: newProps.user.email,
					firstName: snapshot.val().info.firstName,
					lastName1: snapshot.val().info.lastName1,
					lastName2: snapshot.val().info.lastName2,
					displayName: snapshot.val().info.displayName,
					photoURL: snapshot.val().info.photoURL,
					address: snapshot.val().info.address,
					address2: snapshot.val().info.address2,
					postcode: snapshot.val().info.postcode,
					city: snapshot.val().info.city,
					province: snapshot.val().info.province,
					country: snapshot.val().info.country,
					language: snapshot.val().info.language
				});
			}.bind(this));
		}
	}
	
	updatePassword() {
		if (this.refs.password.value === this.refs.password2.value) {
			if (this.refs.password.value.length >= 6) {
				if (this.props.user.email !== CONSTANTS.DEMO_EMAIL) {
					$('.js-btn-password').hide();
					$('.js-password-loader').show();

					this.props.user.updatePassword(this.refs.password.value).then(function() {
						$('.js-btn-password').show();
						$('.js-password-loader').hide();
						this.props.setNotification({message: CONSTANTS.PASSWORD_CHANGED, type: 'success'});
					}.bind(this), function(error) {
						$('.js-btn-password').show();
						$('.js-password-loader').hide();
						this.props.setNotification({message: String(error), type: 'error'});
					}.bind(this));
				}
			}
			else {
				this.props.setNotification({message: CONSTANTS.PASSWORD_MIN_LENGTH_ERROR, type: 'error'});
			}
		}
		else {
			this.props.setNotification({message: CONSTANTS.PASSWORD_MATCH_ERROR, type: 'error'});
		}
	}
	
	updateUserInfo(user) {
		if (this.props.user.email !== CONSTANTS.DEMO_EMAIL) {
			if (this.state.displayName === '' || this.state.firstName === '' || this.state.lastName1 === '') {
				this.props.setNotification({message: CONSTANTS.USER_INFO_EMPTY, type: 'error'});
				return;
			}
			
			$('.js-btn-info').hide();
			$('.js-info-loader').show();

			firebase.database().ref(`users/${this.props.user.uid}/info`).set({
				firstName: this.state.firstName,
				lastName1: this.state.lastName1,
				lastName2: this.state.lastName2 || '',
				displayName: this.state.displayName,
				email: this.state.email,
				photoURL: 'https://www.gravatar.com/avatar/' + md5(this.props.user.email) + '.jpg?s=150',
				address: this.state.address || '',
				address2: this.state.address2 || '',
				postcode: this.state.postcode || '',
				city: this.state.city || '',
				province: this.state.province || '',
				country: this.state.country || '',
				language: this.state.language || ''
			})
			.then(function(response) {
				$('.js-btn-info').show();
				$('.js-info-loader').hide();
				this.props.setNotification({message: CONSTANTS.USER_INFO_CHANGED, type: 'success'});
				
				if (this.props.user.email !== this.state.email) {
					this.props.user.updateEmail(this.state.email).then(function() {
						this.props.user.sendEmailVerification();
						firebase.auth().signOut();
						this.props.setUser(null);
					}.bind(this), function(error) {
						$('.js-btn-email').show();
						$('.js-email-loader').hide();
						this.props.setNotification({message: String(error), type: 'error'});
					}.bind(this));
				}
			}.bind(this), function(error) {
				$('.js-btn-info').show();
				$('.js-info-loader').hide();
				this.props.setNotification({message: String(error), type: 'error'});
			}.bind(this));
		}
	}
	
	handleChange(event) {
		this.setState({ [event.target.name]: event.target.value });
    }
	
	render() {
		return (
            <section className="account account-settings page">
            	<div className="page-wrapper">
            		<div className="columns">
					{(this.props.user && this.props.userInfo) ?
						<div className="account-details column">
							<div className="profile-image">
								{(this.props.user.email) ? <img className="photo" src={`https://www.gravatar.com/avatar/${md5(this.props.user.email)}.jpg?s=150`} /> : <Icon glyph={Avatar} className="icon avatar" />}
							</div>
							<a className="update-photo" href="https://www.gravatar.com/" target="_blank">Update photo</a>
							<input type="text" name="displayName" className="display-name" placeholder="Display name" value={this.state.displayName} onChange={this.handleChange} />
							<input type="email" name="email" ref="email" placeholder="Email" value={this.state.email} onChange={this.handleChange} />
							
							<input type="password" ref="password" name="password" className="password" placeholder="New password" value={this.state.password} onChange={this.handleChange} />
							<input type="password" ref="password2" name="password2" placeholder="Repeat password" value={this.state.password2} onChange={this.handleChange} />
							<button className="btn btn-primary btn-xs js-btn-password" onClick={() => this.updatePassword()}>Update password</button>
							<div className="loader-small js-password-loader"></div>
						</div>
					: ''}
					{(this.props.userInfo) ?
						<div className="personal-details column">
							<input type="text" placeholder="First names" name="firstName" value={this.state.firstName} onChange={this.handleChange} />
							<input type="text" placeholder="Last name" name="lastName1" value={this.state.lastName1} onChange={this.handleChange} />
							<input type="text" placeholder="2nd last name (optional)" name="lastName2" value={this.state.lastName2} onChange={this.handleChange} />
							<input type="text" placeholder="Address" name="address" value={this.state.address} onChange={this.handleChange} />
							<input type="text" placeholder="Address continuation" name="address2" value={this.state.address2} onChange={this.handleChange} />
							<input type="text" placeholder="Post code" name="postcode" value={this.state.postcode} onChange={this.handleChange} />
							<input type="text" placeholder="City" name="city" value={this.state.city} onChange={this.handleChange} />
							<input type="text" placeholder="State/Province" name="province" value={this.state.province} onChange={this.handleChange} />
							<input type="text" placeholder="country" name="country" value={this.state.country} onChange={this.handleChange} />
							<input type="text" placeholder="Language" name="language" value={this.state.language} onChange={this.handleChange} />

							<button className="btn btn-primary btn-xs js-btn-info" onClick={() => this.updateUserInfo()}>Update details</button>
							<div className="loader-small js-info-loader"></div>
						</div>
					: ''}
					</div>
				</div>
            </section>
		)
	}
}

const mapDispatchToProps = {
	setLoading,
	setNotification,
	setUser,
	setUserInfo
}

const mapStateToProps = ({ mainReducer: { isDesktop, user, userInfo } }) => ({ isDesktop, user, userInfo });

export default connect(mapStateToProps, mapDispatchToProps)(Settings);