import React, { Component, PropTypes } from 'react';
import { history } from '../../store';
import { setLoading, setNotification, setUserInfo } from '../../actions/actions';
import { DEMO_EMAIL, EMAIL_CHANGED, DISPLAY_NAME_CHANGED, PASSWORD_CHANGED, PASSWORD_MIN_LENGTH_ERROR, PASSWORD_MATCH_ERROR, USER_INFO_CHANGED } from '../../constants/constants';
import {connect} from 'react-redux';
import { firebaseAuth, database } from '../../helpers/firebase';
import md5 from 'md5';
import $ from 'jquery';
import Sidebar from './sidebar';

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
			userInfo: {
				firstName: '',
				lastName1: '',
				lastName2: '',
				address: '',
				address2: '',
				postcode: '',
				city: '',
				province: '',
				country: '',
				language: ''
			}
		}
	}
	
	componentDidMount() {
		this.props.setLoading(false);  // Move this to API callback when implemented (if ever)
		$('.js-main').removeClass().addClass('main js-main account-settings-page');
	
		this.unlisten = history.listen( location => {
			if (location.pathname === '/account/settings') {
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
			database.child('/users/' + newProps.user.uid).once('value').then(function(snapshot) {
				this.setState({ userInfo: snapshot.val().info });
			}.bind(this));
		}
	}
	
	updateDisplayName() {
		if (this.props.user.email !== DEMO_EMAIL) {
			$('.js-btn-display-name').hide();
			$('.js-display-name-loader').show();

			this.props.user.updateProfile({
				displayName: this.refs['display-name'].value,
				photoURL: 'http://www.gravatar.com/avatar/' + md5(this.props.user.email) + '.jpg?s=150'
			}).then(function(response) {
				$('.js-btn-display-name').show();
				$('.js-display-name-loader').hide();
				this.props.setNotification({message: DISPLAY_NAME_CHANGED, type: 'success'});
			}.bind(this), function(error) {
				$('.js-btn-display-name').show();
				$('.js-display-name-loader').hide();
				this.props.setNotification({message: String(error), type: 'error'});
			}.bind(this));
		}
	}
	
	updatePassword() {
		if (this.refs.password.value === this.refs.password2.value) {
			if (this.refs.password.value.length >= 6) {
				if (this.props.user.email !== DEMO_EMAIL) {
					$('.js-btn-password').hide();
					$('.js-password-loader').show();

					this.props.user.updatePassword(this.refs.password.value).then(function() {
						$('.js-btn-password').show();
						$('.js-password-loader').hide();
						this.props.setNotification({message: PASSWORD_CHANGED, type: 'success'});
					}.bind(this), function(error) {
						$('.js-btn-password').show();
						$('.js-password-loader').hide();
						this.props.setNotification({message: String(error), type: 'error'});
					}.bind(this));
				}
			}
			else {
				this.props.setNotification({message: PASSWORD_MIN_LENGTH_ERROR, type: 'error'});
			}
		}
		else {
			this.props.setNotification({message: PASSWORD_MATCH_ERROR, type: 'error'});
		}
	}
	
	updateEmail() {
		if (this.props.user.email !== DEMO_EMAIL) {
			$('.js-btn-email').hide();
			$('.js-email-loader').show();

			this.props.user.updateEmail(this.refs.email.value).then(function() {
				$('.js-btn-email').show();
				$('.js-email-loader').hide();
				this.props.setNotification({message: EMAIL_CHANGED, type: 'success'});
				this.props.user.sendEmailVerification();
			}.bind(this), function(error) {
				$('.js-btn-email').show();
				$('.js-email-loader').hide();
				this.props.setNotification({message: String(error), type: 'error'});
			}.bind(this));
		}
	}
	
	updateUserInfo(user) {
		if (this.props.user.email !== DEMO_EMAIL) {
			$('.js-btn-info').hide();
			$('.js-info-loader').show();

			database.child(`users/${this.props.user.uid}/info`).set({
				firstName: this.state.userInfo.firstName,
				lastName1: this.state.userInfo.lastName1,
				lastName2: this.state.userInfo.lastName2,
				address: this.state.userInfo.address,
				address2: this.state.userInfo.address2,
				postcode: this.state.userInfo.postcode,
				city: this.state.userInfo.city,
				province: this.state.userInfo.province,
				country: this.state.userInfo.country,
				language: this.state.userInfo.language
			})
			.then(function(response) {
				$('.js-btn-info').show();
				$('.js-info-loader').hide();
				this.props.setNotification({message: USER_INFO_CHANGED, type: 'success'});
			}.bind(this), function(error) {
				$('.js-btn-info').show();
				$('.js-info-loader').hide();
				this.props.setNotification({message: String(error), type: 'error'});
			}.bind(this));
		}
	}
	
	handleChange(event, field) {
		let newInfo = this.state.userInfo;
		newInfo[field] = event.target.value;
		this.setState({ userInfo: newInfo });
    }
	
	render() {
		return (
            <section className="account account-settings page">
            	{(this.props.user) ?
					<div className="account-details column">
						<div className="profile-image">
							{(this.props.user.email) ? <img className="photo" src={`http://www.gravatar.com/avatar/${md5(this.props.user.email)}.jpg?s=150`} /> : <Icon glyph={Avatar} className="icon avatar" />}
						</div>
						<a className="update-photo" href="http://www.gravatar.com/" target="_blank">Update photo</a>
						<input type="text" ref="display-name" placeholder="Display name" defaultValue={this.props.user.displayName} />
						<button className="btn btn-primary btn-xs js-btn-display-name" onClick={() => this.updateDisplayName()}>Update display name</button>
						<div className="loader-small js-display-name-loader"></div>
						<input type="password" ref="password" className="password" placeholder="New password" />
						<input type="password" ref="password2" placeholder="Repeat password" />
						<button className="btn btn-primary btn-xs js-btn-password" onClick={() => this.updatePassword()}>Update password</button>
						<div className="loader-small js-password-loader"></div>
						<input type="email" ref="email" placeholder="Email" defaultValue={this.props.user.email} />
						<button className="btn btn-primary btn-xs js-btn-email" onClick={() => this.updateEmail()}>Update email</button>
						<div className="loader-small js-email-loader"></div>
					</div>
				: ''}
				{(this.props.userInfo) ?
					<div className="personal-details column">
						<input type="text" placeholder="First names" value={this.state.userInfo.firstName} onChange={(event) => this.handleChange(event, 'firstName')} />
						<input type="text" placeholder="Last name" value={this.state.userInfo.lastName1} onChange={(event) => this.handleChange(event, 'lastName1')} />
						<input type="text" placeholder="2nd last name (optional)" value={this.state.userInfo.lastName2} onChange={(event) => this.handleChange(event, 'lastName2')} />
						<input type="text" placeholder="Address" value={this.state.userInfo.address} onChange={(event) => this.handleChange(event, 'address')} />
						<input type="text" placeholder="Address continuation" value={this.state.userInfo.address2} onChange={(event) => this.handleChange(event, 'address2')} />
						<input type="text" placeholder="Post code" value={this.state.userInfo.postcode} onChange={(event) => this.handleChange(event, 'postcode')} />
						<input type="text" placeholder="City" value={this.state.userInfo.city} onChange={(event) => this.handleChange(event, 'city')} />
						<input type="text" placeholder="State/Province" value={this.state.userInfo.province} onChange={(event) => this.handleChange(event, 'province')} />
						<input type="text" placeholder="country" value={this.state.userInfo.country} onChange={(event) => this.handleChange(event, 'country')} />
						<input type="text" placeholder="Language" value={this.state.userInfo.language} onChange={(event) => this.handleChange(event, 'language')} />
						<button className="btn btn-primary btn-xs js-btn-info" onClick={() => this.updateUserInfo()}>Update details</button>
						<div className="loader-small js-info-loader"></div>
					</div>
				: ''}
           		<Sidebar active="settings" />
            </section>
		)
	}
}

const mapDispatchToProps = {
	setLoading,
	setNotification,
	setUserInfo
}

const mapStateToProps = ({ mainReducer: { isDesktop, user, userInfo } }) => ({ isDesktop, user, userInfo });

export default connect(mapStateToProps, mapDispatchToProps)(Settings);