import React, { Component, PropTypes } from 'react';
import { setLoading } from '../../../actions/actions';
import {connect} from 'react-redux';
import { firebase, helpers } from 'redux-react-firebase';
import Helpers from '../helpers';
import $ from 'jquery';

const defaultProps = {
	
};

const propTypes = {
	
};

const {isLoaded, isEmpty, dataToJS} = helpers;

@firebase(
  	props => ([
    	'courses',
		'subjects',
		'modules',
		'posts',
		'levels',
		'files'
  	])
)
@connect(
  	(state, props) => ({
    	courses: dataToJS(state.firebase, 'courses'),
		subjects: dataToJS(state.firebase, 'subjects'),
		modules: dataToJS(state.firebase, 'modules'),
		posts: dataToJS(state.firebase, 'posts'),
		levels: dataToJS(state.firebase, 'levels'),
		files: dataToJS(state.firebase, 'files')
  	})
)
class Listing extends Component {
    
	constructor(props) {
		super(props);
	}
	
	componentDidMount() {
		this.props.setLoading(false);
		$('.js-main').removeClass().addClass('main js-main listing-page');
	}
	
	render() {
		let type = this.props.location.pathname.slice(1),
		 	items = null,
			path = type;
		
		if (path === 'news') type = 'posts';
		
		if (isLoaded(this.props[type]) && !isEmpty(this.props[type]) && isLoaded(this.props.files) && !isEmpty(this.props.files))
			items = <ul className="cards-list">{Helpers.renderCards.call(this, path)}</ul>;
		else
			items = <div className="loader-small"></div>;
		
		return (
            <section className="page listing-page"> 
            	<div className="cards">
					<h1 className="cards-heading">{type}</h1>
					{items}
          		</div>
            </section>
		)
	}
}

Listing.propTypes = propTypes;
Listing.defaultProps = defaultProps;

const mapDispatchToProps = {
	setLoading
}

const mapStateToProps = ({ mainReducer: { isDesktop } }) => ({ isDesktop });

export default connect(mapStateToProps, mapDispatchToProps)(Listing);