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
				<h2>Modules</h2>
				<select className="select-items">
					<option></option>
				</select>
				<input type="text" className="input-field" placeholder="New module" />
				<button className="btn btn-primary">Add module</button>
			</section>
		)
	}
}

const mapStateToProps = null;

const mapDispatchToProps = {
	setLoading
};

export default connect(mapStateToProps, mapDispatchToProps)(Admin);