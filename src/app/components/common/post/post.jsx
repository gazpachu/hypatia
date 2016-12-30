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

const defaultProps = {
	
};

const propTypes = {
	
};

const {isLoaded, isEmpty, dataToJS} = helpers;

@firebase(
  	props => ([
    	`posts#orderByChild=slug&equalTo=${window.location.href.substr(window.location.href.lastIndexOf('/') + 1)}`,
		'files'
  	])
)
@connect(
  	(state, props) => ({
    	post: dataToJS(state.firebase, 'posts'),
		files: dataToJS(state.firebase, 'files'),
  	})
)
class Post extends Component {
    
	constructor(props) {
		super(props);
		this.converter = new showdown.Converter();
	}
	
	componentDidMount() {
		this.props.setLoading(false);
		$('.js-main').removeClass().addClass('main js-main post-page');
	}
	
	render() {
		let post = null,
			featuredImage = null;
		
		if (isLoaded(this.props.post) && isLoaded(this.props.files) && !isEmpty(this.props.post) && !isEmpty(this.props.files)) {	
			Object.keys(this.props.post).map(function(key) {
				post = this.props.post[key];
				if (post.featuredImage) {
					Object.keys(this.props.files).map(function(fileKey) {
						if (fileKey === post.featuredImage) featuredImage = this.props.files[fileKey];
					}.bind(this));
				}
			}.bind(this));
		}
		
		return (
            <section className="page post"> 
            	{post ? <div className="post-wrapper">
					<h1 className="title">{post.title}</h1>
					<div className="date">{moment(post.date).format('Do MMMM YYYY, h:mm a')}</div>
					<div className={classNames('columns', {'single-column': (!post.content2 && !post.content2)})}>
						<div className="column post-content">
							{featuredImage ? <img className="featured-image" src={featuredImage.url} /> : ''}
							<div className="content" dangerouslySetInnerHTML={{__html: this.converter.makeHtml(post.content1)}}></div>
						</div>
						{post.content2 ? <div className="column post-sidebar">
							<div className="content" dangerouslySetInnerHTML={{__html: this.converter.makeHtml(post.content2)}}></div>
						</div> : ''}
						{post.content3 ? <div className="column post-sidebar">
							<div className="content" dangerouslySetInnerHTML={{__html: this.converter.makeHtml(post.content3)}}></div>
						</div> : ''}
					</div>
          		</div> : <div className="loader-small"></div>}
            </section>
		)
	}
}

Post.propTypes = propTypes;
Post.defaultProps = defaultProps;

const mapDispatchToProps = {
	setLoading
}

const mapStateToProps = ({ mainReducer: { isDesktop } }) => ({ isDesktop });

export default connect(mapStateToProps, mapDispatchToProps)(Post);