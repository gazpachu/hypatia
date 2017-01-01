import React, { Component, PropTypes } from 'react';
import { setLoading } from '../../actions/actions';
import {connect} from 'react-redux';
import { Link } from 'react-router';
import { firebase, helpers } from 'redux-react-firebase';
import Helpers from '../common/helpers';
import $ from 'jquery';
import Icon from '../common/lib/icon/icon';
import Back from '../../../../static/svg/back.svg';
import Forward from '../../../../static/svg/forward.svg';
import World from '../../../../static/svg/world.svg';
import Logo from '../../../../static/svg/logo.svg';

const {isLoaded, isEmpty, dataToJS} = helpers;

@firebase( [
  	'files',
	'posts',
	'courses',
	'levels'
])
@connect(
  	({firebase}) => ({
		files: dataToJS(firebase, 'files'),
    	posts: dataToJS(firebase, 'posts'),
		courses: dataToJS(firebase, 'courses'),
		levels: dataToJS(firebase, 'levels')
  	})
)
class Home extends Component {
    
	constructor(props) {
		super(props);
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
	
	render() {
		let postsList = null;
		let coursesList = null;
		
		if (isLoaded(this.props.courses) && !isEmpty(this.props.courses) && isLoaded(this.props.files) && !isEmpty(this.props.files))
			postsList = <ul className="cards-list courses-list">{Helpers.renderCards.call(this, 'news')}</ul>;
		else
			postsList = <div className="loader-small"></div>;
		
		if (isLoaded(this.props.posts) && !isEmpty(this.props.posts) && isLoaded(this.props.files) && !isEmpty(this.props.files) && isLoaded(this.props.levels) && !isEmpty(this.props.levels))
			coursesList = <ul className="cards-list posts-list">{Helpers.renderCards.call(this, 'courses')}</ul>;
		else
			coursesList = <div className="loader-small"></div>;
		
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
				<div className="cards courses">
					<h2 className="cards-heading">Most popular courses</h2>
					{coursesList}
				</div>
           		<div className="cards posts">
					<h2 className="cards-heading">Latest news</h2>
					{postsList}
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