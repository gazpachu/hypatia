import React, { Component, PropTypes } from 'react';
import { setLoading } from '../../../actions/actions';
import {connect} from 'react-redux';
import { firebase, helpers } from 'redux-react-firebase';
import { Link } from 'react-router';
import * as CONSTANTS from '../../../constants/constants';
import classNames from 'classnames';
import showdown from 'showdown';
import moment from 'moment';
import $ from 'jquery';
import Icon from '../lib/icon/icon';
import Level from '../../../../../static/svg/course.svg';
import Calendar from '../../../../../static/svg/calendar2.svg';

const defaultProps = {
	
};

const propTypes = {
	
};

const {isLoaded, isEmpty, dataToJS} = helpers;

@firebase(
  	props => ([
    	`courses#orderByChild=slug&equalTo=${window.location.href.substr(window.location.href.lastIndexOf('/') + 1)}`,
		'levels',
		'files'
  	])
)
@connect(
  	(state, props) => ({
    	course: dataToJS(state.firebase, 'courses'),
		levels: dataToJS(state.firebase, 'levels'),
		files: dataToJS(state.firebase, 'files')
  	})
)
class Course extends Component {
    
	constructor(props) {
		super(props);
	}
	
	componentDidMount() {
		this.props.setLoading(false);
		$('.js-main').removeClass().addClass('main js-main course-page');
	}
	
	enroll(courseID, enrolled) {
		if (!enrolled) {
			let userCourses = this.props.userData.courses || [];
			userCourses.push(courseID)

			$(this.refs['btn-enroll']).hide();
			$(this.refs['loader-enroll']).show();
			this.props.firebase.set(`users/${this.props.user.uid}/courses`, userCourses)
				.then(function(response) {
					$(this.refs['btn-enroll']).show();
					$(this.refs['loader-enroll']).hide();
					this.props.setNotification({message: CONSTANTS.ENROLLED_COURSE, type: 'success'});
				}.bind(this), function(error) {
					$(this.refs['btn-enroll']).show();
					$(this.refs['loader-enroll']).hide();
					this.props.setNotification({message: String(error), type: 'error'});
				}.bind(this));
		}
	}
	
	render() {
		let course = null,
			featuredImage = null,
			enrolled = false,
			courseID = null;
		
		if (isLoaded(this.props.course) && isLoaded(this.props.files) && isLoaded(this.props.userData) && !isEmpty(this.props.course) && !isEmpty(this.props.files) && !isEmpty(this.props.userData)) {	
			Object.keys(this.props.course).map(function(key) {
				courseID = key;
				course = this.props.course[key];
				
				if (course.featuredImage) {
					Object.keys(this.props.files).map(function(fileKey) {
						if (fileKey === course.featuredImage) featuredImage = this.props.files[fileKey];
					}.bind(this));
				}
				
				if (this.props.userData.courses) {
					for (let i=0; i<this.props.userData.courses.length; i++) {
						if (this.props.userData.courses[i] === courseID) enrolled = true;
					}
				}
			}.bind(this));
		}
		
		return (
            <section className="page course"> 
            	{course ? <div className="page-wrapper">
					<h1 className="title">{course.title}</h1>
					<div className="meta">
						<Icon glyph={Level} />{this.props.levels[course.level].title} ({this.props.levels[course.level].code}) ({course.credits} Credits) <Icon glyph={Calendar} /><span className="date">From {moment(course.startDate).format('D MMMM YYYY')} until {moment(course.endDate).format('D MMMM YYYY')}</span>
					</div>
					<button ref="btn-enroll" className={classNames('btn btn-primary btn-enroll', {disabled: enrolled})} onClick={() => this.enroll(courseID, enrolled)}>{enrolled ? 'You are already enrolled to this course' : 'Enrol now!'}</button>
					<div ref="loader-enroll" className="loader-small loader-enroll"></div>
					<ul className="course-nav">
						<li className="course-nav-item"><Link to={`/courses/${course.slug}`}>Summary</Link></li>
						<li className="course-nav-item"><Link to={`/courses/${course.slug}/subjects`}>Subjects</Link></li>
						<li className="course-nav-item"><Link to={`/courses/${course.slug}/fees`}>Fees</Link></li>
						<li className="course-nav-item"><Link to={`/courses/${course.slug}/requirements`}>Requirements</Link></li>
						<li className="course-nav-item"><Link to={`/courses/${course.slug}/careers`}>Careers</Link></li>
						<li className="course-nav-item"><Link to={`/courses/${course.slug}/news`}>News</Link></li>
					</ul>
					<div className={classNames('columns', {'single-column': (!course.content2 && !course.content2)})}>
						<div className="column page-content">
							{featuredImage ? <img className="featured-image" src={featuredImage.url} /> : ''}
							<div className="content" dangerouslySetInnerHTML={{__html: CONSTANTS.converter.makeHtml(course.content1)}}></div>
						</div>
						{course.content2 ? <div className="column page-sidebar">
							<div className="content" dangerouslySetInnerHTML={{__html: CONSTANTS.converter.makeHtml(course.content2)}}></div>
						</div> : ''}
						{course.content3 ? <div className="column page-sidebar">
							<div className="content" dangerouslySetInnerHTML={{__html: CONSTANTS.converter.makeHtml(course.content3)}}></div>
						</div> : ''}
					</div>
          		</div> : <div className="loader-small"></div>}
            </section>
		)
	}
}

Course.propTypes = propTypes;
Course.defaultProps = defaultProps;

const mapDispatchToProps = {
	setLoading
}

const mapStateToProps = ({ mainReducer: { isDesktop, userData } }) => ({ isDesktop, userData });

export default connect(mapStateToProps, mapDispatchToProps)(Course);