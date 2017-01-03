import React, { Component, PropTypes } from 'react';
import { setLoading  } from '../../actions/actions';
import {connect} from 'react-redux';
import { firebase, helpers } from 'redux-react-firebase';
import { Link } from 'react-router';
import $ from 'jquery';
import moment from 'moment';
import Icon from '../common/lib/icon/icon';

const {isLoaded, isEmpty, dataToJS} = helpers;

@connect(
  	(state, props) => ({
		subjects: dataToJS(state.firebase, 'subjects'),
    	userID: state.mainReducer.user ? state.mainReducer.user.uid : '',
		userData: dataToJS(state.firebase, `users/${state.mainReducer.user ? state.mainReducer.user.uid : ''}`),
  	})
)
@firebase(
  	props => ([
		'subjects',
    	`users/${props.userID}`
  	])
)
class Dashboard extends Component {
    
	constructor(props) {
		super(props);
	}
	
	componentDidMount() {
		this.props.setLoading(false);
		$('.js-main').removeClass().addClass('main js-main dashboard-page');
	}
	
	render() {
		let subjects = null;
		
		if (isLoaded(this.props.userData) && !isEmpty(this.props.userData) && isLoaded(this.props.subjects) && !isEmpty(this.props.subjects)) {
			subjects = Object.keys(this.props.userData.courses).map(function(key) {
				let course = this.props.userData.courses[key];
				return Object.keys(course).map(function(subject) {
					return <li>{this.props.subjects[subject].title}</li>;
				}.bind(this));
			}.bind(this));
		}
		
		return (
            <section className="dashboard page">
				{(this.props.user && this.props.userData) ? <div className="page-wrapper">
          			<div className="columns">
          				<div className="column">
							<ul>
								{subjects}
							</ul>
						</div>
          			</div>
           		</div> : <div className="loader-small"></div>}
            </section>
		)
	}
}

const mapDispatchToProps = {
	setLoading
}

const mapStateToProps = ({ mainReducer: { isDesktop } }) => ({ isDesktop });

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);