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
    	`modules#orderByChild=slug&equalTo=${window.location.href.substr(window.location.href.lastIndexOf('/') + 1)}`,
		'files',
		'users'
  	])
)
@connect(
  	(state, props) => ({
    	module: dataToJS(state.firebase, 'modules'),
		files: dataToJS(state.firebase, 'files'),
		users: dataToJS(state.firebase, 'users')
  	})
)
class Module extends Component {
    
	constructor(props) {
		super(props);
	}
	
	componentDidMount() {
		this.props.setLoading(false);
		$('.js-main').removeClass().addClass('main js-main module-page');
	}
	
	render() {
		let module = null,
			featuredImage = null,
			authors = null;
		
		if (isLoaded(this.props.module) && isLoaded(this.props.files) && isLoaded(this.props.users) && !isEmpty(this.props.module) && !isEmpty(this.props.files) && !isEmpty(this.props.users)) {	
			Object.keys(this.props.module).map(function(key) {
				module = this.props.module[key];
				if (module.featuredImage) {
					Object.keys(this.props.files).map(function(fileKey) {
						if (fileKey === module.featuredImage) featuredImage = this.props.files[fileKey];
					}.bind(this));
				}
				if (module.authors) {
					for (let i=0; i<module.authors.length; i++) {
						let author = this.props.users[module.authors[i]];
						authors += author.firstName + ' ' + author.lastName1;
					}
				}
			}.bind(this));
		}
		
		return (
            <section className="page module"> 
            	{module ? <div className="page-wrapper">
					<h1 className="title">{module.title}</h1>
					{authors ? <div className="author"><Icon glyph={Professor} />{authors}</div> : ''}
					<div className={classNames('columns', {'single-column': (!module.content2 && !module.content2)})}>
						<div className="column page-content">
							{featuredImage ? <img className="featured-image" src={featuredImage.url} /> : ''}
							<div className="content" dangerouslySetInnerHTML={{__html: converter.makeHtml(module.content1)}}></div>
						</div>
						{module.content2 ? <div className="column page-sidebar">
							<div className="content" dangerouslySetInnerHTML={{__html: converter.makeHtml(module.content2)}}></div>
						</div> : ''}
						{module.content3 ? <div className="column page-sidebar">
							<div className="content" dangerouslySetInnerHTML={{__html: converter.makeHtml(module.content3)}}></div>
						</div> : ''}
					</div>
          		</div> : <div className="loader-small"></div>}
            </section>
		)
	}
}

Module.propTypes = propTypes;
Module.defaultProps = defaultProps;

const mapDispatchToProps = {
	setLoading
}

const mapStateToProps = ({ mainReducer: { isDesktop } }) => ({ isDesktop });

export default connect(mapStateToProps, mapDispatchToProps)(Module);