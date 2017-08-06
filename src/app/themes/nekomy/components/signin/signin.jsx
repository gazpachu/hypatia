import React, { Component } from 'react';
import { connect } from 'react-redux';
import $ from 'jquery';
import firebase from 'firebase';
import { setNotification } from '../../../../core/actions/actions';

class Signup extends Component {

  constructor(props) {
    super(props);

    this.handleSignin = this.handleSignin.bind(this);
  }

  handleSignin(e) {
    e.preventDefault();
    $('.js-btn-signin').hide();
    $('.js-signin-loader').show();

    const email = String(this.refs.email.value);
    const { password } = this.refs;

    firebase.auth().signInWithEmailAndPassword(email, password.value).then(() => {
      $('.js-btn-signin').show();
      $('.js-signin-loader').hide();
      $('.js-overlay').click();
    }).catch((error) => {
      $('.js-btn-signin').show();
      $('.js-signin-loader').hide();
      this.props.setNotification({ message: String(error), type: 'error' });
    });
  }

  render() {
    return (
      <form className="user-form sign-in" onSubmit={this.handleSignin}>
        <input type="text" className="input-field" ref="email" placeholder="Email" />
        <input type="password" className="input-field" placeholder="Password" ref="password" />
        <button type="submit" className="btn btn-primary js-btn-signin">Sign in</button>
        <div className="loader-small js-signin-loader" />
      </form>
    );
  }
}

const mapStateToProps = null;

const mapDispatchToProps = {
  setNotification
};

export default connect(mapStateToProps, mapDispatchToProps)(Signup);
