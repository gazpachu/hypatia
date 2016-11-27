import React, { Component, PropTypes } from 'react';
import { setLoading, setFilters } from '../../actions/actions';
import {connect} from 'react-redux';
import { Link } from 'react-router';
import { firebase, helpers } from 'redux-react-firebase';
import { database, storage } from '../../helpers/firebase';
import $ from 'jquery';
import moment from 'moment';
import showdown from 'showdown';
import Icon from '../common/lib/icon/icon';

class Settings extends Component {
    
	constructor(props) {
		super(props);
	}
	
	componentDidMount() {
		this.props.setLoading(false);  // Move this to API callback when implemented (if ever)
		$('.js-main').removeClass().addClass('main js-main account-settings-page');
	}
	
	render() {
		return (
            <section className="account-settings page">
				<div className="account-details column">
					<input type="text" name="username" placeholder="Username" />
					<input type="password" name="password" placeholder="New password" />
					<input type="password" name="password2" placeholder="Repeat password" />
					<input type="email" name="email" placeholder="Email" />
					<input type="text" name="language" placeholder="Language" />
				</div>
          		<div className="personal-details column">
					
				</div>
           		<ul className="sidebar">
					<li className="sidebar-item"><Link to="/account">Account</Link></li>
					<li className="sidebar-item"><Link to="/account/settings">Settings</Link></li>
					<li className="sidebar-item"><Link to="/account/notifications">Notifications</Link></li>
					<li className="sidebar-item"><Link to="/account/record">Record</Link></li>
					<li className="sidebar-item"><Link to="/#">Proceedings</Link></li>
					<li className="sidebar-item"><Link to="/#">Exams</Link></li>
					<li className="sidebar-item"><Link to="/#">Enrollment</Link></li>
				</ul>
            </section>
		)
	}
}

const mapDispatchToProps = {
	setLoading
}

const mapStateToProps = ({ mainReducer: { isDesktop } }) => ({ isDesktop });

export default connect(mapStateToProps, mapDispatchToProps)(Settings);