import React, { Component, PropTypes } from 'react';
import { setLoading } from '../../../actions/actions';
import {connect} from 'react-redux';
import { firebase, helpers } from 'redux-react-firebase';
import { Link } from 'react-router';
import * as CONSTANTS from '../../../constants/constants';
import classNames from 'classnames';
import ModalBox from '../../common/modalbox/modalbox';
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

@connect(
  	(state, props) => ({
    	course: dataToJS(state.firebase, 'courses'),
		levels: dataToJS(state.firebase, 'levels'),
		subjects: dataToJS(state.firebase, 'subjects'),
		users: dataToJS(state.firebase, 'users'),
		files: dataToJS(state.firebase, 'files'),
		userID: state.mainReducer.user ? state.mainReducer.user.uid : '',
		//featuredImage: state.course.featuredImage ? state.course.featuredImage : '',
		courseID: props.course ? props.course[Object.keys(props.course)[0]].code : '',
		userData: dataToJS(state.firebase, `users/${state.mainReducer.user ? state.mainReducer.user.uid : ''}`),
  	})
)
@firebase(
  	props => ([
    	`courses#orderByChild=slug&equalTo=${props.params.slug}`,
		'levels',
		'subjects',
		//`subjects#orderByKey&equalTo=${props.course ? props.course[Object.keys(props.course)[0]].subjects : ''}`,
		'users',
		'files',
		//`files#orderByChild=featuredImage&equalTo=${props.featuredImage}`
		`users/${props.userID}`
  	])
)
class Course extends Component {
    
	constructor(props) {
		super(props);
		
		this.state = {
			selectedSubjects: [],
			modalTitle: ''
		}
	}
	
	componentDidMount() {
		this.props.setLoading(false);
		$('.js-main').removeClass().addClass('main js-main course-page');
	}
	
//	componentWillReceiveProps(newProps) {
//		if (newProps.course) {
//			console.log(Object.keys(newProps.course)[0]);
//		}
//	}
	
	enrolConfirmation() {
		this.setState({ modalTitle: CONSTANTS.CONFIRM_ENROL }, function() {
			$('.js-modal-box-wrapper').show().animateCss('fade-in');
		});
	}
	
	modalBoxAnswer(answer) {
		if (answer === 'accept') {
			let courseID = null;
			Object.keys(this.props.course).map(function(key) {
				courseID = key;
			});
			
			let subjectsAdded = 0;
			const subjectData = {
				finalGrade: '',
				status: 'enrolled'
			}

			$(this.refs['btn-enroll']).hide();
			$(this.refs['loader-enroll']).show();

			for (let i=0; i<this.state.selectedSubjects.length; i++) {
				this.props.firebase.set(`users/${this.props.user.uid}/courses/${courseID}/${this.state.selectedSubjects[i]}`, subjectData)
					.then(function(response) {
						subjectsAdded++;
						if (subjectsAdded === this.state.selectedSubjects.length) {
							$(this.refs['btn-enroll']).show();
							$(this.refs['loader-enroll']).hide();
							this.props.setNotification({message: CONSTANTS.ENROLLED_COURSE, type: 'success'});
							this.setState({selectedSubjects: []});
						}
					}.bind(this), function(error) {
						$(this.refs['btn-enroll']).show();
						$(this.refs['loader-enroll']).hide();
						this.props.setNotification({message: String(error), type: 'error'});
					}.bind(this));
			}
		}
	}
	
	handleChange(event) {
		let selectedSubjects = this.state.selectedSubjects;
		
		if (event.target.checked) selectedSubjects.push(event.target.value);
		else {
			let index = -1;
			for (let i=0; i<selectedSubjects.length; i++) if (selectedSubjects[i] === event.target.value) index = i;
			if (index >= 0) selectedSubjects.splice(index, 1);
		}
		this.setState({ selectedSubjects });
	}
	
	render() {
		let course = null,
			featuredImage = null,
			enrollmentOpened = false,
			courseID = null,
			subjects = null,
			totalCredits = 0,
			section = this.props.location.pathname.substr(this.props.location.pathname.lastIndexOf('/') + 1);
		
		if (isLoaded(this.props.course) && isLoaded(this.props.files) && isLoaded(this.props.userData) && !isEmpty(this.props.course) && !isEmpty(this.props.files) && !isEmpty(this.props.userData)) {	
			Object.keys(this.props.course).map(function(key) {
				courseID = key;
				course = this.props.course[key];
				
				if (course.featuredImage) {
					Object.keys(this.props.files).map(function(fileKey) {
						if (fileKey === course.featuredImage) featuredImage = this.props.files[fileKey];
					}.bind(this));
				}
				
				if (moment().isBetween(moment(course.startDate), moment(course.endDate), 'days', '[]')) enrollmentOpened = true;
			}.bind(this));
		}
		
		if (course && course.subjects && isLoaded(this.props.subjects) && !isEmpty(this.props.subjects) && isLoaded(this.props.users) && !isEmpty(this.props.users) && isLoaded(this.props.userData) && !isEmpty(this.props.userData)) {
			subjects = course.subjects.map(function(item, i) {
				const subject = this.props.subjects[course.subjects[i]];
				let teachers = '';
				totalCredits += parseInt(subject.credits);
				
				if (subject.teachers) {
					teachers = subject.teachers.map(function(teacher, i) {
						return <div key={teacher}>{this.props.users[teacher].info.displayName}</div>;
					}.bind(this));  
				}
				
				return <tr key={item}>
							<td>{subject.code}</td>
							<td><Link to={`/subjects/${subject.slug}`}>{subject.title}</Link></td>
							<td>{teachers}</td>
							<td>{subject.credits}</td>
							<td>{this.props.userData.courses && this.props.userData.courses[courseID][item] ? this.props.userData.courses[courseID][item].status : subject.status === 'active' && enrollmentOpened ? <span><input type="checkbox" value={item} onChange={(event) => this.handleChange(event)} />Enrol now</span> : 'unavailable'}</td>
						</tr>
			}.bind(this));
		}
		
		return (
            <section className="page course"> 
            	{course ? <div className="page-wrapper">
					<h1 className="title">{course.title}</h1>
					<div className="meta">
						<Icon glyph={Level} />{this.props.levels[course.level].title} ({this.props.levels[course.level].code}) ({totalCredits} Credits) <Icon glyph={Calendar} />Enrollment from <span className="date">{moment(course.startDate).format('D MMMM YYYY')}</span> until <span className="date">{moment(course.endDate).format('D MMMM YYYY')}</span>
					</div>
					{section !== 'subjects' && subjects && enrollmentOpened ? <button className="btn btn-primary btn-enroll"><Link to={`/courses/${course.slug}/subjects`}>Enrol now!</Link></button> : ''}
					<ul className="horizontal-nav">
						<li className={classNames('horizontal-nav-item', {active: section === this.props.params.slug})}><Link to={`/courses/${course.slug}`}>Summary</Link></li>
						<li className={classNames('horizontal-nav-item', {active: section === 'subjects', hidden: !subjects})}><Link to={`/courses/${course.slug}/subjects`}>Subjects</Link></li>
						<li className={classNames('horizontal-nav-item', {active: section === 'fees'})}><Link to={`/courses/${course.slug}/fees`}>Fees</Link></li>
						<li className={classNames('horizontal-nav-item', {active: section === 'requirements'})}><Link to={`/courses/${course.slug}/requirements`}>Requirements</Link></li>
					</ul>
					<div className={classNames('columns', {'single-column': (!course.content2 && !course.content2), hidden: (section !== this.props.params.slug)})}>
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
         			<div className={classNames('columns single-column', {hidden: (section !== 'subjects')})}>
         				<div className="column page-content">
							<table>
								<thead><tr>
									<th>Code</th>
									<th>Subject</th>
									<th>Teacher(s)</th>
									<th>Credits</th>
									<th>Availability</th>
								</tr></thead>
								<tbody>
									{subjects}
								</tbody>
							</table>
							{enrollmentOpened && this.state.selectedSubjects.length > 0 ? <button ref="btn-enroll" className="btn btn-primary btn-enroll float-right" onClick={() => this.enrolConfirmation()}>Proceed with the registration</button> : ''}
							<div ref="loader-enroll" className="loader-small loader-enroll"></div>
						</div>
         			</div>
         			<div className={classNames('columns single-column', {hidden: (section !== 'fees')})}>
         				<div className="column page-content">
         					<div className="info">
         						<span>Registration fee: </span>{course.registrationFee}€
         						<span>Credits fee: </span> {course.creditFee}€
         					</div>
							<div className="content" dangerouslySetInnerHTML={{__html: CONSTANTS.converter.makeHtml(course.fees)}}></div>
         				</div>
         			</div>
         			<div className={classNames('columns single-column', {hidden: (section !== 'requirements')})}>
         				<div className="column page-content">
							<div className="content" dangerouslySetInnerHTML={{__html: CONSTANTS.converter.makeHtml(course.requirements)}}></div>
         				</div>
         			</div>
          		</div> : <div className="loader-small"></div>}
          		<ModalBox title={this.state.modalTitle} answer={this.modalBoxAnswer.bind(this)} />
            </section>
		)
	}
}

Course.propTypes = propTypes;
Course.defaultProps = defaultProps;

const mapDispatchToProps = {
	setLoading
}

const mapStateToProps = ({ mainReducer: { isDesktop } }) => ({ isDesktop });

export default connect(mapStateToProps, mapDispatchToProps)(Course);