import React, { Component, PropTypes } from 'react';
import { setLoading } from '../../../actions/actions';
import {connect} from 'react-redux';
import { firebase, helpers } from 'redux-react-firebase';
import classNames from 'classnames';
import { converter } from '../../../constants/constants';
import moment from 'moment';
import $ from 'jquery';
import Icon from '../lib/icon/icon';
import Professor from '../../../../../static/svg/professor.svg';

const defaultProps = {
	
};

const propTypes = {
	
};

const {isLoaded, isEmpty, dataToJS} = helpers;

@firebase(
  	props => ([
    	`subjects#orderByChild=slug&equalTo=${window.location.href.substr(window.location.href.lastIndexOf('/') + 1)}`,
		'files',
		'users'
  	])
)
@connect(
  	(state, props) => ({
    	subject: dataToJS(state.firebase, 'subjects'),
		files: dataToJS(state.firebase, 'files'),
		users: dataToJS(state.firebase, 'users')
  	})
)
class Subject extends Component {
    
	constructor(props) {
		super(props);
	}
	
	componentDidMount() {
		this.props.setLoading(false);
		$('.js-main').removeClass().addClass('main js-main subject-page');
	}
	
	render() {
		let subject = null,
			featuredImage = null,
			teachers = '';
		
		if (isLoaded(this.props.subject) && isLoaded(this.props.files) && isLoaded(this.props.users) && !isEmpty(this.props.subject) && !isEmpty(this.props.files) && !isEmpty(this.props.users)) {	
			Object.keys(this.props.subject).map(function(key) {
				subject = this.props.subject[key];
				if (subject.featuredImage) {
					Object.keys(this.props.files).map(function(fileKey) {
						if (fileKey === subject.featuredImage) featuredImage = this.props.files[fileKey];
					}.bind(this));
				}
				if (subject.teachers) {
					for (let i=0; i<subject.teachers.length; i++) {
						let teacher = this.props.users[subject.teachers[i]];
						teachers += teacher.info.firstName + ' ' + teacher.info.lastName1;
						if (i < subject.teachers.length -1) teachers += ', ';
					}
				}
			}.bind(this));
		}
		
		return (
            <section className="page subject"> 
            	{subject ? <div className="page-wrapper">
					<h1 className="title">{subject.title}</h1>
					{teachers ? <div className="teacher"><Icon glyph={Professor} />{teachers}</div> : ''}
					<div className={classNames('columns', {'single-column': (!subject.content2 && !subject.content2)})}>
						<div className="column page-content">
							{featuredImage ? <img className="featured-image" src={featuredImage.url} /> : ''}
							<div className="content" dangerouslySetInnerHTML={{__html: converter.makeHtml(subject.content1)}}></div>
						</div>
						{subject.content2 ? <div className="column page-sidebar">
							<div className="content" dangerouslySetInnerHTML={{__html: converter.makeHtml(subject.content2)}}></div>
						</div> : ''}
						{subject.content3 ? <div className="column page-sidebar">
							<div className="content" dangerouslySetInnerHTML={{__html: converter.makeHtml(subject.content3)}}></div>
						</div> : ''}
					</div>
          		</div> : <div className="loader-small"></div>}
            </section>
		)
	}
}

Subject.propTypes = propTypes;
Subject.defaultProps = defaultProps;

const mapDispatchToProps = {
	setLoading
}

const mapStateToProps = ({ mainReducer: { isDesktop } }) => ({ isDesktop });

export default connect(mapStateToProps, mapDispatchToProps)(Subject);