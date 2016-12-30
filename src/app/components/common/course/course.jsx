import React, { Component, PropTypes } from 'react';
import { setLoading } from '../../../actions/actions';
import {connect} from 'react-redux';
import { firebase, helpers } from 'redux-react-firebase';
import classNames from 'classnames';
import showdown from 'showdown';
import moment from 'moment';
import $ from 'jquery';
import Icon from '../lib/icon/icon';
import Logo from '../../../../../static/svg/logo.svg';
import Level from '../../../../../static/svg/course.svg';

const defaultProps = {
	
};

const propTypes = {
	
};

const {isLoaded, isEmpty, dataToJS} = helpers;

@firebase(
  	props => ([
    	`courses#orderByChild=slug&equalTo=${window.location.href.substr(window.location.href.lastIndexOf('/') + 1)}`,
		'files'
  	])
)
@connect(
  	(state, props) => ({
    	course: dataToJS(state.firebase, 'courses'),
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
            	{course ? <div className="course-wrapper">
					<h1 className="title">{course.title}</h1>
					<div className="level"><Icon glyph={Level} />{course.level} ({course.credits} Credits)</div>
					<div className="date">From {moment(course.startDate).format('D MMMM YYYY')} until {moment(course.endDate).format('D MMMM YYYY')}</div>
					<div className={classNames('columns', {'single-column': (!course.content2 && !course.content2)})}>
						<div className="column course-content">
							{featuredImage ? <img className="featured-image" src={featuredImage.url} /> : ''}
							<div className="content" dangerouslySetInnerHTML={{__html: this.converter.makeHtml(course.content1)}}></div>
						</div>
						{course.content2 ? <div className="column course-sidebar">
							<div className="content" dangerouslySetInnerHTML={{__html: this.converter.makeHtml(course.content2)}}></div>
						</div> : ''}
						{course.content3 ? <div className="column course-sidebar">
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