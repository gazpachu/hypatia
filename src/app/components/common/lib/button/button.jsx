import React, { Component, PropTypes } from 'react';
import Icon from '../icon/icon';

const defaultProps = {
	iconpos: 'left',
	className: 'btn btn-primary'
};

const propTypes = {
	text: React.PropTypes.string.isRequired,
	width: React.PropTypes.number,
	height: React.PropTypes.number
};

class Button extends Component {

	constructor(props) {
		super(props);
	}
	
	render() {
		let icon = <Icon glyph={this.props.icon} width={this.props.width} height={this.props.height} />;
		return (
			<button className={this.props.className} id={this.props.id} onClick={this.props.onClick}>
				{this.props.icon && this.props.iconpos == 'left' ? icon : ''}<span>{this.props.text}</span>{this.props.icon && this.props.iconpos == 'right' ? icon : ''}
			</button>
		);
	}
}

Button.propTypes = propTypes;
Button.defaultProps = defaultProps;

export default Button;