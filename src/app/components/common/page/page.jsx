import React, { Component, PropTypes } from 'react';
import { setLoading } from '../../../actions/actions';
import {connect} from 'react-redux';
import { firebase, helpers } from 'redux-react-firebase';
import classNames from 'classnames';
import showdown from 'showdown';
import $ from 'jquery';
import Icon from '../lib/icon/icon';
import Logo from '../../../../../static/svg/logo.svg';

const defaultProps = {
	
};

const propTypes = {
	
};

const {isLoaded, isEmpty, dataToJS} = helpers;

@firebase( [
  	'files',
	'pages'
])
@connect(
  	({firebase}) => ({
		files: dataToJS(firebase, 'files'),
    	pages: dataToJS(firebase, 'pages')		
  	})
)
class Page extends Component {
    
	constructor(props) {
		super(props);
		
		let path = this.props.location.pathname.split('/');
		this.slug = path[path.length-1];
		this.converter = new showdown.Converter();
	}
	
	componentDidMount() {
		this.props.setLoading(false);
		$('.js-main').removeClass().addClass('main js-main detail-page');
	}
	
	render() {
		let title = '',
			content = '',
			secondaryContent = '';
			
		if (isLoaded(this.props.pages) && !isEmpty(this.props.pages)) {
			Object.keys(this.props.pages).map(function(key) {
				let item = this.props.pages[key];
				if (item.slug === this.slug) {
					title = item.title;
					content = item.content1;
					secondaryContent = item.content2;
				}
			}.bind(this));
		}
		
		return (
            <section className="detail-page page">
            	<div className="columns">
            		<div className="column page-content">
            			<h1 className="title">{title}</h1>
           				<div className="content" dangerouslySetInnerHTML={{__html: this.converter.makeHtml(content)}}></div>
            		</div>
            		<div className="column page-sidebar">
            			<div className="content" dangerouslySetInnerHTML={{__html: this.converter.makeHtml(secondaryContent)}}></div>
					</div>
            	</div>
            </section>
		)
	}
}

Page.propTypes = propTypes;
Page.defaultProps = defaultProps;

const mapDispatchToProps = {
	setLoading
}

const mapStateToProps = ({ mainReducer: { isDesktop } }) => ({ isDesktop });

export default connect(mapStateToProps, mapDispatchToProps)(Page);