import React, { Component, PropTypes } from 'react';
import { Link, browserHistory } from 'react-router';
import { connect } from 'react-redux';
import { setLoading } from '../../actions/actions';
import $ from 'jquery';
import Icon from '../common/lib/icon/icon';

class Tour extends Component {
	
	constructor(props) {
		super(props);
	}
	
	componentDidMount() {
		this.props.setLoading(false);
		$('.js-main').removeClass().addClass('main js-main tour-page');
	}	
	
	render () {
		return (
			<section className="tour page">
				<div id="impress">
					
				</div>
			</section>
		)
	}
}

const mapStateToProps = null;

const mapDispatchToProps = {
	setLoading
};

export default connect(mapStateToProps, mapDispatchToProps)(Tour);