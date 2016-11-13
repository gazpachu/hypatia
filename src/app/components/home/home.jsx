import React, { Component, PropTypes } from 'react';
import { setLoading, setFilters } from '../../actions/actions';
import { connect } from 'react-redux';
import $ from 'jquery';
import Icon from '../common/lib/icon/icon';


class Home extends Component {
    
	constructor(props) {
		super(props);
	}
	
	componentDidMount() {
		this.props.setLoading(false);  // Move this to API callback when implemented (if ever)
		$('.js-main').removeClass().addClass('main js-main home-page');
	}
	
	render() {
		return (
            <section className="home page container-fluid">
				<h1>Hello World! Are you ready for realtime education?</h1>
            </section>
		)
	}
}

const mapDispatchToProps = {
	setLoading
}

const mapStateToProps = ({ mainReducer: { isDesktop } }) => ({ isDesktop });

export default connect(mapStateToProps, mapDispatchToProps)(Home);