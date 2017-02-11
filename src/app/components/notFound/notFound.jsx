import React, { Component, PropTypes } from 'react';
import { Link, browserHistory } from 'react-router';
import { connect } from 'react-redux';
import { setLoading } from '../../actions/actions';
import $ from 'jquery';
import Icon from '../common/lib/icon/icon';

class NotFound extends Component {
	
	constructor(props) {
		super(props);
	}
	
	componentDidMount() {
		this.props.setLoading(false);
		$('.js-main').removeClass().addClass('main js-main not-found-page');
	}	
	
	render () {
		return (
			<section className="notFound page static-page">
				<div className="page-wrapper">		
					<h1 className="title">Page not found :-(</h1>
					<div className="columns single-column">
						<div className="column page-content">
							<p>Sorry!, Hypatia is still under construction<br />Please check again later. Thanks!</p>
							<img src="/static/img/404.png" />
							<Link to="/"><button className="btn btn-primary">Go back to the home page</button></Link>
						</div>
					</div>
				</div>
			</section>
		)
	}
}

const mapStateToProps = null;

const mapDispatchToProps = {
	setLoading
};

export default connect(mapStateToProps, mapDispatchToProps)(NotFound);