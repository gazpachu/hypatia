import React, { Component } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { setLoading } from '../../../../core/actions/actions';

class NotFound extends Component {

  componentDidMount() {
    const el = document.querySelector('.js-main');
    this.props.setLoading(false);
    el.classList = '';
    el.classList.add('main', 'js-main', 'not-found-page');
  }

  render() {
    return (
      <section className="notFound page static-page">
        <div className="page-wrapper">
          <h1 className="title">Page not found :-(</h1>
          <div className="columns single-column">
            <div className="column page-content">
              <p>Sorry!, Nekomy is still under construction<br />Please check again later. Thanks!</p>
              <img alt="" src="/static/img/404.png" />
              <Link to="/">
                <button className="btn btn-primary">Go back to the home page</button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    );
  }
}

const mapStateToProps = null;

const mapDispatchToProps = {
  setLoading
};

export default connect(mapStateToProps, mapDispatchToProps)(NotFound);
