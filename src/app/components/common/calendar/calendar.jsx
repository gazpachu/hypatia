import React, { Component, PropTypes } from 'react';
import { setLoading } from '../../../actions/actions';
import { DEMO_EMAIL, DEMO_CHAT_WARNING } from '../../../constants/constants';
import classNames from 'classnames';
import {connect} from 'react-redux';
import $ from 'jquery';
import moment from 'moment';
import Icon from '../lib/icon/icon'; 

const defaultProps = {
	
};

const propTypes = {
	isDesktop: PropTypes.bool
};

class Calendar extends Component {
    
	constructor(props) {
		super(props);
	}
	
	render() {
		return (
            <section className={`calendar-panel ${this.props.class}`}>
				<h1>Calendar</h1>
            </section>
		)
	}
}

Calendar.propTypes = propTypes;
Calendar.defaultProps = defaultProps;

const mapDispatchToProps = {
	setLoading
}

const mapStateToProps = ({ mainReducer: { isDesktop, user } }) => ({ isDesktop, user });

export default connect(mapStateToProps, mapDispatchToProps)(Calendar);