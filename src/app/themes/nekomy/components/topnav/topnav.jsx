import React, { Component } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import $ from 'jquery';
import md5 from 'md5';
import { firebase, helpers } from 'redux-react-firebase';
import { setUser, setPanel, setNotification } from '../../../../core/actions/actions';
import Navigation from '../navigation/navigation';
import Signup from '../signup/signup';
import Signin from '../signin/signin';
import Icon from '../../../../core/common/lib/icon/icon';
import Logo from '../../../../../../static/svg/logo.svg';
import LogoWording from '../../../../../../static/svg/logo-wording.svg';
import Avatar from '../../../../../../static/svg/avatar.svg';
import Trophy from '../../../../../../static/svg/trophy.svg';
import Calendar from '../../../../../../static/svg/calendar.svg';
import Help from '../../../../../../static/svg/question.svg';
import Search from '../../../../../../static/svg/search.svg';
import Close from '../../../../../../static/svg/x.svg';
import Logout from '../../../../../../static/svg/logout.svg';
import Chat from '../../../../../../static/svg/chat.svg';

const { pathToJS } = helpers;

@firebase()
@connect(state => ({
  user: pathToJS(state.firebase, 'auth'),
  userData: pathToJS(state.firebase, 'userData')
}))
class TopNav extends Component {

  static toggleView(e) {
    if ($(e.currentTarget).is(':checked')) {
      $('.js-page').addClass('list-view');
    } else {
      $('.js-page').removeClass('list-view');
    }
  }

  static showForm(event) {
    $('.user-form').removeClass('active');
    $(event.target).next().addClass('active');
    $('.js-overlay').show().animateCss('fade-in');
  }

  static closeForm() {
    $('.user-form').removeClass('active');
    $('.js-overlay').animateCss('fade-out', () => $('.js-overlay').hide());
  }

  constructor(props) {
    super(props);

    this.state = {
      avatar: '',
      searching: false,
      navigating: false
    };

    this.toggleNav = this.toggleNav.bind(this);
    this.openNav = this.openNav.bind(this);
    this.closeNav = this.closeNav.bind(this);
    this.toggleSearch = this.toggleSearch.bind(this);
    this.openSearch = this.openSearch.bind(this);
    this.closeSearch = this.closeSearch.bind(this);
  }

  componentDidUpdate() {
    if (this.props.isDesktop === true) {
      $('#mode').prop('checked', false);
      $('.js-page').removeClass('list-view');
    } else if (this.props.isDesktop === false) {
      $('#mode').prop('checked', true);
      $('.js-page').addClass('list-view');
    }
  }

  toggleNav() {
    if (!$('.js-sidenav').hasClass('opened')) {
      this.openNav();
    } else {
      this.closeNav();
    }
  }

  openNav() {
    if (!$('.js-sidenav').hasClass('opened')) {
      $('.flyout').removeClass('opened');
      $('.js-overlay').show().animateCss('fade-in');
      $('.js-sidenav').addClass('opened').removeClass('closed');
      $('.js-nav-icon').addClass('opened');
      $('.js-dropdown-panel').removeClass('open');
      this.setState({ searching: false, navigating: true });
    }
  }

  closeNav() {
    if ($('.js-sidenav').hasClass('opened')) {
      $('.js-sidenav').removeClass('opened').addClass('closed');
      $('.js-overlay').click();
      $('.js-nav-icon').removeClass('opened');
      this.setState({ searching: false, navigating: false });
    }
  }

  toggleSearch() {
    if (!$('.js-search-panel').hasClass('opened')) {
      this.openSearch();
    } else {
      this.closeSearch();
    }
  }

  openSearch() {
    const $searchPanel = $('.js-search-panel');
    if (!$searchPanel.hasClass('opened')) {
      $('.flyout').removeClass('opened');
      $searchPanel.addClass('opened').removeClass('closed');
      $('.js-nav-icon').removeClass('opened');
      $('.js-overlay').show().animateCss('fade-in');
      $('.search-input').focus();
      $('.js-dropdown-panel').removeClass('open');
      this.setState({ searching: true, navigating: false });
    }
  }

  closeSearch() {
    const $searchPanel = $('.js-search-panel');
    if ($searchPanel.hasClass('opened')) {
      $searchPanel.removeClass('opened').addClass('closed');
      $('.js-overlay').click();
      this.setState({ searching: false, navigating: false });
    }
  }

  changePanel(panel) {
    this.closeNav();
    this.closeSearch();

    if (this.props.panel === panel) {
      this.props.setPanel('');
    } else {
      this.props.setPanel(panel);
    }
  }

  render() {
    return (
      <section className="top-nav js-top-nav">
        <div className="top-nav-bar">
          <button
            className="top-nav-item nav-icon js-nav-icon" onClick={() => {
              this.toggleNav();
            }}
          >
            <span />
            <span />
            <span />
            <span />
          </button>
          <button
            className="top-nav-item" onClick={() => {
              this.toggleSearch();
            }}
          >
            {this.state.searching
              ? <Icon glyph={Close} className="icon close-search" />
              : <Icon glyph={Search} className="icon search" />}
          </button>

          {(this.props.user)
            ? <button
              className="top-nav-item" onClick={() => {
                this.changePanel('calendar');
              }}
            >
              {this.props.panel === 'calendar'
                ? <Icon glyph={Close} />
                : <Icon glyph={Calendar} className="icon calendar" />}
            </button>
            : ''}

          {(this.props.user)
            ? <button
              className="top-nav-item" onClick={() => {
                this.changePanel('grades');
              }}
            >
              {this.props.panel === 'grades'
                ? <Icon glyph={Close} />
                : <Icon glyph={Trophy} className="icon trophy" />}
            </button>
            : ''}

          {(this.props.user)
            ? <button
              className="top-nav-item" onClick={() => {
                this.changePanel('help');
              }}
            >
              {this.props.panel === 'help'
                ? <Icon glyph={Close} />
                : <Icon glyph={Help} className="icon info" />}
            </button>
            : ''}

          <Link to="/" className="logo">
            <Icon glyph={Logo} />
            <Icon glyph={LogoWording} className="icon logo-wording" />
          </Link>

          {(!this.props.user || (this.props.user && !this.props.user.emailVerified))
            ? <div className="user-controls">
              <div className="lang">EN</div>
              <div className="user-controls-cta sign-up-cta">
                <button onClick={TopNav.showForm}>Sign up</button>
                <Signup />
              </div>
              <div className="user-controls-cta sign-in-cta">
                <button onClick={TopNav.showForm}>Sign in</button>
                <Signin />
              </div>
            </div>
          : <div className="user-controls">
            <div className="lang">EN</div>
            <button
              className="chat-icon" onClick={() => {
                this.changePanel('chat');
              }}
            >
              {this.props.panel === 'chat'
              ? <Icon glyph={Close} className="icon close-chat" />
              : <Icon glyph={Chat} className="icon chat" />}
            </button>

            <div className="user-controls-cta account-cta">
              {(this.props.user)
                ? <Link to="/dashboard">
                  {(this.props.user.email)
                    ? <img alt="" className="photo" role="presentation" src={`https://www.gravatar.com/avatar/${md5(this.props.user.email)}.jpg?s=20`} />
                    : <Icon glyph={Avatar} />}
                  <span>{this.props.userData && this.props.userData.info
                      ? this.props.userData.info.displayName
                      : ''}</span>
                </Link>
                : ''}
              <button
                onClick={() => {
                  this.props.firebase.auth().signOut();
                  this.props.setUser(null);
                }}
              >
                <Icon glyph={Logout} className="icon sign-out" />
              </button>
            </div>
          </div>
        }
        </div>
        <Navigation
          location={this.props.location}
          toggleNav={this.toggleNav}
          openNav={this.openNav}
          closeNav={this.closeNav}
          toggleSearch={this.toggleSearch}
          openSearch={this.openSearch}
          closeSearch={this.closeSearch}
          searching={this.state.searching}
          navigating={this.state.navigating}
        />
        <button
          className="overlay js-overlay" onClick={() => {
            this.closeNav();
            this.closeSearch();
            TopNav.closeForm();
          }}
        />
      </section>
    );
  }
}

const mapStateToProps = ({
  mainReducer: {
    user,
    panel
  }
}) => ({ user, panel });

const mapDispatchToProps = {
  setUser,
  setPanel,
  setNotification
};

export default connect(mapStateToProps, mapDispatchToProps)(TopNav);
