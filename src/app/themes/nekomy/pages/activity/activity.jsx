import React, { Component } from 'react';
import { connect } from 'react-redux';
import { firebase, helpers } from 'redux-react-firebase';
import classNames from 'classnames';
import moment from 'moment';
import $ from 'jquery';
import { setLoading } from '../../../../core/actions/actions';
import * as CONSTANTS from '../../../../core/constants/constants';
import Edit from '../../../../core/common/lib/edit/edit';
import Icon from '../../../../core/common/lib/icon/icon';
import Professor from '../../../../../../static/svg/professor.svg';
import Calendar from '../../../../../../static/svg/calendar2.svg';

const { isLoaded, isEmpty, dataToJS } = helpers;

@connect(state => ({
  activity: dataToJS(state.firebase, 'activities'),
  files: dataToJS(state.firebase, 'files'),
  users: dataToJS(state.firebase, 'users'),
  userID: state.mainReducer.user
    ? state.mainReducer.user.uid
    : '',
  userData: dataToJS(state.firebase, `users/${state.mainReducer.user
    ? state.mainReducer.user.uid
    : ''}`)
}))
@firebase(props => ([
  `activities#orderByChild=slug&equalTo=${window.location.href.substr(window.location.href.lastIndexOf('/') + 1)}`,
  'files',
  'users',
  `users/${props.userID}`
]))
class Activity extends Component {

  componentDidMount() {
    this.props.setLoading(false);
    $('.js-main').removeClass().addClass('main js-main activity-page');
  }

  render() {
    let activity = null;
    let featuredImage = null;
    let authors = '';

    if (isLoaded(this.props.activity) && isLoaded(this.props.files) && isLoaded(this.props.users) && !isEmpty(this.props.activity) && !isEmpty(this.props.files) && !isEmpty(this.props.users)) {
      Object.keys(this.props.activity).map((key) => {
        activity = this.props.activity[key];
        if (activity.featuredImage) {
          Object.keys(this.props.files).map((fileKey) => {
            if (fileKey === activity.featuredImage) {
              featuredImage = this.props.files[fileKey];
            }
            return false;
          });
        }
        if (activity.authors) {
          for (let i = 0; i < activity.authors.length; i += 1) {
            const author = this.props.users[activity.authors[i]];
            if (author) {
              authors += `${author.info.firstName} ${author.info.lastName1}`;
              if (i < activity.authors.length - 1) {
                authors += ', ';
              }
            }
          }
        }
        return false;
      });
    }

    return (
      <section className="page activity">
        {activity
          ? <div className="page-wrapper">
            <h1 className="title">{activity.title}</h1>
            <div className="meta">
              {authors
                ? <div className="author"><Icon glyph={Professor} />{authors}</div>
                : ''}
              <Icon glyph={Calendar} />From
              <span className="date">{moment(activity.startDate).format('D MMMM YYYY')}</span>
              until
              <span className="date">{moment(activity.endDate).format('D MMMM YYYY')}</span>
              {isLoaded(this.props.userData) && !isEmpty(this.props.userData) && this.props.userData.info.level >= CONSTANTS.ADMIN_LEVEL
                ? <Edit editLink={`/admin/activities/edit/${activity.slug}`} newLink="/admin/activities/new" />
                : ''}
            </div>
            <div
              className={classNames('columns', {
                'single-column': (!activity.content2 && !activity.content2)
              })}
            >
              <div className="column page-content">
                {featuredImage
                  ? <img alt="" className="featured-image" role="presentation" src={featuredImage.url} />
                  : ''}
                <div
                  className="content"
                  dangerouslySetInnerHTML={{
                    __html: CONSTANTS.converter.makeHtml(activity.content1)
                  }}
                />
              </div>
              {activity.content2
                ? <div className="column page-sidebar">
                  <div
                    className="content"
                    dangerouslySetInnerHTML={{
                      __html: CONSTANTS.converter.makeHtml(activity.content2)
                    }}
                  />
                </div>
                : ''}
              {activity.content3
                ? <div className="column page-sidebar">
                  <div
                    className="content"
                    dangerouslySetInnerHTML={{
                      __html: CONSTANTS.converter.makeHtml(activity.content3)
                    }}
                  />
                </div>
                : ''}
            </div>
          </div>
        : <div className="loader-small" />}
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
    userData
  }
}) => ({ isDesktop, userData });

export default connect(mapStateToProps, mapDispatchToProps)(Activity);
