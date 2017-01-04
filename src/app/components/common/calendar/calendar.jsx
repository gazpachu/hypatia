import React, { Component, PropTypes } from 'react';
import { setLoading } from '../../../actions/actions';
import classNames from 'classnames';
import {connect} from 'react-redux';
import { googleConfig } from '../../../constants/google';
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
	
	componentDidMount() {
		
	}
	
	render() {
		return (
            <section className={`calendar-panel ${this.props.class}`}>
				<h4 className="panel-heading">Calendar</h4>
           		<p>Sorry, this feature will be available in the following weeks.</p>
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