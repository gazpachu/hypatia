import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { firebase, helpers } from 'redux-react-firebase';

const {isLoaded, isEmpty, dataToJS, pathToJS} = helpers;

@firebase()
@connect(
  	({firebase}) => ({
    	authError: pathToJS(firebase, 'authError'),
  	})
)
class Signup extends Component {
  	render(){
    	const {firebase, authError} = this.props;

    	const handleSignup = () => {
      		const {email, password, name} = this.refs;

      		const credentials = {
        		email: email.value,
        		password: password.value
			}


			firebase.createUser(credentials, {info: { name: name.value }}).then(function() {
				var user = firebase.auth().currentUser;
				console.log(user);
				user.sendEmailVerification();
			}.bind(this)).catch(function(error) {
				console.log(error);
			}.bind(this))
    	}

    	const error = (authError) ? authError.toString() : '';

    	return(
      		<div>
        		<input type='email' placeholder='Email' ref='email' /><br/>
        		<input type='password' placeholder='Password' ref='password' /><br/>
        		<input type='text' placeholder='Name' ref='name' />
        		<p>{error}</p>
        		<button onClick={handleSignup}>Signup</button>
      		</div>
    	)
  	}
}

export default Signup;