import React, { Component, PropTypes } from 'react';
import { setLoading  } from '../../actions/actions';
import {connect} from 'react-redux';
import { Link } from 'react-router';
import $ from 'jquery';
import moment from 'moment';
import Icon from '../common/lib/icon/icon';

class Dashboard extends Component {
    
	constructor(props) {
		super(props);
	}
	
	componentDidMount() {
		this.props.setLoading(false);  // Move this to API callback when implemented (if ever)
		$('.js-main').removeClass().addClass('main js-main dashboard-page');
	}
	
	render() {
		return (
            <section className="dashboard page">
				{(this.props.user && this.props.userData) ? <div className="page-wrapper">
           
           		</div> : <div className="loader-small"></div>}
            </section>
		)
	}
}

const mapDispatchToProps = {
	setLoading
}

const mapStateToProps = ({ mainReducer: { isDesktop } }) => ({ isDesktop });

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);