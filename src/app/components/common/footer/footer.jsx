import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import $ from 'jquery';
import Icon from '../lib/icon/icon';
import Logo from '../../../../../static/svg/logo.svg';

const defaultProps = {
	
};

const propTypes = {
	
};

class Footer extends Component {
    
	constructor(props) {
		super(props);
	}
	
	render() {
		return (
            <section className="footer">
				<span>Hypatia LMS <Icon glyph={Logo} /> 2016 - 2017. Licensed under GPLv2. More info at <a href="http://theonapps.github.io/hypatia/">theonapps.github.io/hypatia/</a></span>
            </section>
		)
	}
}

Footer.propTypes = propTypes;
Footer.defaultProps = defaultProps;

export default Footer;