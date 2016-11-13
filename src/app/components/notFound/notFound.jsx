import React, { Component, PropTypes } from 'react';
import { Link, browserHistory } from 'react-router';
import { connect } from 'react-redux';
import { setLoading } from '../../actions/actions';
import $ from 'jquery';
import Icon from '../common/lib/icon/icon';

import Icon404 from '../../../../static/404.svg';


class NotFound extends Component {
	
	constructor(props) {
		super(props);
	}
	
	componentDidMount() {
		this.props.setLoading(false);
	}	
	
	render () {
		return (
			<section className="notFound page container-fluid">		
				<div className="col-md-4 col-md-offset-4 col-xs-10 col-xs-offset-1">
					<Icon glyph={Icon404} className="icon icon-404" />
					
					<div className="content-container">
						<h3>Barnacles!</h3>
						<p>We're all at sea, dashed on the rocks.</p>
						<p>We can't ﬁnd what you were looking for.<br/>Because it's dark. Really dark.</p>
					</div>
					
					<div className="btn-container">
						<Link to="/" className="btn btn-primary btn-xs">dry land</Link>
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