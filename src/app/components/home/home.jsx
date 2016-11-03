import React, { Component, PropTypes } from 'react';
import $ from 'jquery';
import Button from '../common/lib/button/button';
import Icon from '../common/lib/icon/icon';

import Menu from '../../../../static/menu.svg';
import Search from '../../../../static/search.svg';
import Filter from '../../../../static/filter.svg';
import Log from '../../../../static/log.svg';
import Download from '../../../../static/download.svg';
import StarOutline from '../../../../static/star-outline.svg';
import Star from '../../../../static/star.svg';
import Share from '../../../../static/share.svg';
import Mail from '../../../../static/mail.svg';
import LighthouseLogo from '../../../../static/lighthouse-logo.svg';


class Home extends Component {
    
	constructor(props) {
		super(props);
	}
	
	componentDidMount() {
		this.props.setLoading(false);  // Move this to API callback when implemented (if ever)
	}
	
	render() {
		return (
            <section className="home page container-fluid">	
				Hello World!
            </section>
		)
	}
}

export default Home;
