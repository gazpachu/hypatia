import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { setNotification } from '../../../../core/actions/actions';
import { animateCss, hideElem, showElem } from '../../../../core/common/helpers';
import Icon from '../../../../core/common/lib/icon/icon';
import Tick from '../../../../../../static/svg/tick.svg';
import Close from '../../../../../../static/svg/close.svg';
import Info from '../../../../../../static/svg/info.svg';

const defaultProps = {
  notification: {
    message: '',
    type: ''
  }
};

const propTypes = {
  notification: PropTypes.object
};

class Notification extends Component {

  componentWillReceiveProps(newProps) {
    if (newProps.notification.message !== '') {
      this.showNotification();
    }
  }

  showNotification() {
    const el = document.querySelector('.js-notification');

    setTimeout(() => {
      animateCss(showElem(el), 'slideInRight');
    }, 1000);

    setTimeout(() => {
      animateCss(el, 'slideOutRight', () => {
        hideElem(el);
        this.props.setNotification(defaultProps.notification);
      });
    }, 7000);
  }

  render() {
    return (
      <div className={`notification js-notification ${this.props.notification.type}`}>
        <Icon className="icon success-icon" glyph={Tick} />
        <Icon className="icon error-icon" glyph={Close} />
        <Icon className="icon info-icon" glyph={Info} />
        <span className="message">{this.props.notification.message}</span>
      </div>
    );
  }
}

Notification.propTypes = propTypes;
Notification.defaultProps = defaultProps;

const mapDispatchToProps = {
  setNotification
};

const mapStateToProps = ({
  mainReducer: {
    notification
  }
}) => ({ notification });

export default connect(mapStateToProps, mapDispatchToProps)(Notification);
