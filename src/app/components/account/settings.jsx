import React, { Component, PropTypes } from 'react';
import { setLoading } from '../../actions/actions';
import {connect} from 'react-redux';
import { firebaseAuth } from '../../helpers/firebase';
import md5 from 'md5';
import $ from 'jquery';
import Sidebar from './sidebar';

import Icon from '../common/lib/icon/icon';
import Avatar from '../../../../static/avatar.svg';

const defaultProps = {

};

const propTypes = {
	isDesktop: PropTypes.bool,
	user: PropTypes.object.isRequired
};

class Settings extends Component {
    
	constructor(props) {
		super(props);
	}
	
	componentDidMount() {
		this.props.setLoading(false);  // Move this to API callback when implemented (if ever)
		$('.js-main').removeClass().addClass('main js-main account-settings-page');
	}
	
	updateSettings() {
		var user = firebaseAuth().currentUser;

		user.updateProfile({
		  	displayName: this.refs['first-name'].value + ' ' + this.refs['last-name1'].value + ' ' + this.refs['last-name2'].value,
		  	photoURL: 'http://www.gravatar.com/avatar/' + md5(this.props.user.email) + '.jpg?s=150'
		}).then(function(response) {
		  	console.log(response);
		}, function(error) {
		  	// An error happened.
		});
	}
	
	render() {
		return (
            <section className="account account-settings page">
            	{(this.props.user) ?
					<div className="account-details column">
						<div className="profile-image">
							{(this.props.user.photoURL) ? <img className="photo" src={this.props.user.photoURL} /> : <Icon glyph={Avatar} className="icon avatar" />}
						</div>
						<input type="text" ref="username" placeholder="Username" />
						<input type="text" ref="display-name" placeholder="Display name" defaultValue={this.props.user.displayName} />
						<input type="password" ref="password" placeholder="New password" />
						<input type="password" ref="password2" placeholder="Repeat password" />
						<input type="email" ref="email" placeholder="Email" defaultValue={this.props.user.email} />
						<input type="text" ref="language" placeholder="Language" />
					</div>
				: ''}
				{(this.props.user) ?
					<div className="personal-details column">
						<input type="text" ref="first-name" placeholder="First names" />
						<input type="text" ref="last-name1" placeholder="Last name" />
						<input type="text" ref="last-name2" placeholder="Last name" />
						<input type="text" ref="address" placeholder="Address" />
						<input type="text" ref="address2" placeholder="Address continuation" />
						<input type="text" ref="postcode" placeholder="Post code" />
						<input type="text" ref="city" placeholder="City" />
						<input type="text" ref="province" placeholder="Province" />
						<input type="text" ref="country" placeholder="country" />
						<button className="btn btn-primary" onClick={() => this.updateSettings()}>Save Changes</button>
					</div>
				: ''}
           		<Sidebar active="settings" />
            </section>
		)
	}
}

const mapDispatchToProps = {
	setLoading
}

const mapStateToProps = ({ mainReducer: { isDesktop, user } }) => ({ isDesktop, user });

export default connect(mapStateToProps, mapDispatchToProps)(Settings);