import React, { Component, PropTypes } from 'react';
import { setLoading } from '../../actions/actions';
import {connect} from 'react-redux';
import { Link } from 'react-router';
import $ from 'jquery';
import moment from 'moment';
import showdown from 'showdown';
import Icon from '../common/lib/icon/icon';

class Notifications extends Component {
    
	constructor(props) {
		super(props);
	}
	
	componentDidMount() {
		this.props.setLoading(false);  // Move this to API callback when implemented (if ever)
		$('.js-main').removeClass().addClass('main js-main notifications-page');
	}
	
	render() {
		return (
            <section className="notifications page">
				
            </section>
		)
	}
}

const mapDispatchToProps = {
	setLoading
}

const mapStateToProps = ({ mainReducer: { isDesktop } }) => ({ isDesktop });

export default connect(mapStateToProps, mapDispatchToProps)(Notifications);