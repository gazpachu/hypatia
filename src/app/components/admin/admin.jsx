import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { setLoading } from '../../actions/actions';
import $ from 'jquery';
import Icon from '../common/lib/icon/icon';

class Admin extends Component {
	
	constructor(props) {
		super(props);
	}
	
	componentDidMount() {
		this.props.setLoading(false);
	}	
	
	render () {
		return (
			<section className="admin page container-fluid">		
				<h1>Hello world</h1>
			</section>
		)
	}
}

const mapStateToProps = null;

const mapDispatchToProps = {
	setLoading
};

export default connect(mapStateToProps, mapDispatchToProps)(Admin);