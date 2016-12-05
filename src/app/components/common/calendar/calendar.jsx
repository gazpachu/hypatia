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
				<iframe src="https://calendar.google.com/calendar/embed?height=600&amp;wkst=2&amp;hl=en_GB&amp;bgcolor=%23FFFFFF&amp;src=grqenv2sij4udp4p9maki8k6fo%40group.calendar.google.com&amp;color=%232952A3&amp;ctz=Europe%2FMadrid" width="70%" height="600" frameBorder="0" scrolling="no"></iframe>
           
           		<div className="sidebar">
           			<div className="subjects">
           				<h2 className="heading">Subjects</h2>
           				<ul className="items">
           					<li className="item">Show all / hide all</li>
           					<li className="item">Maths</li>
           					<li className="item">English Literature</li>
           					<li className="item">Graphic design</li>
           					<li className="item">Physics</li>
           				</ul>
           			</div>
           			<div className="activities">
           				<h2 className="heading">Activities</h2>
           				<ul className="items">
           					<li className="item">Show all / hide all</li>
           					<li className="item">Start module</li>
           					<li className="item">End module</li>
           					<li className="item">Start activity</li>
           					<li className="item">End activity</li>
           					<li className="item">Grade</li>
           				</ul>
           			</div>
           		</div>
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