import React, { Component } from 'react';
import classNames from 'classnames';
import { connect } from 'react-redux';
import moment from 'moment';
import $ from 'jquery';
import { firebase, helpers } from 'redux-react-firebase';
import { Link } from 'react-router';
import { setLoading } from '../../../../core/actions/actions';
import * as CONSTANTS from '../../../../core/constants/constants';
import ModalBox from '../../../../core/common/modalbox/modalbox';
import Edit from '../../../../core/common/lib/edit/edit';
import Icon from '../../../../core/common/lib/icon/icon';
import Level from '../../../../../../static/svg/course.svg';
import Info from '../../../../../../static/svg/info.svg';
import Calendar from '../../../../../../static/svg/calendar2.svg';

const { isLoaded, isEmpty, dataToJS } = helpers;

@connect((state, props) => ({
  course: dataToJS(state.firebase, 'courses'),
  levels: dataToJS(state.firebase, 'levels'),
  subjects: dataToJS(state.firebase, 'subjects'),
  users: dataToJS(state.firebase, 'users'),
  files: dataToJS(state.firebase, 'files'),
  userID: state.mainReducer.user
    ? state.mainReducer.user.uid
    : '',
  // featuredImage: state.course.featuredImage ? state.course.featuredImage : '',
  courseID: props.course
    ? props.course[Object.keys(props.course)[0]].code
    : '',
  userData: dataToJS(state.firebase, `users/${state.mainReducer.user
    ? state.mainReducer.user.uid
    : ''}`)
}))
@firebase(props => ([
  `courses#orderByChild=slug&equalTo=${props.params.slug}`, 'levels', 'subjects',
  // `subjects#orderByKey&equalTo=${props.course ? props.course[Object.keys(props.course)[0]].subjects : ''}`,
  'users',
  'files',
  // `files#orderByChild=featuredImage&equalTo=${props.featuredImage}`
  `users/${props.userID}`
]))
class Course extends Component {

  constructor(props) {
    super(props);

    this.state = {
      selectedSubjects: [],
      modalTitle: ''
    };

    this.modalBoxAnswer = this.modalBoxAnswer.bind(this);
  }

  componentDidMount() {
    this.props.setLoading(false);
    $('.js-main').removeClass().addClass('main js-main course-page');
  }

  enrolConfirmation() {
    this.setState({
      modalTitle: CONSTANTS.CONFIRM_ENROL
    }, () => {
      $('.js-modal-box-wrapper').show().animateCss('fade-in');
    });
  }

  modalBoxAnswer(answer) {
    if (answer === 'accept') {
      let courseID = null;
      Object.keys(this.props.course).map((key) => {
        courseID = key;
        return false;
      });

      let subjectsAdded = 0;
      const subjectData = {
        finalGrade: '',
        status: 'enrolled'
      };

      $(this.refs['btn-enroll']).hide();
      $(this.refs['loader-enroll']).show();

      for (let i = 0; i < this.state.selectedSubjects.length; i += 1) {
        this.props.firebase.set(`users/${this.props.user.uid}/courses/${courseID}/${this.state.selectedSubjects[i]}`, subjectData).then(() => {
          subjectsAdded += 1;
          if (subjectsAdded === this.state.selectedSubjects.length) {
            $(this.refs['btn-enroll']).show();
            $(this.refs['loader-enroll']).hide();
            this.props.setNotification({ message: CONSTANTS.ENROLLED_COURSE, type: 'success' });
            this.setState({ selectedSubjects: [] });
          }
        }, (error) => {
          $(this.refs['btn-enroll']).show();
          $(this.refs['loader-enroll']).hide();
          this.props.setNotification({ message: String(error), type: 'error' });
        });
      }
    }
  }

  handleChange(event) {
    const selectedSubjects = this.state.selectedSubjects;

    if (event.target.checked) {
      selectedSubjects.push(event.target.value);
    } else {
      let index = -1;
      for (let i = 0; i < selectedSubjects.length; i += 1) {
        if (selectedSubjects[i] === event.target.value) {
          index = i;
        }
      }
      if (index >= 0) {
        selectedSubjects.splice(index, 1);
      }
    }
    this.setState({ selectedSubjects });
  }

  render() {
    let course = null;
    let featuredImage = null;
    let enrollmentOpened = false;
    let courseID = null;
    let subjects = null;
    let totalCredits = 0;
    const section = this.props.location.pathname.substr(this.props.location.pathname.lastIndexOf('/') + 1);

    if (isLoaded(this.props.course) && isLoaded(this.props.files) && !isEmpty(this.props.course) && !isEmpty(this.props.files)) {
      Object.keys(this.props.course).map((key) => {
        courseID = key;
        course = this.props.course[key];

        if (course.featuredImage) {
          Object.keys(this.props.files).map((fileKey) => {
            if (fileKey === course.featuredImage) {
              featuredImage = this.props.files[fileKey];
            }
            return false;
          });
        }

        if (moment().isBetween(moment(course.startDate), moment(course.endDate), 'days', '[]')) {
          enrollmentOpened = true;
        }
        return false;
      });
    }

    if (course && course.subjects && isLoaded(this.props.subjects) && !isEmpty(this.props.subjects) && isLoaded(this.props.users) && !isEmpty(this.props.users)) {
      subjects = course.subjects.map((item, i) => {
        const subject = this.props.subjects[course.subjects[i]];
        let teachers = '';
        totalCredits += parseInt(subject.credits, 0);

        if (subject.teachers) {
          teachers = subject.teachers.map((teacher) => {
            if (teacher && this.props.users[teacher]) {
              return <div key={teacher}>{this.props.users[teacher].info.displayName}</div>;
            }
            return '';
          });
        }

        let itemEnrol = 'unavailable';
        if (isLoaded(this.props.userData) && !isEmpty(this.props.userData)) {
          if (this.props.userData.courses && this.props.userData.courses[courseID][item]) {
            itemEnrol = this.props.userData.courses[courseID][item].status;
          } else if (subject.status === 'active' && enrollmentOpened) {
            itemEnrol = <span><input type="checkbox" value={item} onChange={event => this.handleChange(event)} />Enrol now</span>;
          }
        }

        return (
          <tr key={item}>
            <td>{subject.code}</td>
            <td>
              <Link to={`/subjects/${subject.slug}`}>{subject.title}</Link>
            </td>
            <td>{teachers}</td>
            <td>{subject.credits}</td>
            <td>{itemEnrol}</td>
          </tr>
        );
      });
    }

    return (
      <section className="page course">
        {course
          ? <div className="page-wrapper">
            <h1 className="title">{course.title}</h1>
            <div className="meta">
              <Icon glyph={Level} /> {this.props.levels[course.level].title}
              ({this.props.levels[course.level].code}) ({totalCredits}
              Credits)
              <Icon glyph={Calendar} />Enrollment from
              <span className="date">{moment(course.startDate).format('D MMMM YYYY')}</span>
              until
              <span className="date">{moment(course.endDate).format('D MMMM YYYY')}</span>
              {isLoaded(this.props.userData) && !isEmpty(this.props.userData) && this.props.userData.info.level >= CONSTANTS.ADMIN_LEVEL
                ? <Edit editLink={`/admin/courses/edit/${course.slug}`} newLink="/admin/courses/new" />
                : ''}
            </div>
            {section !== 'subjects' && subjects && enrollmentOpened
              ? <button className="btn btn-primary btn-enroll">
                <Link to={`/courses/${course.slug}/subjects`}>Enrol now!</Link>
              </button>
              : ''}
            <ul className="horizontal-nav">
              <li
                className={classNames('horizontal-nav-item', {
                  active: section === this.props.params.slug
                })}
              >
                <Link to={`/courses/${course.slug}`}>Summary</Link>
              </li>
              <li
                className={classNames('horizontal-nav-item', {
                  active: section === 'subjects',
                  hidden: !subjects
                })}
              >
                <Link to={`/courses/${course.slug}/subjects`}>Subjects</Link>
              </li>
              <li
                className={classNames('horizontal-nav-item', {
                  active: section === 'fees'
                })}
              >
                <Link to={`/courses/${course.slug}/fees`}>Fees</Link>
              </li>
              <li
                className={classNames('horizontal-nav-item', {
                  active: section === 'requirements'
                })}
              >
                <Link to={`/courses/${course.slug}/requirements`}>Requirements</Link>
              </li>
            </ul>
            <div
              className={classNames('columns', {
                'single-column': (!course.content2 && !course.content2),
                hidden: (section !== this.props.params.slug)
              })}
            >
              <div className="column page-content">
                {featuredImage
                  ? <img alt="" className="featured-image" role="presentation" src={featuredImage.url} />
                  : ''}
                <div
                  className="content" dangerouslySetInnerHTML={{
                    __html: CONSTANTS.converter.makeHtml(course.content1)
                  }}
                />
              </div>
              {course.content2
                ? <div className="column page-sidebar">
                  <div
                    className="content" dangerouslySetInnerHTML={{
                      __html: CONSTANTS.converter.makeHtml(course.content2)
                    }}
                  />
                </div>
                : ''}
              {course.content3
                ? <div className="column page-sidebar">
                  <div
                    className="content" dangerouslySetInnerHTML={{
                      __html: CONSTANTS.converter.makeHtml(course.content3)
                    }}
                  />
                </div>
                : ''}
            </div>
            <div
              className={classNames('columns single-column', {
                hidden: (section !== 'subjects')
              })}
            >
              <div className="column page-content">
                {!isLoaded(this.props.userData) || isEmpty(this.props.userData)
                  ? <p><Icon glyph={Info} className="icon info-icon" />Sign in to enrol in this course</p>
                  : null}
                <table>
                  <thead>
                    <tr>
                      <th>Code</th>
                      <th>Subject</th>
                      <th>Teacher(s)</th>
                      <th>Credits</th>
                      {isLoaded(this.props.userData) && !isEmpty(this.props.userData)
                        ? <th>Availability</th>
                        : null}
                    </tr>
                  </thead>
                  <tbody>
                    {subjects}
                  </tbody>
                </table>
                {enrollmentOpened && this.state.selectedSubjects.length > 0
                  ? <button ref="btn-enroll" className="btn btn-primary btn-enroll float-right" onClick={() => this.enrolConfirmation()}>Proceed with the registration</button>
                  : ''}
                <div ref="loader-enroll" className="loader-small loader-enroll" />
              </div>
            </div>
            <div
              className={classNames('columns single-column', {
                hidden: (section !== 'fees')
              })}
            >
              <div className="column page-content">
                <div className="info">
                  <span>Registration fee:
                  </span>{course.registrationFee}€
                  <span>Credits fee:
                  </span>
                  {course.creditFee}€
                </div>
                <div
                  className="content" dangerouslySetInnerHTML={{
                    __html: CONSTANTS.converter.makeHtml(course.fees)
                  }}
                />
              </div>
            </div>
            <div
              className={classNames('columns single-column', {
                hidden: (section !== 'requirements')
              })}
            >
              <div className="column page-content">
                <div
                  className="content" dangerouslySetInnerHTML={{
                    __html: CONSTANTS.converter.makeHtml(course.requirements)
                  }}
                />
              </div>
            </div>
          </div>
          : <div className="loader-small" />}
        <ModalBox title={this.state.modalTitle} answer={this.modalBoxAnswer} />
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

export default connect(mapStateToProps, mapDispatchToProps)(Course);
