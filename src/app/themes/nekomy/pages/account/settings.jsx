import React, { Component } from 'react';
import { connect } from 'react-redux';
import md5 from 'md5';
import $ from 'jquery';
import { firebase, helpers } from 'redux-react-firebase';
import { setLoading, setUser, setNotification, setUserData } from '../../../../core/actions/actions';
import * as CONSTANTS from '../../../../core/constants/constants';
import Icon from '../../../../core/common/lib/icon/icon';
import Avatar from '../../../../../../static/svg/avatar.svg';

const { isEmpty, isLoaded } = helpers;

@firebase()
class Settings extends Component {

  constructor(props) {
    super(props);

    this.state = {
      info: {}
    };

    this.handleChange = this.handleChange.bind(this);
  }

  componentWillMount() {
    this.props.setLoading(false);
    $('.js-main').removeClass().addClass('main js-main account-settings-page');

    if (isEmpty(this.state.info) && isLoaded(this.props.userData)) {
      this.setState({ info: this.props.userData.info });
    }
  }

  componentWillReceiveProps(newProps) {
    if (newProps.userData && (newProps.userData !== this.props.userData) && isEmpty(this.state.info)) {
      this.setState({ info: newProps.userData.info });
    }
  }

  updatePassword() {
    if (this.refs.password.value === this.refs.password2.value) {
      if (this.refs.password.value.length >= 6) {
        if (this.props.user.email !== CONSTANTS.DEMO_EMAIL) {
          $('.js-btn-password').hide();
          $('.js-password-loader').show();

          this.props.user.updatePassword(this.refs.password.value).then(() => {
            $('.js-btn-password').show();
            $('.js-password-loader').hide();
            this.props.setNotification({ message: CONSTANTS.PASSWORD_CHANGED, type: 'success' });
          }, (error) => {
            $('.js-btn-password').show();
            $('.js-password-loader').hide();
            this.props.setNotification({ message: String(error), type: 'error' });
          });
        }
      } else {
        this.props.setNotification({ message: CONSTANTS.PASSWORD_MIN_LENGTH_ERROR, type: 'error' });
      }
    } else {
      this.props.setNotification({ message: CONSTANTS.PASSWORD_MATCH_ERROR, type: 'error' });
    }
  }

  updateUserInfo() {
    if (this.props.user.email !== CONSTANTS.DEMO_EMAIL) {
      if (this.state.info.displayName === '' || this.state.info.firstName === '' || this.state.info.lastName1 === '') {
        this.props.setNotification({ message: CONSTANTS.USER_INFO_EMPTY, type: 'error' });
        return;
      }

      $('.js-btn-info').hide();
      $('.js-info-loader').show();

      this.props.firebase.set(`users/${this.props.user.uid}/info`, this.state.info).then(() => {
        $('.js-btn-info').show();
        $('.js-info-loader').hide();
        this.props.setNotification({ message: CONSTANTS.USER_INFO_CHANGED, type: 'success' });

        if (this.props.user.email !== this.state.info.email) {
          this.props.user.updateEmail(this.state.info.email).then(() => {
            this.props.user.sendEmailVerification();
            this.props.firebase.logout();
            this.props.setUser(null);
          }, (error) => {
            $('.js-btn-email').show();
            $('.js-email-loader').hide();
            this.props.setNotification({ message: String(error), type: 'error' });
          });
        }
      }, (error) => {
        $('.js-btn-info').show();
        $('.js-info-loader').hide();
        this.props.setNotification({ message: String(error), type: 'error' });
      });
    }
  }

  handleChange(event) {
    const newInfo = Object.assign({}, this.state.info, {
      [event.target.name]: event.target.value
    });
    this.setState({ info: newInfo });
  }

  render() {
    return (
      <section className="account account-settings page">
        {(this.props.user && this.props.userData && this.state.info)
          ? <div className="page-wrapper">
            <div className="columns">
              <div className="account-details column">
                <div className="profile-image">
                  {(this.props.user.email)
                    ? <img alt="" className="photo" role="presentation" src={`https://www.gravatar.com/avatar/${md5(this.props.user.email)}.jpg?s=150`} />
                    : <Icon glyph={Avatar} className="icon avatar" />}
                </div>
                <a className="update-photo" href="https://www.gravatar.com/" rel="noopener noreferrer" target="_blank">Update photo</a>
                <input type="text" name="displayName" className="display-name" placeholder="Display name" value={this.state.info.displayName} onChange={this.handleChange} />
                <input type="email" name="email" ref="email" placeholder="Email" value={this.state.info.email} onChange={this.handleChange} />

                <input type="password" ref="password" name="password" className="password" placeholder="New password" value={this.state.password} />
                <input type="password" ref="password2" name="password2" placeholder="Repeat password" value={this.state.password2} />
                <button className="btn btn-primary btn-xs js-btn-password float-right" onClick={() => this.updatePassword()}>Update password</button>
                <div className="loader-small float-right js-password-loader" />
              </div>
              <div className="personal-details column">
                <input type="text" placeholder="First names" name="firstName" value={this.state.info.firstName} onChange={this.handleChange} />
                <input type="text" placeholder="Last name" name="lastName1" value={this.state.info.lastName1} onChange={this.handleChange} />
                <input type="text" placeholder="2nd last name (optional)" name="lastName2" value={this.state.info.lastName2} onChange={this.handleChange} />
                <input type="text" placeholder="Address" name="address" value={this.state.info.address} onChange={this.handleChange} />
                <input type="text" placeholder="Address continuation" name="address2" value={this.state.info.address2} onChange={this.handleChange} />
                <input type="text" placeholder="Post code" name="postcode" value={this.state.info.postcode} onChange={this.handleChange} />
                <input type="text" placeholder="City" name="city" value={this.state.info.city} onChange={this.handleChange} />
                <input type="text" placeholder="State/Province" name="province" value={this.state.info.province} onChange={this.handleChange} />
                <input type="text" placeholder="country" name="country" value={this.state.info.country} onChange={this.handleChange} />
                <input type="text" placeholder="Language" name="language" value={this.state.info.language} onChange={this.handleChange} />

                <button className="btn btn-primary btn-xs js-btn-info float-right" onClick={() => this.updateUserInfo()}>Update details</button>
                <div className="loader-small float-right js-info-loader" />
              </div>
              <div className="other-details column" />
            </div>
          </div>
          : <div className="loader-small" />}
      </section>
    );
  }
}

const mapDispatchToProps = {
  setLoading,
  setNotification,
  setUser,
  setUserData
};

const mapStateToProps = ({
  mainReducer: {
    user,
    userData
  }
}) => ({ user, userData });

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
