import React, { Component, PropTypes } from 'react';
import Icon from '../icon/icon';

const defaultProps = {
	iconpos: 'left',
	className: 'btn btn-primary'
};

const propTypes = {
	href: React.PropTypes.string.isRequired,
	text: React.PropTypes.string.isRequired
};

class Link extends Component {

	constructor(props) {
		super(props);
	}
	
	render() {
		return (
			<a href={this.props.href} className={this.props.className} id={this.props.id}>
				{this.props.icon && this.props.iconpos == 'left' ? <Icon glyph={this.props.icon} /> : ''}<span>{this.props.text}</span>{this.props.icon && this.props.iconpos == 'right' ? <Icon glyph={this.props.icon} /> : ''}
			</a>
		);
	}
}

Link.propTypes = propTypes;
Link.defaultProps = defaultProps;

export default Link;