import React, { Component, PropTypes } from 'react';
import { setLoading, setFilters } from '../../actions/actions';
import {connect} from 'react-redux';
import { Link } from 'react-router';
import { firebase, helpers } from 'redux-react-firebase';
//import { database, storage } from '../../constants/firebase';
import $ from 'jquery';
import moment from 'moment';
import showdown from 'showdown';
import Icon from '../common/lib/icon/icon';
import Back from '../../../../static/svg/back.svg';
import Calendar from '../../../../static/svg/calendar2.svg';
import Forward from '../../../../static/svg/forward.svg';
import World from '../../../../static/svg/world.svg';
import Logo from '../../../../static/svg/logo.svg';

const {isLoaded, isEmpty, dataToJS} = helpers;

@firebase( [
  	'posts',
	'courses'
])
@connect(
  	({firebase}) => ({
    	posts: dataToJS(firebase, 'posts'),
		courses: dataToJS(firebase, 'courses'),
  	})
)
class Home extends Component {
    
	constructor(props) {
		super(props);
		
		this.converter = new showdown.Converter();
	}
	
	componentDidMount() {
		this.props.setLoading(false);  // Move this to API callback when implemented (if ever)
		$('.js-main').removeClass().addClass('main js-main home-page has-hero');
		
		$('.hero .world-map').show().animateCss('slideInUp', function() {
			$('.hero .hero-content').show().animateCss('fadeInUp', function() {
				$('.hero .elevator-pitch').show().animateCss('fadeInUp');
				$('.hero .circle').show().animateCss('fadeInUp');				
			});
		});
	}
	
	renderItems(type) {
		const {firebase} = this.props;
		
		let newList = [],
			className = type.substring(0, type.length-1),
			path = (type === 'posts') ? 'news' : 'courses',
			storageRef =  firebase.storage().ref();
		
		if (isLoaded(this.props[type]) && !isEmpty(this.props[type])) {
			newList = Object.keys(this.props[type]).map(function(key) {
					let item = this.props[type][key];
				
					// Load post image from firebase storage
					let imgRef = storageRef.child(type + '/' + item.slug + '.jpg');
					if (imgRef) imgRef.getDownloadURL().then(function(url) {
						this.refs[className+'-'+key+'-img'].src = url;
					}.bind(this)).catch(function(error) {
					  console.log(error);
					});
				
					return <li key={key} ref={`${className}-${key}`} className={className}>
						{(type === 'posts') ? <img className="image" ref={`${className}-${key}-img`} /> : ''}
						<h3 className="title"><Link to={`/${path}/${item.slug}`}>{(type === 'courses') ? <span className="course-icon">{item.code}</span> : ''}{item.title}</Link></h3>
						<div className="meta">
							<p><Icon glyph={Calendar} />{(type === 'posts') ? <span className="author">By {item.author} </span> : 'Starts '}on <span className="date">{moment(item.startDate).format('D/M/YYYY')}</span></p>
						</div>
						<div className="content" dangerouslySetInnerHTML={{__html: this.converter.makeHtml(item.content1)}}></div>
						<div className="actions">
							{(type === 'courses') ? <button className="btn btn-xs btn-primary enroll-now">Enroll now</button> : ''}
							<button className="btn btn-xs btn-secondary"><Link to={`/${path}/${item.slug}`}>Read more</Link></button>
						</div>
					</li>;
			}.bind(this));
		}
		else return <div className="loader-small"></div>;
		return newList;
	}
	
	render() {
		const postsList = this.renderItems('posts');
		const coursesList = this.renderItems('courses');
		
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
						<p>Hypatia is a <strong>FREE</strong>, Open Source LMS (Learning Management System) focussed in UX and remote coworking. You can use it to build your online school, academy or university.</p>
						<p><button className="btn btn-primary">Start quick tour</button></p>
					</div>
					<div className="circle tooltip usa">JF<div className="spinner"></div><span className="tooltip-text">Jeff Francis<span>San Francisco, USA</span></span></div>
					<div className="circle tooltip brazil">MC<div className="spinner"></div><span className="tooltip-text">Maria Castro<span>Rio de Janeiro, Brazil</span></span></div>
					<div className="circle tooltip argentina">LU<div className="spinner"></div><span className="tooltip-text">Leonardo Ugarte<span>Buenos Aires, Argentina</span></span></div>
					<div className="circle tooltip spain">JM<div className="spinner"></div><span className="tooltip-text">Joan Mira<span>Alicante, Spain</span></span></div>
					<div className="circle tooltip uk">TG<div className="spinner"></div><span className="tooltip-text">Tina Goldfinger<span>London, UK</span></span></div>
					<div className="circle tooltip france">FT<div className="spinner"></div><span className="tooltip-text">Fiona Toulouse<span>Paris, France</span></span></div>
					<div className="circle tooltip active usa2">JL<div className="spinner"></div><span className="tooltip-text">Jennifer Lawrence<span>Maths teacher</span><span>New York, USA</span></span></div>
					<div className="circle tooltip colombia">FL<div className="spinner"></div><span className="tooltip-text">Fernando Lopez<span>Bogota, Colombia</span></span></div>
					<div className="circle tooltip africa1">DS<div className="spinner"></div><span className="tooltip-text">Daniel Da Silva<span>Johannesburg, South Africa</span></span></div>
					<div className="circle tooltip africa2">EI<div className="spinner"></div><span className="tooltip-text">Eniola Iquo<span>Lagos, Nigeria</span></span></div>
					<div className="circle tooltip russia1">AB<div className="spinner"></div><span className="tooltip-text">Alexei Borislav<span>Moscow, Russia</span></span></div>
					<div className="circle tooltip arabia">AR<div className="spinner"></div><span className="tooltip-text">Amira Raheem<span>Baghdad, Iraq</span></span></div>
					<div className="circle tooltip india">AH<div className="spinner"></div><span className="tooltip-text">Ankit Harish<span>New Delhi, India</span></span></div>
					<div className="circle tooltip china">HM<div className="spinner"></div><span className="tooltip-text">Huan Mei<span>Xian, China</span></span></div>
					<div className="circle tooltip japan">WM<div className="spinner"></div><span className="tooltip-text">Watanabe Miyazaki<span>Tokyo, Japan</span></span></div>
					<div className="circle tooltip thailand">LK<div className="spinner"></div><span className="tooltip-text">Lawan Kanda<span>Bangkok, Thailand</span></span></div>
					<div className="circle tooltip philippines">SG<div className="spinner"></div><span className="tooltip-text">Sonia Gutierrez<span>Manila, Philippines</span></span></div>
					<div className="circle tooltip indonesia">SW<div className="spinner"></div><span className="tooltip-text">Sari Wati<span>Kuala Lumpur, Indonesia</span></span></div>
					
					<div className="line teacher-l1"></div>
					<div className="line teacher-l2"></div>
					<div className="line teacher-l3"></div>
					<div className="line teacher-l4"></div>
				</div>
				<div className="courses">
					<h2 className="section-heading">Available courses</h2>
					<ul className="courses-list">
						{coursesList}
					</ul>
				</div>
           		<div className="posts">
					<h2 className="section-heading">Latest news</h2>
					<ul className="posts-list">
						{postsList}
					</ul>
				</div>
            </section>
		)
	}
}

const mapDispatchToProps = {
	setLoading
}

const mapStateToProps = ({ mainReducer: { isDesktop } }) => ({ isDesktop });

export default connect(mapStateToProps, mapDispatchToProps)(Home);