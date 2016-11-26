import React, { Component, PropTypes } from 'react';
import { setLoading } from '../../../actions/actions';
import {connect} from 'react-redux';
import $ from 'jquery';
import moment from 'moment';
import Icon from '../lib/icon/icon'; 

class Chat extends Component {
    
	constructor(props) {
		super(props);
	}
	
	componentDidMount() {
		
	}
	
	render() {
		return (
            <section className="chat">
				<div className="messages"></div>
				<input type="text" />
            </section>
		)
	}
}

const mapDispatchToProps = {
	setLoading
}

const mapStateToProps = ({ mainReducer: { isDesktop } }) => ({ isDesktop });

export default connect(mapStateToProps, mapDispatchToProps)(Chat);