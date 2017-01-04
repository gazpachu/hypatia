import React, { Component, PropTypes } from 'react';
import { setLoading  } from '../../actions/actions';
import {connect} from 'react-redux';
import { firebase, helpers } from 'redux-react-firebase';
import { Link } from 'react-router';
import $ from 'jquery';
import moment from 'moment';
import Icon from '../common/lib/icon/icon';
import Info from '../../../../static/svg/info.svg';
import Announcement from '../../../../static/svg/announcement.svg';
import Download from '../../../../static/svg/download.svg';
import Upload from '../../../../static/svg/upload.svg';
import Teacher from '../../../../static/svg/professor.svg';
import Chat from '../../../../static/svg/chat.svg';

const defaultProps = {
	colors: ['#2ecc71', '#e8303f', '#122d59', '#448cd3', '#445f8c', '#ffdd00', '#f0ad4e', '#a83fd0']
};

const propTypes = {
	
};

const {isLoaded, isEmpty, dataToJS} = helpers;

@connect(
  	(state, props) => ({
		users: dataToJS(state.firebase, 'users'),
		subjects: dataToJS(state.firebase, 'subjects'),
		activities: dataToJS(state.firebase, 'activities')
  	})
)
@firebase(
  	props => ([
		'subjects',
		'activities',
		'users'
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
		let subjects = null,
			activities = [];
		
		if (isLoaded(this.props.subjects) && !isEmpty(this.props.subjects) && isLoaded(this.props.activities) && !isEmpty(this.props.activities) && isLoaded(this.props.users) && !isEmpty(this.props.users)) {
			subjects = Object.keys(this.props.users[this.props.user.uid].courses).map(function(key) {
				let course = this.props.users[this.props.user.uid].courses[key];
				
				return Object.keys(course).map(function(subject, c) {
					let teachers = '';
					
					if (this.props.subjects[subject].activities) {
						let newActivities = this.props.subjects[subject].activities.map(function(activity) {
							return <li key={activity} className="item" style={{borderLeftColor: this.props.colors[c]}}><Link to={`/activities/${this.props.activities[activity].slug}`}>{this.props.activities[activity].title}</Link>
								<div className="meta">Due in <span className="date">{moment(this.props.activities[activity].endDate).format('D MMMM YYYY')}</span></div>
								<div className="actions">
									<Link to="/dashboard#demo-not-yet-linked"><Icon glyph={Announcement} /></Link>
									<Link to="/dashboard#demo-not-yet-linked"><Icon glyph={Download} /></Link>
									<Link to="/dashboard#demo-not-yet-linked"><Icon glyph={Upload} /></Link>
									<Link to="/dashboard#demo-not-yet-linked"><Icon glyph={Chat} /></Link>
								</div>
							</li>;
						}.bind(this));
						
						activities.push(newActivities);
					}
					
					if (this.props.subjects[subject].teachers) {
						for (let i=0; i<this.props.subjects[subject].teachers.length; i++) {
							let teacher = this.props.users[this.props.subjects[subject].teachers[i]];
							teachers += teacher.info.firstName + ' ' + teacher.info.lastName1;
							if (i < this.props.subjects[subject].teachers.length -1) teachers += ', ';
						}
					}
					
					return <li key={subject} className="item" style={{borderLeftColor: this.props.colors[c]}}><Link to={`/subjects/${this.props.subjects[subject].slug}`}>{this.props.subjects[subject].title}</Link>
						<div className="teachers"><Icon glyph={Teacher} />{teachers}</div>
					</li>;
				}.bind(this));
			}.bind(this));
		}
	
		return (
            <section className="dashboard page">
				{(subjects && activities) ? <div className="page-wrapper">
         			<div className="announcement">
						<Icon glyph={Info} />
						From August 15th 23:00pm until August 16th 8am, the website will be offline due to maintenance works. Apologies for the trouble. (Hardcoded)
					</div>
          			<div className="columns">
          				<div className="column">
							<h1 className="dashboard-title">My subjects</h1>
							<ul className="items-list">
								{subjects}
							</ul>
						</div>
          				<div className="column">
							<h1 className="dashboard-title">My current activities</h1>
							<ul className="items-list">
								{activities}
							</ul>
						</div>
         				<div className="column">
							<h1 className="dashboard-title">My direct messages (Hardcoded)</h1>
							<ul className="items-list">
								<li className="item">
									<div>John Smith</div>
									<div>#maths #test1</div>
									<div>I’ve uploaded the new formulas. Please let me know when you are available to...</div>
								</li>
								<li className="item">
									<div>Martin Lee</div>
									<div>#french #assignment1</div>
									<div>Hi Joan. In the 2nd question, you said ‘trais bien’ but the correct answer is ‘très...</div>
								</li>
								<li className="item">
									<div>Morgan Freeman, John Doe</div>
									<div>#history #assignment2</div>
									<div>Hi Joan and John, the result of your assignment is already published. Well done!</div>
								</li>
							</ul>
						</div>
          			</div>
           		</div> : <div className="loader-small"></div>}
            </section>
		)
	}
}

Dashboard.propTypes = propTypes;
Dashboard.defaultProps = defaultProps;

const mapDispatchToProps = {
	setLoading
}

const mapStateToProps = ({ mainReducer: { isDesktop } }) => ({ isDesktop });

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);