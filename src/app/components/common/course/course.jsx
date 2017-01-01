import React, { Component, PropTypes } from 'react';
import { setLoading } from '../../../actions/actions';
import {connect} from 'react-redux';
import { firebase, helpers } from 'redux-react-firebase';
import { Link } from 'react-router';
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
		files: dataToJS(state.firebase, 'files'),
  	})
)
class Course extends Component {
    
	constructor(props) {
		super(props);
		this.converter = new showdown.Converter();
	}
	
	componentDidMount() {
		this.props.setLoading(false);
		$('.js-main').removeClass().addClass('main js-main course-page');
	}
	
	render() {
		let course = null,
			featuredImage = null;
		
		if (isLoaded(this.props.course) && isLoaded(this.props.files) && !isEmpty(this.props.course) && !isEmpty(this.props.files)) {	
			Object.keys(this.props.course).map(function(key) {
				course = this.props.course[key];
				if (course.featuredImage) {
					Object.keys(this.props.files).map(function(fileKey) {
						if (fileKey === course.featuredImage) featuredImage = this.props.files[fileKey];
					}.bind(this));
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
					<Link className="btn-enroll" to={`/courses/${course.slug}/register`}><button className="btn btn-primary">Enroll now!</button></Link>
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
							<div className="content" dangerouslySetInnerHTML={{__html: this.converter.makeHtml(course.content1)}}></div>
						</div>
						{course.content2 ? <div className="column page-sidebar">
							<div className="content" dangerouslySetInnerHTML={{__html: this.converter.makeHtml(course.content2)}}></div>
						</div> : ''}
						{course.content3 ? <div className="column page-sidebar">
							<div className="content" dangerouslySetInnerHTML={{__html: this.converter.makeHtml(course.content3)}}></div>
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

const mapStateToProps = ({ mainReducer: { isDesktop } }) => ({ isDesktop });

export default connect(mapStateToProps, mapDispatchToProps)(Course);