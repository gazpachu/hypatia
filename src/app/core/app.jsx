import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import firebase from 'firebase';
import debounce from 'lodash.debounce';
import Helmet from 'react-helmet';
import { setUser, setUserData, changeViewport, setPanel, setNotification } from './actions/actions';
import { USER_CONFIRM_EMAIL } from './constants/constants';
import TopNav from '../themes/nekomy/components/topnav/topnav';
import Loader from '../themes/nekomy/components/loader/loader';
import Chat from '../themes/nekomy/components/chat/chat';
import Calendar from '../themes/nekomy/components/calendar/calendar';
import Grades from '../themes/nekomy/components/grades/grades';
import Help from '../themes/nekomy/components/help/help';
import Footer from '../themes/nekomy/components/footer/footer';
import Notification from '../themes/nekomy/components/notification/notification';

const defaultProps = {
  breadcrumbs: []
};

const propTypes = {
  breadcrumbs: PropTypes.array
};

class App extends Component {

  componentDidMount() {
    this.onResize();
    window.onresize = debounce(() => this.onResize(), 500);

    this.removeListener = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        if (user.emailVerified) {
          this.props.setUser(user);
          firebase.database().ref(`/users/${user.uid}`).once('value').then((snapshot) => {
            if (snapshot.val()) {
              this.props.setUserData(snapshot.val());
            }
          });
        } else {
          this.props.setNotification({ message: USER_CONFIRM_EMAIL, type: 'info' });
        }
      }
    });
  }

  componentWillUnmount() {
    this.removeListener();
  }

  onResize() {
    const isDesktop = window.innerWidth > 768;
    this.props.changeViewport(isDesktop);
  }

  render() {
    const title = (!this.props.breadcrumbs[0])
      ? 'Nekomy'
      : `${this.props.breadcrumbs.reverse().join(' < ')} < Nekomy`;

    const panelClass = (this.props.panel === '')
      ? ''
      : 'open';

    const pageClass = document.querySelector('.page');
    if (pageClass) {
      pageClass.style.position = (panelClass === 'open')
        ? 'fixed'
        : 'relative';
    }

    return (
      <div>
        <Helmet title={String(title)} />

        <div className="main js-main">
          <Loader />
          <Notification />
          <TopNav location={this.props.location} />
          <div className="main-background" />
          <div className={`dropdown-panel js-dropdown-panel ${panelClass}`}>
            <Chat
              class={(this.props.panel === 'chat')
              ? 'open'
              : ''} location={this.props.location}
            />
            <Calendar
              class={(this.props.panel === 'calendar')
              ? 'open'
              : ''}
            />
            <Grades
              class={(this.props.panel === 'grades')
              ? 'open'
              : ''}
            />
            <Help
              class={(this.props.panel === 'help')
              ? 'open'
              : ''}
            />
          </div>
          {React.cloneElement(this.props.children, this.props)}
          <Footer />
        </div>
      </div>
    );
  }
}

App.propTypes = propTypes;
App.defaultProps = defaultProps;

const mapStateToProps = ({
  mainReducer: {
    breadcrumbs,
    user,
    panel
  }
}) => ({ breadcrumbs, user, panel });

const mapDispatchToProps = {
  changeViewport,
  setUser,
  setUserData,
  setPanel,
  setNotification
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
