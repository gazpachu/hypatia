import React, { Component } from 'react';
import { connect } from 'react-redux';
import { setLoading } from '../../../../core/actions/actions';

class Help extends Component {

  componentDidMount() {}

  render() {
    return (
      <section className={`help-panel ${this.props.class}`}>
        <h4 className="panel-heading">Questions &amp; Answers</h4>
        <p>Sorry, this feature will be available in the following weeks.</p>
      </section>
    );
  }
}

const mapDispatchToProps = {
  setLoading
};

const mapStateToProps = ({
  mainReducer: {
    isDesktop,
    user
  }
}) => ({ isDesktop, user });

export default connect(mapStateToProps, mapDispatchToProps)(Help);
