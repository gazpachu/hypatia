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

class Dashboard extends Component {
    
	constructor(props) {
		super(props);
	}
	
	componentDidMount() {
		this.props.setLoading(false);  // Move this to API callback when implemented (if ever)
		$('.js-main').removeClass().addClass('main js-main dashboard-page');
	}
	
	render() {
		return (
            <section className="dashboard page">
				<div className="coming-up column">
					<h2 className="courses-heading">To-do and coming up</h2>
				</div>
				<div className="latest-messages column">
					<h2 className="new-courses-heading">Latest messages</h2>
					<ul className="courses-list">
						<li className="course-item"><span className="course-title">Multimedia</span>, 4 slots available. Starts in 1 days</li>
						<li className="course-item"><span className="course-title">Journalism</span>, 4 slots available. Starts in 1 days</li>
						<li className="course-item"><span className="course-title">Climate change</span>, 4 slots available. Starts in 1 days</li>
						<li className="course-item"><span className="course-title">Economics</span>, 4 slots available. Starts in 1 days</li>
						<li className="course-item"><span className="course-title">Art History</span>, 4 slots available. Starts in 1 days</li>
						<li className="course-item"><span className="course-title">Multimedia</span>, 4 slots available. Starts in 1 days</li>
						<li className="course-item"><span className="course-title">Multimedia</span>, 4 slots available. Starts in 1 days</li>
					</ul>
				</div>
            </section>
		)
	}
}

const mapDispatchToProps = {
	setLoading
}

const mapStateToProps = ({ mainReducer: { isDesktop } }) => ({ isDesktop });

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);