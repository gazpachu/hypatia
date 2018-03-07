import React, { Component } from 'react';
import { connect } from 'react-redux';
import { firebase, helpers } from 'redux-react-firebase';
import omit from 'lodash.omit';
import classNames from 'classnames';
import SimpleMDE from 'react-simplemde-editor';
import Select2 from 'react-select2-wrapper';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import { history } from '../../store';
import { setLoading, setNotification } from '../actions/actions';
import * as CONSTANTS from '../constants/constants';
import ModalBox from '../common/modalbox/modalbox';
import AdminUsers from './adminUsers';
import { animateCss, copyTextToClipboard, hideElem, showElem, slugify } from '../common/helpers';
import Icon from '../common/lib/icon/icon';
import Add from '../../../../static/svg/add.svg';
import Calendar from '../../../../static/svg/calendar2.svg';
import User from '../../../../static/svg/users.svg';
import Level from '../../../../static/svg/level.svg';
import Group from '../../../../static/svg/group.svg';
import Course from '../../../../static/svg/course.svg';
import Subject from '../../../../static/svg/subject.svg';
import Module from '../../../../static/svg/module.svg';
import Activity from '../../../../static/svg/activity.svg';
import Post from '../../../../static/svg/post.svg';
import File from '../../../../static/svg/file.svg';
import LinkIcon from '../../../../static/svg/link.svg';
import Forward from '../../../../static/svg/forward.svg';

const { isLoaded, isEmpty, dataToJS } = helpers;

@connect(state => ({
  users: dataToJS(state.firebase, 'users'),
  levels: dataToJS(state.firebase, 'levels'),
  groups: dataToJS(state.firebase, 'groups'),
  courses: dataToJS(state.firebase, 'courses'),
  subjects: dataToJS(state.firebase, 'subjects'),
  modules: dataToJS(state.firebase, 'modules'),
  activities: dataToJS(state.firebase, 'activities'),
  posts: dataToJS(state.firebase, 'posts'),
  pages: dataToJS(state.firebase, 'pages'),
  files: dataToJS(state.firebase, 'files'),
  userID: state.mainReducer.user
    ? state.mainReducer.user.uid
    : '',
  userData: dataToJS(state.firebase, `users/${state.mainReducer.user
    ? state.mainReducer.user.uid
    : ''}`)
}))
@firebase(props => ([
  'users',
  'levels',
  'groups',
  'courses',
  'subjects',
  'modules',
  'activities',
  'posts',
  'pages',
  'files',
  `users/${props.userID}`
]))
class Admin extends Component {

  static formatFileType(state) {
    if (!state.id) {
      return state.text;
    }
    const contentType = state.text.substring(state.text.indexOf('[') + 1, state.text.indexOf(']'));
    const $state = document.createRange().createContextualFragment(`<span><img src="http://www.stdicon.com/crystal/${contentType}?size=24" class="select2-img" />${state.text.substring(state.text.indexOf(']') + 1, state.text.length)}</span>`);
    return $state;
  }

  constructor(props) {
    super(props);

    this.state = {
      action: '',
      type: '',
      selectedId: '',
      selectedItem: null,
      modalTitle: '',
      fileMetadata: null,
      loadedPath: null
    };

    this.storageRef = this.props.firebase.storage().ref();
    this.tempFile = null;
    this.uploadStatus = '';
    this.uploadTask = null;
    this.selectedImage = null;

    this.updateItem = this.updateItem.bind(this);
    this.modalBoxAnswer = this.modalBoxAnswer.bind(this);
  }

  componentDidMount() {
    this.props.setLoading(false);
    const el = document.querySelector('.js-main');
    el.classList = '';
    el.classList.add('main', 'js-main', 'admin-page');
  }

  componentWillReceiveProps(newProps) {
    if (newProps.location.pathname !== this.state.loadedPath) {
      if (newProps.params.type && newProps.params.action) {
        if (isLoaded(newProps[newProps.params.type])) {
          if (newProps.params.action === 'new') {
            this.setState({
              loadedPath: newProps.location.pathname
            }, () => {
              this.new(newProps.params.type, true);
            });
          } else if (newProps.params.action === 'edit' && newProps.params.slug) {
            let id = null;
            Object.keys(newProps[newProps.params.type]).map((key) => {
              if (newProps.params.type === 'users' && key === newProps.params.slug) {
                id = key;
              } else if (newProps[newProps.params.type][key].slug === newProps.params.slug) {
                id = key;
              }
              return null;
            });

            if (id) {
              this.setState({
                loadedPath: newProps.location.pathname
              }, () => {
                this.loadItem(id, newProps.params.action, newProps.params.type);
              });
            }
          }
        }
      } else {
        this.setState({
          loadedPath: newProps.location.pathname
        }, () => {
          this.cancel(true);
        });
      }
    }
  }

  handleSelect(event, action, type) {
    if (this.uploadStatus === '') {
      const index = event.target.selectedIndex;
      this.reset();
      event.target.selectedIndex = index;
      this.loadItem(event.target.value, action, type);
    }
  }

  loadItem(id, action, type) {
    if (id !== '') {
      const selectedItem = this.props[type][id];

      this.setState({
        action,
        type,
        selectedId: id,
        selectedItem
      }, () => {
        if (type !== 'users') {
          history.push(`/admin/${type}/edit/${selectedItem.slug}`);
        } else {
          history.push(`/admin/${type}/edit/${id}`);
        }

        if (type === 'files') {
          // Load file meta data
          const fileRef = this.storageRef.child(`files/${this.state.selectedItem.file}`);
          fileRef.getMetadata().then((metadata) => {
            this.setState({ fileMetadata: metadata });
          }).catch((error) => {
            this.props.setNotification({ message: error, type: 'error' });
          });
        }
      });
    }
  }

  new(type, skipUpdateHistory) {
    if (this.uploadStatus === '') {
      this.setState({
        action: 'new',
        type
      }, () => {
        if (!skipUpdateHistory) {
          this.cancel(true);
          history.push(`/admin/${type}/new`);
        }
      });
    }
  }

  cancel(skipUpdateHistory) {
    this.setState({
      action: '',
      type: '',
      selectedId: '',
      selectedItem: null
    }, () => {
      if (!skipUpdateHistory) {
        this.reset();
        history.push('/admin');
      }
    });
  }

  reset() {
    this.refs['users-select'].selectedIndex = 0;
    this.refs['levels-select'].selectedIndex = 0;
    this.refs['groups-select'].selectedIndex = 0;
    this.refs['courses-select'].selectedIndex = 0;
    this.refs['subjects-select'].selectedIndex = 0;
    this.refs['modules-select'].selectedIndex = 0;
    this.refs['activities-select'].selectedIndex = 0;
    this.refs['posts-select'].selectedIndex = 0;
    this.refs['pages-select'].selectedIndex = 0;
    this.refs['files-select'].selectedIndex = 0;
  }

  save() {
    if (this.props.userData.info.level === CONSTANTS.ADMIN_LEVEL) {
      const item = this.state.selectedItem;
      const method = (this.state.action === 'new')
        ? 'push'
        : 'set';
      const path = (this.state.action === 'new')
        ? this.state.type
        : `${this.state.type}/${this.state.selectedId}`;
      let uploadFile = false;

      if (item && (item.title || this.state.type === 'users')) {
        if (this.state.type !== 'files' && this.state.type !== 'users') {
          item.slug = slugify(item.title);
        } else if (this.tempFile) {
          item.file = this.tempFile.name;
          uploadFile = true;
          this.uploadFile(this.tempFile);
        }

        if (item.date) {
          item.date = moment(item.date).format('YYYY-MM-DD');
        }
        if (item.startDate) {
          item.startDate = moment(item.startDate).format('YYYY-MM-DD');
        }
        if (item.endDate) {
          item.endDate = moment(item.endDate).format('YYYY-MM-DD');
        }
        if (item.gradeDate) {
          item.gradeDate = moment(item.gradeDate).format('YYYY-MM-DD');
        }

        item.status = this.refs['status-checkbox'].checked
          ? 'active'
          : 'inactive';

        this.toggleButtons(false);

        if (!uploadFile) {
          this.props.firebase[method](path, item).then((snap) => {
            this.toggleButtons(true);
            this.props.setNotification({ message: CONSTANTS.ITEM_SAVED, type: 'success' });

            if (snap) {
              this.setState({
                selectedId: snap.key
              }, () => {
                this.loadItem(snap.key, 'edit', this.state.type);
              });
            }
          });
        }
      } else {
        this.props.setNotification({ message: CONSTANTS.NEED_TITLE, type: 'error' });
      }
    } else {
      this.props.setNotification({ message: CONSTANTS.ADMIN_REQUIRED, type: 'error' });
    }
  }

  uploadFile(file) {
    this.uploadTask = this.storageRef.child(`files/${file.name}`).put(file);
    hideElem('.file-input');
    showElem('.file-upload-wrapper');

    this.uploadTask.on(this.props.firebase.storage.TaskEvent.STATE_CHANGED, (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      document.querySelector('.file-progress').setAttribute('value', progress);

      switch (snapshot.state) {
        case this.props.firebase.storage.TaskState.PAUSED:
          this.uploadStatus = 'paused';
          break;
        case this.props.firebase.storage.TaskState.RUNNING:
          this.uploadStatus = 'uploading';
          break;
        default:
      }
    }, (error) => {
      showElem('.file-input');
      hideElem('.file-upload-wrapper');
      this.toggleButtons(true);
      this.uploadStatus = '';

      switch (error.code) {
        case 'storage/unauthorized':
          break;
        case 'storage/canceled':
          break;
        case 'storage/unknown':
          break;
        default:
      }
    }, () => {
      showElem('.file-input');
      hideElem('.file-upload-wrapper');
      this.tempFile = null;
      this.uploadStatus = '';

      this.updateItem(this.uploadTask.snapshot.metadata.contentType, 'type');
      this.updateItem(this.uploadTask.snapshot.downloadURL, 'url', () => {
        this.save();
      });
    });
  }

  changeUploadStatus(status) {
    if (status === 'paused' && this.uploadStatus === 'paused') {
      document.querySelector(this.refs['pause-upload']).innerHTML = 'pause';
      this.uploadTask.resume();
    } else if (status === 'paused') {
      document.querySelector(this.refs['pause-upload']).innerHTML = 'resume';
      this.uploadTask.pause();
    } else if (status === 'cancelled') {
      if (this.uploadStatus === 'paused') {
        this.uploadTask.resume();
      }
      this.uploadTask.cancel();
    }
  }

  delete() {
    this.setState({
      modalTitle: `${CONSTANTS.CONFIRM_DELETE} "${this.state.selectedItem.title}"?`
    }, () => {
      animateCss(showElem('.js-modal-box-wrapper'), 'fade-in');
    });
  }

  updateInput(event, prop) {
    this.updateItem(event.target.value, prop);
  }

  updateCheckbox(event, prop) {
    const val = (event.target.checked)
      ? 'active'
      : 'inactive';
    this.updateItem(val, prop);
  }

  updateFile(event) {
    this.tempFile = event.target.files[0];

    this.updateItem(this.tempFile.name, 'file');
    if (this.refs['title-input'].value === '') {
      this.updateItem(this.tempFile.name, 'title');
    }
  }

  updateDate(date, prop) {
    let newDate = date;
    if (prop === 'endDate' && moment(date).isBefore(moment(this.state.selectedItem.startDate))) {
      newDate = this.state.selectedItem.endDate;
    }
    this.updateItem(newDate, prop);
  }

  updateSelect(select, prop) {
    const value = (select.selectedIndex >= 0)
      ? select.options[select.selectedIndex].value
      : '';
    this.updateItem(value, prop);
  }

  updateMultiSelect(select, prop) {
    const selectedValues = [];

    for (let i = 0; i < select.length; i += 1) {
      if (select.options[i].selected) {
        selectedValues.push(select.options[i].value);
      }
    }

    this.updateItem(selectedValues, prop);
  }

  fileSelected(select) {
    const key = (select.selectedIndex >= 0)
      ? select.options[select.selectedIndex].value
      : '';
    if (key) {
      copyTextToClipboard(this.props.files[key].url);
      if (this.props.files[key].type.indexOf('image') !== -1) {
        this.refs['btn-featured-image'].classList.remove('disabled');
        this.selectedImage = key;
      } else {
        this.refs['btn-featured-image'].classList.add('disabled');
        this.selectedImage = null;
      }
    } else {
      this.refs['btn-featured-image'].classList.add('disabled');
      this.selectedImage = null;
    }
  }

  updateItem(value, prop, callback) {
    let newItem = null;

    if (value && !isEmpty(value)) {
      newItem = Object.assign({}, this.state.selectedItem, { [prop]: value });
    } else {
      newItem = omit(this.state.selectedItem, [prop]);
    }

    if (!isEmpty(newItem) && JSON.stringify(newItem) !== JSON.stringify(this.state.selectedItem)) {
      this.setState({
        selectedItem: newItem
      }, () => {
        if (callback) {
          callback();
        }
      });
    }
  }

  toggleButtons(state) {
    const withState = (state) ? 'block' : 'none';
    const negState = (state) ? 'none' : 'block';
    this.refs.remove.style.display = withState;
    this.refs.save.style.display = withState;
    this.refs.saveTop.style.display = withState;
    this.refs.cancel.style.display = withState;
    this.refs.cancelTop.style.display = withState;
    this.refs.loader.style.display = negState;
    this.refs.loaderTop.style.display = negState;
  }

  modalBoxAnswer(answer) {
    if (answer === 'accept') {
      this.toggleButtons(false);

      // Delete the file first (if there's any)
      if (this.state.selectedItem.file) {
        const desertRef = this.storageRef.child(`files/${this.state.selectedItem.file}`);

        desertRef.delete().then(() => {
          this.props.firebase.remove(`${this.state.type}/${this.state.selectedId}`, () => {
            this.toggleButtons(true);
            this.cancel();
            this.props.setNotification({ message: CONSTANTS.ITEM_REMOVED, type: 'success' });
          });
        }).catch((error) => {
          this.props.setNotification({ message: error, type: 'error' });
        });
      } else {
        this.props.firebase.remove(`${this.state.type}/${this.state.selectedId}`, () => {
          this.toggleButtons(true);
          this.cancel();
          this.props.setNotification({ message: CONSTANTS.ITEM_REMOVED, type: 'success' });
        });
      }
    }
  }

  toggleElement(ref) {
    this.refs[ref].classList.toggle('active');
  }

  createList(type) {
    let newList = [];

    if (isLoaded(this.props[type]) && !isEmpty(this.props[type])) {
      newList = Object.keys(this.props[type]).map((key) => {
        const item = this.props[type][key];
        let response = null;

        if (type === 'users') {
          response = {
            text: `${item.info.firstName}  ${item.info.lastName1}`,
            id: key
          };
        } else if (type === 'files') {
          response = {
            text: (item.type)
              ? `[${item.type}] ${item.title}`
              : item.title,
            id: key
          };
        } else {
          response = {
            text: item.title,
            id: key
          };
        }
        return response;
      });
    }
    return newList;
  }

  render() {
    const users = this.createList('users');
    const levels = this.createList('levels');
    const groups = this.createList('groups');
    const courses = this.createList('courses');
    const subjects = this.createList('subjects');
    const modules = this.createList('modules');
    const activities = this.createList('activities');
    const posts = this.createList('posts');
    const pages = this.createList('pages');
    const files = this.createList('files');

    const title = (this.state.selectedItem && this.state.selectedItem.title)
      ? this.state.selectedItem.title
      : '';
    let iconHeading = null;
    if (this.state.type === 'courses') {
      iconHeading = <Icon glyph={Course} />;
    } else if (this.state.type === 'subjects') {
      iconHeading = <Icon glyph={Subject} />;
    } else if (this.state.type === 'modules') {
      iconHeading = <Icon glyph={Module} />;
    } else {
      iconHeading = <Icon glyph={Activity} />;
    }
    const code = (this.state.selectedItem && this.state.selectedItem.code)
      ? this.state.selectedItem.code
      : '';
    const registrationFee = (this.state.selectedItem && this.state.selectedItem.registrationFee)
      ? this.state.selectedItem.registrationFee
      : '';
    const creditFee = (this.state.selectedItem && this.state.selectedItem.creditFee)
      ? this.state.selectedItem.creditFee
      : '';
    const date = (this.state.selectedItem && this.state.selectedItem.date)
      ? moment(this.state.selectedItem.date)
      : null;
    const startDate = (this.state.selectedItem && this.state.selectedItem.startDate)
      ? moment(this.state.selectedItem.startDate)
      : null;
    const endDate = (this.state.selectedItem && this.state.selectedItem.endDate)
      ? moment(this.state.selectedItem.endDate)
      : null;
    const gradeDate = (this.state.selectedItem && this.state.selectedItem.gradeDate)
      ? moment(this.state.selectedItem.gradeDate)
      : null;
    const status = (this.state.selectedItem && this.state.selectedItem.status && this.state.selectedItem.status === 'active');
    const slackToken = this.state.selectedItem && this.state.selectedItem.slackToken
      ? this.state.selectedItem.slackToken
      : '';
    const fileContentType = (this.state.fileMetadata)
      ? this.state.fileMetadata.contentType
      : '';
    let fileSize = (this.state.fileMetadata)
      ? Math.round(this.state.fileMetadata.size / 1000)
      : 0;
    if (fileSize < 1000) {
      fileSize = `${Math.round(fileSize)}KB`;
    } else if (fileSize < 1000000) {
      fileSize = `${Math.round(fileSize / 1000)}MB`;
    } else if (fileSize < 1000000000) {
      fileSize = `${Math.round(fileSize / 1000000)}GB`;
    } else {
      fileSize = `${Math.round(fileSize / 1000000000)}TB`;
    }
    const fileCreatedOn = (this.state.fileMetadata)
      ? moment(this.state.fileMetadata.timeCreated).format('YYYY-MM-DD HH:MM:SS')
      : '';
    const fileUpdatedOn = (this.state.fileMetadata)
      ? moment(this.state.fileMetadata.updated).format('YYYY-MM-DD HH:MM:SS')
      : '';

    return (
      <section className="admin page container-fluid">
        {(isLoaded(levels) && isLoaded(groups) && isLoaded(courses) && isLoaded(subjects) &&
          isLoaded(modules) && isLoaded(activities) && isLoaded(posts) && isLoaded(pages))
          ? <div className="columns">
            <div className="nav column">
              <div className="block clearfix">
                <div className="item-type-list">
                  <Icon glyph={User} />
                  <Select2
                    className="select-items" style={{
                      width: '77%'
                    }} ref="users-select" data={users} defaultValue={this.state.selectedId} options={{
                      placeholder: 'Users',
                      allowClear: true
                    }} onChange={event => this.handleSelect(event, 'edit', 'users')}
                  />
                  <button className="btn-new-item tooltip"><Icon glyph={Add} className="icon disabled" />
                    <span className="tooltip-text inverted right">To add a new user, follow the sign-up process</span>
                  </button>
                </div>

                <div className="item-type-list">
                  <Icon glyph={Level} />
                  <Select2
                    className="select-items" style={{
                      width: '77%'
                    }} ref="levels-select" data={levels} defaultValue={this.state.selectedId} options={{
                      placeholder: 'Levels',
                      allowClear: true
                    }} onChange={event => this.handleSelect(event, 'edit', 'levels')}
                  />
                  <button className="btn-new-item" onClick={() => this.new('levels')}>
                    <Icon glyph={Add} />
                  </button>
                </div>

                <div className="item-type-list">
                  <Icon glyph={Group} />
                  <Select2
                    className="select-items" style={{
                      width: '77%'
                    }} ref="groups-select" data={groups} defaultValue={this.state.selectedId} options={{
                      placeholder: 'Groups',
                      allowClear: true
                    }} onChange={event => this.handleSelect(event, 'edit', 'groups')}
                  />
                  <button className="btn-new-item" onClick={() => this.new('groups')}>
                    <Icon glyph={Add} />
                  </button>
                </div>

                <div className="item-type-list">
                  <Icon glyph={Course} />
                  <Select2
                    className="select-items" style={{
                      width: '77%'
                    }} ref="courses-select" data={courses} defaultValue={this.state.selectedId} options={{
                      placeholder: 'Courses',
                      allowClear: true
                    }} onChange={event => this.handleSelect(event, 'edit', 'courses')}
                  />
                  <button className="btn-new-item" onClick={() => this.new('courses')}>
                    <Icon glyph={Add} />
                  </button>
                </div>

                <div className="item-type-list">
                  <Icon glyph={Subject} />
                  <Select2
                    className="select-items" style={{
                      width: '77%'
                    }} ref="subjects-select" data={subjects} defaultValue={this.state.selectedId} options={{
                      placeholder: 'Subjects',
                      allowClear: true
                    }} onChange={event => this.handleSelect(event, 'edit', 'subjects')}
                  />
                  <button className="btn-new-item" onClick={() => this.new('subjects')}>
                    <Icon glyph={Add} />
                  </button>
                </div>

                <div className="item-type-list">
                  <Icon glyph={Module} />
                  <Select2
                    className="select-items" style={{
                      width: '77%'
                    }} ref="modules-select" data={modules} defaultValue={this.state.selectedId} options={{
                      placeholder: 'Modules',
                      allowClear: true
                    }} onChange={event => this.handleSelect(event, 'edit', 'modules')}
                  />
                  <button className="btn-new-item" onClick={() => this.new('modules')}>
                    <Icon glyph={Add} />
                  </button>
                </div>

                <div className="item-type-list">
                  <Icon glyph={Activity} />
                  <Select2
                    className="select-items" style={{
                      width: '77%'
                    }} ref="activities-select" data={activities} defaultValue={this.state.selectedId} options={{
                      placeholder: 'Activities',
                      allowClear: true
                    }} onChange={event => this.handleSelect(event, 'edit', 'activities')}
                  />
                  <button className="btn-new-item" onClick={() => this.new('activities')}>
                    <Icon glyph={Add} />
                  </button>
                </div>

                <div className="item-type-list">
                  <Icon glyph={Post} />
                  <Select2
                    className="select-items" style={{
                      width: '77%'
                    }} ref="posts-select" data={posts} defaultValue={this.state.selectedId} options={{
                      placeholder: 'Posts',
                      allowClear: true
                    }} onChange={event => this.handleSelect(event, 'edit', 'posts')}
                  />
                  <button className="btn-new-item" onClick={() => this.new('posts')}>
                    <Icon glyph={Add} />
                  </button>
                </div>

                <div className="item-type-list">
                  <Icon glyph={Post} />
                  <Select2
                    className="select-items" style={{
                      width: '77%'
                    }} ref="pages-select" data={pages} defaultValue={this.state.selectedId} options={{
                      placeholder: 'Pages',
                      allowClear: true
                    }} onChange={event => this.handleSelect(event, 'edit', 'pages')}
                  />
                  <button className="btn-new-item" onClick={() => this.new('pages')}>
                    <Icon glyph={Add} />
                  </button>
                </div>

                <div className="item-type-list">
                  <Icon glyph={File} />
                  <Select2
                    className="select-items" style={{
                      width: '77%'
                    }} ref="files-select" data={files} defaultValue={this.state.selectedId} options={{
                      placeholder: 'Files',
                      allowClear: true,
                      templateResult: Admin.formatFileType,
                      templateSelection: Admin.formatFileType
                    }} onChange={event => this.handleSelect(event, 'edit', 'files')}
                  />
                  <button className="btn-new-item" onClick={() => this.new('files')}>
                    <Icon glyph={Add} />
                  </button>
                </div>
              </div>
            </div>
            <div
              className={classNames('item-content column', {
                hidden: this.state.action === ''
              })}
            >
              <div className={`block clearfix ${this.state.type}`}>
                <h3 className="block-title">{iconHeading}{(this.state.action === 'new')
                    ? <span>You are adding a new {(this.state.type === 'activities')
                          ? 'activity'
                          : this.state.type.slice(0, -1)}...</span>
                    : <span>You are editing {(this.state.type === 'activities')
                        ? 'an activity'
                        : `a ${this.state.type.slice(0, -1)}`}...</span>}
                  <button className="btn btn-primary btn-xs float-right btn-save" ref="saveTop" onClick={() => this.save()}>save in {this.state.type}</button>
                  <button className="btn btn-outline btn-xs float-right" ref="cancelTop" onClick={() => this.cancel()}>cancel</button>
                  <div className="loader-small" ref="loaderTop" />
                </h3>

                {(this.state.type === 'users')
                  ? <AdminUsers user={this.state.selectedItem} updateItem={this.updateItem} />
                  : ''}

                <input
                  type="text"
                  className={classNames('input-field title-input', {
                    hidden: (this.state.type === 'users')
                  })} ref="title-input" placeholder={(this.state.type === 'activities')
                    ? 'Activity title'
                    : `${this.state.type.slice(0, -1).capitalize()} title`} value={title} onChange={event => this.updateInput(event, 'title')}
                />
                <input
                  type="text"
                  className={classNames('input-field code-input', {
                    hidden: (this.state.type === 'users' || this.state.type === 'posts' || this.state.type === 'pages' || this.state.type === 'files')
                  })} ref="code-input" placeholder="Code" value={code} onChange={event => this.updateInput(event, 'code')}
                />
                <div
                  className={classNames('float-right', {
                    hidden: (this.state.type !== 'posts')
                  })}
                >
                  <Icon glyph={Calendar} className="icon calendar" />
                  <DatePicker
                    className="input-field date-input"
                    selected={date} date={date}
                    placeholderText="Date"
                    isClearable
                    onChange={newDate => this.updateDate(newDate, 'date')}
                    dateFormat="YYYY-MM-DD"
                    popoverAttachment="bottom right"
                    popoverTargetAttachment="bottom right"
                    popoverTargetOffset="0px 0px"
                  />
                </div>

                <div
                  className={classNames({
                    hidden: (this.state.type !== 'groups')
                  })}
                >
                  <Select2
                    style={{
                      width: '100%'
                    }} multiple data={users} value={(this.state.selectedItem && this.state.selectedItem.users)
                      ? this.state.selectedItem.users
                      : []} options={{
                        placeholder: 'Users in this group...',
                        allowClear: true
                      }}
                    onChange={event => this.updateMultiSelect(event.currentTarget, 'users')}
                  />
                  <Select2
                    style={{
                      width: '100%'
                    }} data={courses} value={(this.state.selectedItem && this.state.selectedItem.course)
                      ? this.state.selectedItem.course
                      : ''} options={{
                        placeholder: 'Select a course...',
                        allowClear: true
                      }}
                    onChange={event => this.updateSelect(event.currentTarget, 'course')}
                  />
                </div>

                <div
                  className={classNames({
                    hidden: (this.state.type !== 'subjects')
                  })}
                >
                  <Select2
                    style={{
                      width: '100%'
                    }} multiple data={users} value={(this.state.selectedItem && this.state.selectedItem.teachers)
                      ? this.state.selectedItem.teachers
                      : []} options={{
                        placeholder: 'Teacher(s)...',
                        allowClear: true
                      }}
                    onChange={event => this.updateMultiSelect(event.currentTarget, 'teachers')}
                  />
                  <Select2
                    style={{
                      width: '100%'
                    }} multiple data={modules} value={(this.state.selectedItem && this.state.selectedItem.modules)
                      ? this.state.selectedItem.modules
                      : []} options={{
                        placeholder: 'Modules...',
                        allowClear: true
                      }}
                    onChange={event => this.updateMultiSelect(event.currentTarget, 'modules')}
                  />
                  <Select2
                    style={{
                      width: '100%'
                    }} multiple data={activities} value={(this.state.selectedItem && this.state.selectedItem.activities)
                      ? this.state.selectedItem.activities
                      : []} options={{
                        placeholder: 'Activities...',
                        allowClear: true
                      }}
                    onChange={event => this.updateMultiSelect(event.currentTarget, 'activities')}
                  />
                  <input
                    type="text"
                    className="input-field slack-input"
                    ref="slack-input"
                    placeholder="Slack token ID"
                    value={slackToken}
                    onChange={event => this.updateInput(event, 'slackToken')}
                  />
                </div>

                <div
                  className={classNames({
                    hidden: (this.state.type !== 'modules' && this.state.type !== 'activities')
                  })}
                >
                  <Select2
                    style={{
                      width: '100%'
                    }} multiple data={users} value={(this.state.selectedItem && this.state.selectedItem.authors)
                      ? this.state.selectedItem.authors
                      : []} options={{
                        placeholder: 'Author(s)...',
                        allowClear: true
                      }}
                    onChange={event => this.updateMultiSelect(event.currentTarget, 'authors')}
                  />
                </div>

                <div className="clearfix">
                  <div
                    className={classNames('dates-wrapper', {
                      hidden: (this.state.type !== 'courses') && (this.state.type !== 'activities')
                    })}
                  >
                    <label>{this.state.type === 'courses'
                      ? 'Enrolment from'
                      : 'From'}
                    </label>
                    <Icon glyph={Calendar} className="icon calendar" />
                    <DatePicker
                      className="input-field date-input"
                      selected={startDate}
                      placeholderText="Date"
                      isClearable
                      selectsStart
                      startDate={startDate}
                      endDate={endDate}
                      onChange={newDate => this.updateDate(newDate, 'startDate')}
                      dateFormat="YYYY-MM-DD"
                    />
                    <label className="date-label">until</label>
                    <Icon glyph={Calendar} className="icon calendar" />
                    <DatePicker
                      className="input-field date-input"
                      selected={endDate}
                      placeholderText="Date"
                      isClearable
                      selectsEnd
                      startDate={startDate}
                      endDate={endDate}
                      onChange={newDate => this.updateDate(newDate, 'endDate')}
                      dateFormat="YYYY-MM-DD"
                    />
                    <div
                      className={classNames('grade-wrapper', {
                        hidden: (this.state.type !== 'activities')
                      })}
                    >
                      <label className="date-label">Grade</label>
                      <Icon glyph={Calendar} className="icon calendar" />
                      <DatePicker
                        className="input-field date-input"
                        selected={gradeDate}
                        placeholderText="Date"
                        isClearable
                        onChange={newDate => this.updateDate(newDate, 'gradeDate')}
                        dateFormat="YYYY-MM-DD"
                      />
                    </div>
                  </div>
                  <div
                    className={classNames('fees-wrapper', {
                      hidden: (this.state.type !== 'courses')
                    })}
                  >
                    <label>Reg. fee €</label>
                    <input
                      type="number"
                      min="0"
                      className="input-field fee-input"
                      ref="registration-input"
                      value={registrationFee}
                      onChange={event => this.updateInput(event, 'registrationFee')}
                    />
                    <label>Credit fee €</label>
                    <input
                      type="number"
                      min="0"
                      className="input-field fee-input"
                      ref="credits-input"
                      value={creditFee}
                      onChange={event => this.updateInput(event, 'creditFee')}
                    />
                  </div>
                </div>

                <div
                  className={classNames({
                    hidden: (this.state.type !== 'courses')
                  })}
                >
                  <Select2
                    className="select-items course-level-select" style={{
                      width: '70%'
                    }} data={levels} ref="course-level-select" value={(this.state.selectedItem && this.state.selectedItem.level)
                      ? this.state.selectedItem.level
                      : ''} options={{
                        placeholder: 'Course level',
                        allowClear: false
                      }}
                    onChange={event => this.updateSelect(event.currentTarget, 'level')}
                  />
                  <Select2
                    style={{
                      width: '100%'
                    }} multiple data={subjects} value={(this.state.selectedItem && this.state.selectedItem.subjects)
                      ? this.state.selectedItem.subjects
                      : []} options={{
                        placeholder: 'Subjects...',
                        allowClear: true
                      }}
                    onChange={event => this.updateMultiSelect(event.currentTarget, 'subjects')}
                  />
                </div>

                <div
                  className={classNames('clearfix', {
                    hidden: (this.state.type === 'levels') || (this.state.type === 'users') || (this.state.type === 'groups') || (this.state.type === 'files')
                  })}
                >
                  <div className="file-settings-block">
                    <Select2
                      style={{
                        width: '100%'
                      }}
                      data={files}
                      options={{
                        placeholder: 'Select a file to copy its URL...',
                        allowClear: true,
                        templateResult: Admin.formatFileType,
                        templateSelection: Admin.formatFileType
                      }}
                      onChange={event => this.fileSelected(event.currentTarget)}
                    />
                    <label className="option-label">Featured image</label>
                    <span>{(this.state.selectedItem && this.state.selectedItem.featuredImage)
                        ? <a
                          href={this.props.files[this.state.selectedItem.featuredImage]
                            ? this.props.files[this.state.selectedItem.featuredImage].url
                            : ''} target="_blank" rel="noopener noreferrer"
                        >{this.props.files[this.state.selectedItem.featuredImage]
                          ? this.props.files[this.state.selectedItem.featuredImage].file
                          : ''}</a>
                        : 'none'}</span>
                    <button
                      className={classNames('btn btn-cancel btn-xs', {
                        visible: (this.state.selectedItem && this.state.selectedItem.featuredImage && this.state.selectedItem.featuredImage !== '')
                      })} onClick={() => this.updateItem('', 'featuredImage')}
                    >unlink</button>
                  </div>
                  <div className="featured-image-wrapper">
                    {(this.state.selectedItem && this.state.selectedItem.featuredImage)
                      ? <img
                        alt=""
                        className="featured-image" src={this.props.files[this.state.selectedItem.featuredImage]
                          ? this.props.files[this.state.selectedItem.featuredImage].url
                          : ''}
                      />
                      : <button className="btn btn-primary btn-xs btn-featured-image disabled" ref="btn-featured-image" onClick={() => this.updateItem(this.selectedImage, 'featuredImage')}>Set as featured image</button>}
                  </div>
                </div>

                <div
                  className={classNames({
                    hidden: (this.state.type === 'users' || this.state.type === 'files')
                  })}
                >
                  <h4 className="heading active" ref="editor1-heading" onClick={() => ((this.toggleElement('editor1-heading'), this.toggleElement('editor1-wrapper')))}>Primary content block<Icon glyph={Forward} /></h4>
                  <div className="editor-wrapper active" ref="editor1-wrapper">
                    <SimpleMDE
                      options={{
                        spellChecker: false
                      }} ref="editor1" value={(this.state.selectedItem && this.state.selectedItem.content1)
                      ? this.state.selectedItem.content1
                      : ''} onChange={event => this.updateItem(event, 'content1')}
                    />
                  </div>
                </div>

                <div
                  className={classNames({
                    hidden: (this.state.type === 'levels' || this.state.type === 'users' || this.state.type === 'posts' || this.state.type === 'files')
                  })}
                >
                  <h4 className="heading" ref="editor2-heading" onClick={() => ((this.toggleElement('editor2-heading'), this.toggleElement('editor2-wrapper')))}>Secondary content block<Icon glyph={Forward} /></h4>
                  <div className="editor-wrapper" ref="editor2-wrapper">
                    <SimpleMDE
                      options={{
                        spellChecker: false
                      }} ref="editor2" value={(this.state.selectedItem && this.state.selectedItem.content2)
                        ? this.state.selectedItem.content2
                        : ''} onChange={event => this.updateItem(event, 'content2')}
                    />
                  </div>

                  <h4 className="heading" ref="editor3-heading" onClick={() => ((this.toggleElement('editor3-heading'), this.toggleElement('editor3-wrapper')))}>Tertiary content block<Icon glyph={Forward} /></h4>
                  <div className="editor-wrapper" ref="editor3-wrapper">
                    <SimpleMDE
                      options={{
                        spellChecker: false
                      }} ref="editor3" value={(this.state.selectedItem && this.state.selectedItem.content3)
                        ? this.state.selectedItem.content3
                        : ''} onChange={event => this.updateItem(event, 'content3')}
                    />
                  </div>
                </div>

                <div
                  className={classNames({
                    hidden: (this.state.type !== 'courses')
                  })}
                >
                  <h4 className="heading" ref="editor-fees-heading" onClick={() => ((this.toggleElement('editor-fees-heading'), this.toggleElement('editor-fees-wrapper')))}>Fees<Icon glyph={Forward} /></h4>
                  <div className="editor-wrapper" ref="editor-fees-wrapper">
                    <SimpleMDE
                      options={{
                        spellChecker: false
                      }} ref="editor-fees" value={(this.state.selectedItem && this.state.selectedItem.fees)
                        ? this.state.selectedItem.fees
                        : ''} onChange={event => this.updateItem(event, 'fees')}
                    />
                  </div>

                  <h4 className="heading" ref="editor-requirements-heading" onClick={() => ((this.toggleElement('editor-requirements-heading'), this.toggleElement('editor-requirements-wrapper')))}>Requirements<Icon glyph={Forward} /></h4>
                  <div className="editor-wrapper" ref="editor-requirements-wrapper">
                    <SimpleMDE
                      options={{
                        spellChecker: false
                      }} ref="editor-requirements" value={(this.state.selectedItem && this.state.selectedItem.requirements)
                        ? this.state.selectedItem.requirements
                        : ''} onChange={event => this.updateItem(event, 'requirements')}
                    />
                  </div>
                </div>

                <div
                  className={classNames({
                    hidden: (this.state.type !== 'files')
                  })}
                >
                  <div>
                    {(this.state.selectedItem && this.state.selectedItem.url)
                      ? <div>
                        <div className="clearfix file-download">
                          <Icon glyph={LinkIcon} />
                          <a href={this.state.selectedItem.url} target="_blank" rel="noopener noreferrer">View/download file</a>
                        </div>
                        <div className="file-metadata">
                          <img alt="" src={`http://www.stdicon.com/crystal/${fileContentType}?size=24`} />
                          <span>File metadata</span>
                          <ul>
                            <li>
                              <span>Original file name:</span>{this.state.selectedItem.file}</li>
                            <li>
                              <span>Content type:</span>{fileContentType}</li>
                            <li>
                              <span>File size:</span>{fileSize}</li>
                            <li>
                              <span>Created on:</span>{fileCreatedOn}</li>
                            <li>
                              <span>Updated on:</span>{fileUpdatedOn}</li>
                          </ul>
                        </div>
                        {(fileContentType.indexOf('image') !== -1)
                          ? <img alt="" className="file-preview" src={this.state.selectedItem.url} /> : null}
                        {(fileContentType.indexOf('video') !== -1)
                          ? <video className="file-preview" src={this.state.selectedItem.url} controls />
                          : <object className="file-preview" data={this.state.selectedItem.url} width="50%" height="80%" type={fileContentType} />}
                      </div>
                      : <div>
                        <input type="file" className="file-input" ref="file-input" placeholder="Select file" onChange={event => this.updateFile(event, 'file')} />
                        <span className="file-upload-wrapper">Uploading {(this.tempFile)
                            ? this.tempFile.name
                            : ''}
                          <progress className="file-progress" max="100" value="0" />
                          <button className="btn btn-outline btn-xs" ref="pause-upload" onClick={() => this.changeUploadStatus('paused')}>pause</button>
                          <button className="btn btn-cancel btn-xs" ref="cancel-upload" onClick={() => this.changeUploadStatus('cancelled')}>cancel</button>
                        </span>
                      </div>}
                  </div>
                </div>

                <h4 className="heading" ref="editor-notes-heading" onClick={() => ((this.toggleElement('editor-notes-heading'), this.toggleElement('editor-notes-wrapper')))}>Private notes<Icon glyph={Forward} /></h4>
                <div className="editor-wrapper" ref="editor-notes-wrapper">
                  <SimpleMDE
                    options={{
                      spellChecker: false
                    }} ref="editor-notes" value={(this.state.selectedItem && this.state.selectedItem.notes)
                      ? this.state.selectedItem.notes
                      : ''} onChange={event => this.updateItem(event, 'notes')}
                  />
                </div>

                <label className="checkbox-label">Active
                </label><input type="checkbox" className="status-checkbox" ref="status-checkbox" checked={status} onChange={event => this.updateCheckbox(event, 'status')} />

                <div className="footer-buttons">
                  <button className="btn btn-cancel btn-xs float-left" ref="remove" onClick={() => this.delete()}>remove from {this.state.type}</button>
                  <button className="btn btn-primary btn-xs float-right btn-save" ref="save" onClick={() => this.save()}>save in {this.state.type}</button>
                  <button className="btn btn-outline btn-xs float-right" ref="cancel" onClick={() => this.cancel()}>cancel</button>
                  <div className="loader-small" ref="loader" />
                </div>
              </div>
            </div>
          </div>
        : <div className="loader-small inverted" />}
        <ModalBox title={this.state.modalTitle} answer={this.modalBoxAnswer} />
      </section>
    );
  }
}

const mapDispatchToProps = {
  setLoading,
  setNotification
};

const mapStateToProps = null;

export default connect(mapStateToProps, mapDispatchToProps)(Admin);
