import React, { Component, PropTypes } from 'react';
import $ from 'jquery';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { firebase, helpers } from 'redux-react-firebase';
import Breadcrumbs from '../breadcrumbs/breadcrumbs';
import { ADMIN_LEVEL } from '../../../../core/constants/constants';
import Search from '../search/search';
import Icon from '../../../../core/common/lib/icon/icon';
import Trophy from '../../../../../../static/svg/trophy.svg';
import Calendar from '../../../../../../static/svg/calendar.svg';
import Info from '../../../../../../static/svg/info.svg';
import SearchIcon from '../../../../../../static/svg/search.svg';
import Close from '../../../../../../static/svg/x.svg';
import Forward from '../../../../../../static/svg/forward.svg';
import Chat from '../../../../../../static/svg/chat.svg';
import Course from '../../../../../../static/svg/course.svg';
import Subject from '../../../../../../static/svg/subject.svg';
import Module from '../../../../../../static/svg/module.svg';
import Activity from '../../../../../../static/svg/activity.svg';
import Post from '../../../../../../static/svg/post.svg';
import Admin from '../../../../../../static/svg/cog.svg';
import Dashboard from '../../../../../../static/svg/dashboard.svg';
import Team from '../../../../../../static/svg/team.svg';
import Account from '../../../../../../static/svg/account.svg';

const defaultProps = {
  nav_items: [
    {
      id: 0,
      title: 'Dashboard',
      icon: Dashboard,
      link: '/dashboard'
    }, {
      id: 12,
      title: 'Account',
      icon: Account,
      children: [
        {
          id: 13,
          title: 'My account',
          link: '/account'
        }
      ]
    }, {
      id: 1,
      title: 'Courses',
      icon: Course,
      link: '/courses'
    }, {
      id: 2,
      title: 'Subjects',
      icon: Subject,
      link: '/subjects'
    }, {
      id: 3,
      title: 'Modules',
      icon: Module,
      link: '/modules'
    }, {
      id: 4,
      title: 'Activities',
      icon: Activity,
      link: '/activities'
    }, {
      id: 5,
      title: 'Blog',
      icon: Post,
      link: '/blog'
    }, {
      id: 6,
      title: 'About',
      icon: Team,
      children: [
        {
          id: 7,
          title: 'Summary',
          link: '/about'
        }, {
          id: 8,
          title: 'Jobs',
          link: '/about/jobs'
        }, {
          id: 10,
          title: 'Contact',
          link: '/about/contact'
        }
      ]
    }, {
      id: 11,
      title: 'Admin',
      icon: Admin,
      link: '/admin',
      level: ADMIN_LEVEL
    }
  ]
};

const propTypes = {
  nav_items: PropTypes.array.isRequired,
  location: PropTypes.object.isRequired,
  toggleNav: PropTypes.func.isRequired,
  toggleSearch: PropTypes.func.isRequired,
  closeSearch: PropTypes.func.isRequired
};

const { dataToJS } = helpers;

@connect(state => ({
  userID: state.mainReducer.user
    ? state.mainReducer.user.uid
    : null,
  userData: dataToJS(state.firebase, `users/${state.mainReducer.user
    ? state.mainReducer.user.uid
    : null}`)
}))
@firebase(props => ([`users/${props.userID}`]))
class Navigation extends Component {

  static clickItem(event) {
    const $el = $(event.currentTarget).closest('.nav-item');
    $el.toggleClass('opened');
  }

  constructor(props) {
    super(props);

    this.renderItem = this.renderItem.bind(this);
  }

  renderItem(item, i) {
    // let itemActive = (this.props.location.pathname === item.link)
    //    ? 'active'
    //    : '',
    const hasChildren = (item.children)
        ? 'has-children'
        : '';

    return (!item.level || (item.level && this.props.userData && this.props.userData.info && item.level <= this.props.userData.info.level))
      ? <li key={i} className={`nav-item ${hasChildren}`}>
        {(item.icon)
          ? <Icon glyph={item.icon} className="icon item-icon" />
          : ''}
        {(item.children)
          ? <button className="title" onClick={Navigation.clickItem}>
            {item.title}<Icon glyph={Forward} className="icon arrow" />
          </button>
          : <Link to={item.link} className="title" onClick={this.props.toggleNav}>{item.title}</Link>}
        {(item.children)
          ? <ul className="nav-children">
            {item.children.map(child => <li key={child.id} className="nav-child">
              <Link to={child.link} onClick={this.props.toggleNav}>{child.title}</Link>
            </li>)}
          </ul>
          : ''}
      </li>
      : '';
  }

  render() {
    return (
      <nav className="navigation">
        <Breadcrumbs location={this.props.location} setItem={this.setItem} resetNav={this.resetNav} />
        <div className="sidenav js-sidenav flyout">
          <button
            className="mobile-close" onClick={() => {
              this.props.toggleNav();
            }}
          >
            <Icon glyph={Close} className="icon close" />
          </button>
          <table className="mobile-nav-items">
            <tbody>
              <tr>
                <td>
                  <button
                    className="mobile-nav-item" onClick={() => {
                      this.props.toggleNav();
                    }}
                  >
                    <Icon glyph={Calendar} className="icon calendar" />
                  </button>
                </td>
                <td>
                  <button
                    className="mobile-nav-item" onClick={() => {
                      this.props.toggleNav();
                    }}
                  >
                    <Icon glyph={Trophy} className="icon trophy" />
                  </button>
                </td>
                <td>
                  <button
                    className="mobile-nav-item" onClick={() => {
                      this.props.toggleNav();
                    }}
                  >
                    <Icon glyph={Info} className="icon info" />
                  </button>
                </td>
                <td>
                  <button
                    className="mobile-nav-item" onClick={() => {
                      this.props.toggleSearch();
                    }}
                  >
                    <Icon glyph={SearchIcon} className="icon search" />
                  </button>
                </td>
                <td>
                  <button className="mobile-nav-item"><Icon glyph={Chat} /></button>
                </td>
              </tr>
            </tbody>
          </table>
          <div className="nav-scroll">
            <ul className="nav-items">
              {this.props.nav_items
                ? this.props.nav_items.map((item, i) => this.renderItem(item, i))
                : ''}
            </ul>
          </div>
        </div>
        <Search closeSearch={this.props.closeSearch} />
      </nav>
    );
  }
}

Navigation.propTypes = propTypes;
Navigation.defaultProps = defaultProps;

const mapStateToProps = ({
  mainReducer: {
    user
  }
}) => ({ user });

export default connect(mapStateToProps)(Navigation);
