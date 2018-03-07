import React, { Component } from 'react';
import { connect } from 'react-redux';
import { firebase, helpers } from 'redux-react-firebase';
import { Link } from 'react-router';
import { animateCss, showElem, renderCards } from '../../../../core/common/helpers';
import { setLoading } from '../../../../core/actions/actions';
import Icon from '../../../../core/common/lib/icon/icon';
import World from '../../../../../../static/svg/world.svg';
import Logo from '../../../../../../static/svg/logo.svg';

const { isLoaded, isEmpty, dataToJS } = helpers;

@firebase(['files', 'posts', 'courses', 'levels'])
@connect(state => ({
  files: dataToJS(state.firebase, 'files'),
  courses: dataToJS(state.firebase, 'courses'),
  posts: dataToJS(state.firebase, 'posts'),
  levels: dataToJS(state.firebase, 'levels')
}))
class Home extends Component {

  componentDidMount() {
    this.props.setLoading(false); // Move this to API callback when implemented (if ever)
    const el = document.querySelector('.js-main');
    el.classList = '';
    el.classList.add('main', 'js-main', 'home-page', 'has-hero');

    animateCss(showElem('.hero .world-map'), 'slideInUp', () => {
      animateCss(showElem('.hero .hero-content'), 'fadeInUp', () => {
        animateCss(showElem('.hero .elevator-pitch'), 'fadeInUp');
        animateCss(showElem('.hero .circle'), 'fadeInUp');
      });
    });
  }

  render() {
    let coursesList = <div className="loader-small" />;
    let postsList = <div className="loader-small" />;

    if (isLoaded(this.props.courses) && !isEmpty(this.props.courses) && isLoaded(this.props.files) && !isEmpty(this.props.files) && isLoaded(this.props.levels) && !isEmpty(this.props.levels)) {
      coursesList = <ul className="cards-list posts-list">{renderCards('courses', this.props)}</ul>;
    }

    if (isLoaded(this.props.posts) && !isEmpty(this.props.posts) && isLoaded(this.props.files) && !isEmpty(this.props.files)) {
      postsList = <ul className="cards-list posts-list">{renderCards('blog', this.props)}</ul>;
    }

    return (
      <section className="home page">
        <div className="hero">
          <Icon glyph={World} className="world-map" />
          <div className="hero-content">
            <Icon glyph={Logo} className="logo" />
            <div className="slogan">
              <div className="word word1">Open</div>
              <div className="word word2">Realtime</div>
              <div className="word word3">Education</div>
            </div>
          </div>
          <div className="elevator-pitch">
            <p>Nekomy is an international learning platform. You can study anytime, anywhere and network with your classmates around the world! You can also earn money by uploading your courses...</p>
            <p>
              <button className="btn btn-primary">Upload your course now</button>
            </p>
          </div>
          <div className="circle tooltip usa">JF<div className="spinner" />
            <span className="tooltip-text top">Jeff Francis<span>San Francisco, USA</span>
            </span>
          </div>
          <div className="circle tooltip brazil">MC<div className="spinner" />
            <span className="tooltip-text top">Maria Castro<span>Rio de Janeiro, Brazil</span>
            </span>
          </div>
          <div className="circle tooltip argentina">LU<div className="spinner" />
            <span className="tooltip-text top">Leonardo Ugarte<span>Buenos Aires, Argentina</span>
            </span>
          </div>
          <div className="circle tooltip spain">JM<div className="spinner" />
            <span className="tooltip-text top">Joan Mira<span>Alicante, Spain</span>
            </span>
          </div>
          <div className="circle tooltip uk">TG<div className="spinner" />
            <span className="tooltip-text top">Tina Goldfinger<span>London, UK</span>
            </span>
          </div>
          <div className="circle tooltip france">FT<div className="spinner" />
            <span className="tooltip-text top">Fiona Toulouse<span>Coding Student</span><span>Paris, France</span>
            </span>
          </div>
          <div className="circle tooltip usa2">JL<div className="spinner" />
            <span className="tooltip-text top">Jennifer Lawrence<span>Maths teacher</span>
              <span>New York, USA</span>
            </span>
          </div>
          <div className="circle tooltip colombia">FL<div className="spinner" />
            <span className="tooltip-text top">Fernando Lopez<span>Bogota, Colombia</span>
            </span>
          </div>
          <div className="circle tooltip africa1">DS<div className="spinner" />
            <span className="tooltip-text top">Daniel Da Silva<span>Johannesburg, South Africa</span>
            </span>
          </div>
          <div className="circle tooltip africa2">EI<div className="spinner" />
            <span className="tooltip-text top">Eniola Iquo<span>Lagos, Nigeria</span>
            </span>
          </div>
          <div className="circle tooltip russia1">AB<div className="spinner" />
            <span className="tooltip-text top">Alexei Borislav<span>Moscow, Russia</span>
            </span>
          </div>
          <div className="circle tooltip arabia">AR<div className="spinner" />
            <span className="tooltip-text top">Amira Raheem<span>Baghdad, Iraq</span>
            </span>
          </div>
          <div className="circle tooltip india">AH<div className="spinner" />
            <span className="tooltip-text top">Ankit Harish<span>New Delhi, India</span>
            </span>
          </div>
          <div className="circle tooltip china">HM<div className="spinner" />
            <span className="tooltip-text top">Huan Mei<span>Xian, China</span>
            </span>
          </div>
          <div className="circle tooltip japan">WM<div className="spinner" />
            <span className="tooltip-text top">Watanabe Miyazaki<span>Tokyo, Japan</span>
            </span>
          </div>
          <div className="circle tooltip thailand">LK<div className="spinner" />
            <span className="tooltip-text top">Lawan Kanda<span>Bangkok, Thailand</span>
            </span>
          </div>
          <div className="circle tooltip philippines">SG<div className="spinner" />
            <span className="tooltip-text top">Sonia Gutierrez<span>Manila, Philippines</span>
            </span>
          </div>
          <div className="circle tooltip indonesia">SW<div className="spinner" />
            <span className="tooltip-text top">Sari Wati<span>Kuala Lumpur, Indonesia</span>
            </span>
          </div>

          <div className="line teacher-l1" />
          <div className="line teacher-l2" />
          <div className="line teacher-l3" />
          <div className="line teacher-l4" />
        </div>
        <div className="cards courses">
          <h2 className="cards-heading">Latest courses</h2>
          {coursesList.type === 'ul' ? coursesList :
          <Link to="/upload">
            <button className="btn btn-primary">Upload your first course</button>
          </Link>}
        </div>
        <div className="cards posts">
          <h2 className="cards-heading">Latest stories</h2>
          {postsList.type === 'ul' ? postsList :
          <Link to="/admin">
            <button className="btn btn-primary">Write your first post</button>
          </Link>}
        </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(Home);
