import React, { Component, PropTypes } from 'react';
import { setLoading } from '../../../actions/actions';
import {connect} from 'react-redux';
import { firebase, helpers } from 'redux-react-firebase';
import classNames from 'classnames';
import * as CONSTANTS from '../../../constants/constants';
import { Link } from 'react-router';
import moment from 'moment';
import $ from 'jquery';
import Edit from '../lib/edit/edit';
import Icon from '../lib/icon/icon';
import Professor from '../../../../../static/svg/professor.svg';

const defaultProps = {
	
};

const propTypes = {
	
};

const {isLoaded, isEmpty, dataToJS} = helpers;

@connect(
  	(state, props) => ({
    	subject: dataToJS(state.firebase, 'subjects'),
		files: dataToJS(state.firebase, 'files'),
		users: dataToJS(state.firebase, 'users'),
		activities: dataToJS(state.firebase, 'activities'),
		modules: dataToJS(state.firebase, 'modules'),
		userID: state.mainReducer.user ? state.mainReducer.user.uid : '',
		userData: dataToJS(state.firebase, `users/${state.mainReducer.user ? state.mainReducer.user.uid : ''}`),
  	})
)
@firebase(
  	props => ([
    	`subjects#orderByChild=slug&equalTo=${props.params.slug}`,
		'files',
		'users',
		'activities',
		'modules',
		`users/${props.userID}`
  	])
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
			activities = null,
			modules = null,
			teachers = '',
			section = this.props.location.pathname.substr(this.props.location.pathname.lastIndexOf('/') + 1);
		
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
		
		if (subject && subject.activities && isLoaded(this.props.activities) && !isEmpty(this.props.activities)) {
			activities = subject.activities.map(function(item, i) {
				const activity = this.props.activities[subject.activities[i]];

				return <tr key={item}>
							<td>{activity.code}</td>
							<td><Link to={`/activities/${activity.slug}`}>{activity.title}</Link></td>
						</tr>
			}.bind(this));
		}
		
		if (subject && subject.modules && isLoaded(this.props.modules) && !isEmpty(this.props.modules)) {
			modules = subject.modules.map(function(item, i) {
				const module = this.props.modules[subject.modules[i]];

				return <tr key={item}>
							<td>{module.code}</td>
							<td><Link to={`/modules/${module.slug}`}>{module.title}</Link></td>
						</tr>
			}.bind(this));
		}
		
		return (
            <section className="page subject"> 
            	{subject ? <div className="page-wrapper">
					<h1 className="title">{subject.title}</h1>
					<div className="meta">
						<Icon glyph={Professor} />{teachers}
						{isLoaded(this.props.userData) && !isEmpty(this.props.userData) && this.props.userData.info.level >= CONSTANTS.ADMIN_LEVEL ? <Edit editLink={`/admin/subjects/edit/${subject.slug}`} newLink="/admin/subjects/new" /> : ''}
					</div>
					<ul className="horizontal-nav">
						<li className={classNames('horizontal-nav-item', {active: section === this.props.params.slug})}><Link to={`/subjects/${subject.slug}`}>Summary</Link></li>
						<li className={classNames('horizontal-nav-item', {active: section === 'modules', hidden: !modules})}><Link to={`/subjects/${subject.slug}/modules`}>Modules</Link></li>
						<li className={classNames('horizontal-nav-item', {active: section === 'activities', hidden: !activities})}><Link to={`/subjects/${subject.slug}/activities`}>Activities</Link></li>
					</ul>
					<div className={classNames('columns', {'single-column': (!subject.content2 && !subject.content2), hidden: (section !== this.props.params.slug)})}>
						<div className="column page-content">
							{featuredImage ? <img className="featured-image" src={featuredImage.url} /> : ''}
							<div className="content" dangerouslySetInnerHTML={{__html: CONSTANTS.converter.makeHtml(subject.content1)}}></div>
						</div>
						{subject.content2 ? <div className="column page-sidebar">
							<div className="content" dangerouslySetInnerHTML={{__html: CONSTANTS.converter.makeHtml(subject.content2)}}></div>
						</div> : ''}
						{subject.content3 ? <div className="column page-sidebar">
							<div className="content" dangerouslySetInnerHTML={{__html: CONSTANTS.converter.makeHtml(subject.content3)}}></div>
						</div> : ''}
					</div>
        			<div className={classNames('columns single-column', {hidden: (section !== 'modules')})}>
         				<div className="column page-content">
							<table>
								<thead><tr>
									<th>Code</th>
									<th>Module</th>
								</tr></thead>
								<tbody>
									{modules}
								</tbody>
							</table>
						</div>
         			</div>
         			<div className={classNames('columns single-column', {hidden: (section !== 'activities')})}>
         				<div className="column page-content">
							<table>
								<thead><tr>
									<th>Code</th>
									<th>Activity</th>
								</tr></thead>
								<tbody>
									{activities}
								</tbody>
							</table>
						</div>
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