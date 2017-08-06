import React, { Component } from 'react';
import { connect } from 'react-redux';

class Loader extends Component {

  componentDidMount() {}

  render() {
    const isLoading = (this.props.isLoading)
      ? 'fade-in'
      : 'fade-out';

    return (
      <section className={`loader js-loader ${isLoading}`}>
        <div className="loader__circle" />
        <div className="loader__line-mask">
          <div className="loader__line" />
        </div>
      </section>
    );
  }
}

const mapStateToProps = ({
  mainReducer: {
    isLoading
  }
}) => ({ isLoading });

export default connect(mapStateToProps)(Loader);
