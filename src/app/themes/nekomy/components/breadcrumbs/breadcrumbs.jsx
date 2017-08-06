import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { history } from '../../../../store';
import Helpers from '../../../../core/common/helpers';
import { setBreadcrumbs } from '../../../../core/actions/actions';

class Breadcrumbs extends Component {

  constructor(props) {
    super(props);

    this.state = {
      initialised: false
    };
  }

  componentDidMount() {
    this.unlisten = history.listen((location) => {
      let newTrail = [];
      if (location.pathname !== '/') {
        newTrail = location.pathname.substring(1, location.pathname.lenght).split('/');
        for (let i = 0; i < newTrail.length; i += 1) {
          newTrail[i] = newTrail[i].charAt(0).toUpperCase() + newTrail[i].slice(1);
          newTrail[i] = newTrail[i].replace(/-/g, ' ');
        }
      }

      newTrail.reverse();
      this.props.setBreadcrumbs(newTrail);
    });
  }

  componentWillUnmount() {
    this.unlisten();
  }

  render() {
    let links = null;

    if (this.props.breadcrumbs) {
      links = this.props.breadcrumbs.map((item, i) => {
        let url = '';

        for (let j = 0; j < i + 1; j += 1) {
          url += `/${Helpers.slugify(this.props.breadcrumbs[j])}`;
        }

        return (<li className="item" key={item}>
          <Link to={url}>{item}</Link>
        </li>);
      });
    }

    return (
      <div className="breadcrumbs">
        <ul className="breadcrumbs-items">
          <li className="item">
            <Link to="/">Home</Link>
          </li>
          {links}
        </ul>
      </div>
    );
  }
}

const mapDispatchToProps = {
  setBreadcrumbs
};

const mapStateToProps = ({
  mainReducer: {
    breadcrumbs
  }
}) => ({ breadcrumbs });

export default connect(mapStateToProps, mapDispatchToProps)(Breadcrumbs);
