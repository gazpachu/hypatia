import React, { Component, PropTypes } from 'react';
import { setLoading, setFilters } from '../../actions/actions';
import {connect} from 'react-redux';
import { Link } from 'react-router';
import { firebase, helpers } from 'redux-react-firebase';
import $ from 'jquery';
import moment from 'moment';
import showdown from 'showdown';
import Icon from '../common/lib/icon/icon';
import Back from '../../../../static/svg/back.svg';
import Calendar from '../../../../static/svg/calendar2.svg';
import Course from '../../../../static/svg/course.svg';
import Users from '../../../../static/svg/users.svg';
import Forward from '../../../../static/svg/forward.svg';
import World from '../../../../static/svg/world.svg';
import Logo from '../../../../static/svg/logo.svg';

const {isLoaded, isEmpty, dataToJS} = helpers;

@firebase( [
  	'files',
	'posts',
	'courses'
])
@connect(
  	({firebase}) => ({
		files: dataToJS(firebase, 'files'),
    	posts: dataToJS(firebase, 'posts'),
		courses: dataToJS(firebase, 'courses')		
  	})
)
class Home extends Component {
    
	constructor(props) {
		super(props);
		
		this.converter = new showdown.Converter();
		this.storageRef =  this.props.firebase.storage().ref();
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
		let newList = [],
			className = type.substring(0, type.length-1) + '-card',
			path = (type === 'posts') ? 'news' : 'courses';
		
		if (isLoaded(this.props[type]) && !isEmpty(this.props[type])) {
			newList = Object.keys(this.props[type]).map(function(key) {
				let item = this.props[type][key],
					date = (type === 'courses') ? item.startDate : item.date;

				if (item.status === 'active') {
					return <li key={key} ref={`${className}-${key}`} className={className}>
						{item.featuredImage ? <Link to={`/${path}/${item.slug}`}><div className="thumb image" style={{backgroundImage: 'url(' + this.props.files[item.featuredImage].url + ')'}}></div></Link> : <div className="thumb"><span>{item.code}</span></div>}
						<div className="item-content clearfix">
							<h3 className="title"><Link to={`/${path}/${item.slug}`}>{item.title}</Link></h3>
							<div className="meta">
								<p><Icon glyph={Calendar} />{(type === 'courses') ? 'Starts ' : ''}
									<span className="date">{item.startDate || item.date ? moment(date).format('D/M/YYYY') : 'anytime'}</span>
									{(type === 'courses' && item.level) ? <span><Icon glyph={Course} />{item.level}</span> : ''}
								</p>
							</div>
							<div className="content" dangerouslySetInnerHTML={{__html: this.converter.makeHtml(item.content1)}}></div>
							{(type === 'posts') ? 
								<div className="actions">
									<button className="btn btn-xs btn-secondary float-right"><Link to={`/${path}/${item.slug}`}>Read more</Link></button>
								</div>
							: <div className="info">
									<span className="enrolled"><Icon glyph={Users} /> 1.5K enrolled</span>
									{item.price ? <span className="price">{item.price}€</span> : ''}
							</div>}
						</div>
					</li>;
				}
				else {
					return '';
				}
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
					<div className="circle tooltip usa">JF<div className="spinner"></div><span className="tooltip-text top">Jeff Francis<span>San Francisco, USA</span></span></div>
					<div className="circle tooltip brazil">MC<div className="spinner"></div><span className="tooltip-text top">Maria Castro<span>Rio de Janeiro, Brazil</span></span></div>
					<div className="circle tooltip argentina">LU<div className="spinner"></div><span className="tooltip-text top">Leonardo Ugarte<span>Buenos Aires, Argentina</span></span></div>
					<div className="circle tooltip spain">JM<div className="spinner"></div><span className="tooltip-text top">Joan Mira<span>Alicante, Spain</span></span></div>
					<div className="circle tooltip uk">TG<div className="spinner"></div><span className="tooltip-text top">Tina Goldfinger<span>London, UK</span></span></div>
					<div className="circle tooltip france">FT<div className="spinner"></div><span className="tooltip-text top">Fiona Toulouse<span>Paris, France</span></span></div>
					<div className="circle tooltip active usa2">JL<div className="spinner"></div><span className="tooltip-text top">Jennifer Lawrence<span>Maths teacher</span><span>New York, USA</span></span></div>
					<div className="circle tooltip colombia">FL<div className="spinner"></div><span className="tooltip-text top">Fernando Lopez<span>Bogota, Colombia</span></span></div>
					<div className="circle tooltip africa1">DS<div className="spinner"></div><span className="tooltip-text top">Daniel Da Silva<span>Johannesburg, South Africa</span></span></div>
					<div className="circle tooltip africa2">EI<div className="spinner"></div><span className="tooltip-text top">Eniola Iquo<span>Lagos, Nigeria</span></span></div>
					<div className="circle tooltip russia1">AB<div className="spinner"></div><span className="tooltip-text top">Alexei Borislav<span>Moscow, Russia</span></span></div>
					<div className="circle tooltip arabia">AR<div className="spinner"></div><span className="tooltip-text top">Amira Raheem<span>Baghdad, Iraq</span></span></div>
					<div className="circle tooltip india">AH<div className="spinner"></div><span className="tooltip-text top">Ankit Harish<span>New Delhi, India</span></span></div>
					<div className="circle tooltip china">HM<div className="spinner"></div><span className="tooltip-text top">Huan Mei<span>Xian, China</span></span></div>
					<div className="circle tooltip japan">WM<div className="spinner"></div><span className="tooltip-text top">Watanabe Miyazaki<span>Tokyo, Japan</span></span></div>
					<div className="circle tooltip thailand">LK<div className="spinner"></div><span className="tooltip-text top">Lawan Kanda<span>Bangkok, Thailand</span></span></div>
					<div className="circle tooltip philippines">SG<div className="spinner"></div><span className="tooltip-text top">Sonia Gutierrez<span>Manila, Philippines</span></span></div>
					<div className="circle tooltip indonesia">SW<div className="spinner"></div><span className="tooltip-text top">Sari Wati<span>Kuala Lumpur, Indonesia</span></span></div>
					
					<div className="line teacher-l1"></div>
					<div className="line teacher-l2"></div>
					<div className="line teacher-l3"></div>
					<div className="line teacher-l4"></div>
				</div>
				<div className="courses">
					<h2 className="section-heading">Most popular courses</h2>
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