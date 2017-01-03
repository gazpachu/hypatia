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
import Calendar from '../../../../../static/svg/calendar2.svg';

const defaultProps = {
	
};

const propTypes = {
	
};

const {isLoaded, isEmpty, dataToJS} = helpers;

@firebase(
  	props => ([
    	`activities#orderByChild=slug&equalTo=${window.location.href.substr(window.location.href.lastIndexOf('/') + 1)}`,
		'files',
		'users'
  	])
)
@connect(
  	(state, props) => ({
    	activity: dataToJS(state.firebase, 'activities'),
		files: dataToJS(state.firebase, 'files'),
		users: dataToJS(state.firebase, 'users')
  	})
)
class Activity extends Component {
    
	constructor(props) {
		super(props);
	}
	
	componentDidMount() {
		this.props.setLoading(false);
		$('.js-main').removeClass().addClass('main js-main activity-page');
	}
	
	render() {
		let activity = null,
			featuredImage = null,
			authors = '';
		
		if (isLoaded(this.props.activity) && isLoaded(this.props.files) && isLoaded(this.props.users) && !isEmpty(this.props.activity) && !isEmpty(this.props.files) && !isEmpty(this.props.users)) {	
			Object.keys(this.props.activity).map(function(key) {
				activity = this.props.activity[key];
				if (activity.featuredImage) {
					Object.keys(this.props.files).map(function(fileKey) {
						if (fileKey === activity.featuredImage) featuredImage = this.props.files[fileKey];
					}.bind(this));
				}
				if (activity.authors) {
					for (let i=0; i<activity.authors.length; i++) {
						let author = this.props.users[activity.authors[i]];
						authors += author.info.firstName + ' ' + author.info.lastName1;
						if (i < activity.authors.length -1) authors += ', ';
					}
				}
			}.bind(this));
		}
		
		return (
            <section className="page activity"> 
            	{activity ? <div className="page-wrapper">
					<h1 className="title">{activity.title}</h1>
					{authors ? <div className="author"><Icon glyph={Professor} />{authors}</div> : ''}
					<div className="meta">
						<Icon glyph={Calendar} />From <span className="date">{moment(activity.startDate).format('D MMMM YYYY')}</span> until <span className="date">{moment(activity.endDate).format('D MMMM YYYY')}</span>
					</div>
					<div className={classNames('columns', {'single-column': (!activity.content2 && !activity.content2)})}>
						<div className="column page-content">
							{featuredImage ? <img className="featured-image" src={featuredImage.url} /> : ''}
							<div className="content" dangerouslySetInnerHTML={{__html: converter.makeHtml(activity.content1)}}></div>
						</div>
						{activity.content2 ? <div className="column page-sidebar">
							<div className="content" dangerouslySetInnerHTML={{__html: converter.makeHtml(activity.content2)}}></div>
						</div> : ''}
						{activity.content3 ? <div className="column page-sidebar">
							<div className="content" dangerouslySetInnerHTML={{__html: converter.makeHtml(activity.content3)}}></div>
						</div> : ''}
					</div>
          		</div> : <div className="loader-small"></div>}
            </section>
		)
	}
}

Activity.propTypes = propTypes;
Activity.defaultProps = defaultProps;

const mapDispatchToProps = {
	setLoading
}

const mapStateToProps = ({ mainReducer: { isDesktop } }) => ({ isDesktop });

export default connect(mapStateToProps, mapDispatchToProps)(Activity);