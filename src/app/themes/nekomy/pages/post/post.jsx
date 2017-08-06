import React, { Component } from 'react';
import { connect } from 'react-redux';
import { firebase, helpers } from 'redux-react-firebase';
import classNames from 'classnames';
import moment from 'moment';
import $ from 'jquery';
import * as CONSTANTS from '../../../../core/constants/constants';
import { setLoading } from '../../../../core/actions/actions';
import Edit from '../../../../core/common/lib/edit/edit';

const { isLoaded, isEmpty, dataToJS } = helpers;

@connect(state => ({
  post: dataToJS(state.firebase, 'posts'),
  files: dataToJS(state.firebase, 'files'),
  userID: state.mainReducer.user
    ? state.mainReducer.user.uid
    : '',
  userData: dataToJS(state.firebase, `users/${state.mainReducer.user
    ? state.mainReducer.user.uid
    : ''}`)
}))
@firebase(props => ([
  `posts#orderByChild=slug&equalTo=${window.location.href.substr(window.location.href.lastIndexOf('/') + 1)}`,
  'files',
  `users/${props.userID}`
]))
class Post extends Component {

  componentDidMount() {
    this.props.setLoading(false);
    $('.js-main').removeClass().addClass('main js-main post-page');
  }

  render() {
    let post = null;
    let featuredImage = null;

    if (isLoaded(this.props.post) && isLoaded(this.props.files) && !isEmpty(this.props.post)) {
      Object.keys(this.props.post).map((key) => {
        post = this.props.post[key];
        if (post.featuredImage) {
          Object.keys(this.props.files).map((fileKey) => {
            if (fileKey === post.featuredImage) {
              featuredImage = this.props.files[fileKey];
            }
            return false;
          });
        }
        return false;
      });
    }

    return (
      <section className="page post">
        {post
          ? <div className="page-wrapper">
            <h1 className="title">{post.title}</h1>
            <div className="meta">
              <div className="date">{moment(post.date).format('Do MMMM YYYY, h:mm a')}</div>
              {isLoaded(this.props.userData) && !isEmpty(this.props.userData) && this.props.userData.info.level >= CONSTANTS.ADMIN_LEVEL
                ? <Edit editLink={`/admin/posts/edit/${post.slug}`} newLink="/admin/posts/new" />
                : ''}
            </div>
            <div
              className={classNames('columns', {
                'single-column': (!post.content2 && !post.content2)
              })}
            >
              <div className="column page-content">
                {featuredImage
                  ? <img className="featured-image" src={featuredImage.url} alt="" />
                  : ''}
                <div
                  className="content" dangerouslySetInnerHTML={{
                    __html: CONSTANTS.converter.makeHtml(post.content1)
                  }}
                />
              </div>
              {post.content2
                ? <div className="column page-sidebar">
                  <div
                    className="content" dangerouslySetInnerHTML={{
                      __html: CONSTANTS.converter.makeHtml(post.content2)
                    }}
                  />
                </div>
                : ''}
              {post.content3
                ? <div className="column page-sidebar">
                  <div
                    className="content" dangerouslySetInnerHTML={{
                      __html: CONSTANTS.converter.makeHtml(post.content3)
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
    isDesktop
  }
}) => ({ isDesktop });

export default connect(mapStateToProps, mapDispatchToProps)(Post);
