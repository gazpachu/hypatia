import React, { Component, PropTypes } from 'react';
import $ from 'jquery';
import { history } from '../../../store';
import { Link } from 'react-router';
import Helpers from '../../common/helpers';
import { connect } from 'react-redux';
import { setBreadcrumbs } from '../../../actions/actions';

import Icon from '../lib/icon/icon';

class Breadcrumbs extends Component {
	
	constructor(props) {
		super(props);
		
		this.state = {
			initialised: false
		}
	}
	
	componentDidMount() {
		this.unlisten = history.listen( location => {
			let newTrail = [];
			if (location.pathname !== '/') {
				newTrail = location.pathname.substring(1, location.pathname.lenght).split('/');
				for (let i=0; i<newTrail.length; i++) {
					newTrail[i] = newTrail[i].charAt(0).toUpperCase() + newTrail[i].slice(1);
				}
			}
			else
				newTrail.push('Home');
				
			this.props.setBreadcrumbs(newTrail);
		});
	}
	
	componentWillUnmount() {
		this.unlisten();
	}
	
	render() {
		return (
			<div className="breadcrumbs">
				<ul className="breadcrumbs-items">
					{this.props.breadcrumbs ? this.props.breadcrumbs.map((item, i) => <li className="item" key={i}>{item}</li>) : ''}
				</ul>
			</div>
		)
	}
}

const mapDispatchToProps = {
	setBreadcrumbs
}

const mapStateToProps = ({ mainReducer: { breadcrumbs } }) => ({ breadcrumbs });

export default connect(mapStateToProps, mapDispatchToProps)(Breadcrumbs);