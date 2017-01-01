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

const {dataToJS} = helpers;

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
		const type = this.props.location.pathname.slice(1),
			items = Helpers.renderCards.call(this, type);
		
		return (
            <section className="page listing-page"> 
            	<div className="cards">
					<h1 className="section-heading">{type}</h1>
					<ul className="cards-list">
						{items}
					</ul>
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