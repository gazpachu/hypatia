import React, { Component } from 'react';
import { connect } from 'react-redux';
import { setLoading } from '../../../../core/actions/actions';

class Notifications extends Component {

  componentDidMount() {
    this.props.setLoading(false); // Move this to API callback when implemented (if ever)
    const el = document.querySelector('.js-main');
    el.classList = '';
    el.classList.add('main', 'js-main', 'notifications-page');
  }

  render() {
    return (
      <section className="notifications page" />
    );
  }
}

const mapDispatchToProps = {
  setLoading
};

const mapStateToProps = null;
export default connect(mapStateToProps, mapDispatchToProps)(Notifications);
