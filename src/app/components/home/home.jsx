import React, { Component, PropTypes } from 'react';
import { setLoading, setFilters } from '../../actions/actions';
import {connect} from 'react-redux';
import { Link } from 'react-router';
import Hero from '../common/hero/hero';
import { firebase, helpers } from 'redux-react-firebase';
//import { database, storage } from '../../constants/firebase';
import $ from 'jquery';
import moment from 'moment';
import showdown from 'showdown';
import Icon from '../common/lib/icon/icon';
import Back from '../../../../static/svg/back.svg';
import Forward from '../../../../static/svg/forward.svg';
import World from '../../../../static/svg/world.svg';
import Logo from '../../../../static/svg/logo.svg';

const {isLoaded, isEmpty, dataToJS} = helpers;

@firebase( [
  	'posts'
])
@connect(
  	({firebase}) => ({
    	posts: dataToJS(firebase, 'posts'),
  	})
)
class Home extends Component {
    
	constructor(props) {
		super(props);
	}
	
	componentDidMount() {
		this.props.setLoading(false);  // Move this to API callback when implemented (if ever)
		$('.js-main').removeClass().addClass('main js-main home-page has-hero');
		
//		firebase.database().ref('posts/0').set({
//			title: "New virtual campus",
//			slug: "new-virtual-campus",
//			content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin auctor pretium arcu, ac ultrices ipsum hendrerit vitae. Nunc at efficitur leo. Nulla tellus mauris, feugiat in mauris volutpat, dictum pellentesque dui. Etiam sed scelerisque odio. Nam fringilla ligula sed tincidunt dapibus. Maecenas eget purus malesuada, blandit nisl in, ornare metus. Phasellus nec sem ipsum. Nulla non enim tristique, pretium leo id, congue lorem. Etiam vitae consectetur tortor. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Maecenas sed lobortis felis. Vestibulum tristique aliquam nunc, nec consectetur metus condimentum feugiat. Praesent at magna a leo tincidunt volutpat ac a mauris.\n\nProin nec orci eu odio faucibus commodo. Donec sed turpis viverra, hendrerit nunc sed, rutrum est. Cras pellentesque libero vel maximus viverra. Fusce dictum nisi euismod rutrum lobortis. Praesent sed magna quam. Mauris eu risus tempor, ullamcorper nulla eu, dignissim nulla. Integer viverra ipsum eget eros feugiat, tempus pulvinar tellus facilisis. Vivamus sed magna ac ipsum tincidunt suscipit sit amet non velit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris tempus eleifend mi, in auctor quam. Integer ut metus fringilla nunc cursus molestie. Praesent eget tortor sagittis, viverra felis sit amet, tempor lectus.\n\nEtiam leo elit, tempor ac tellus eget, commodo mattis orci. Nullam quis mauris eu augue interdum hendrerit. Quisque vehicula aliquet consequat. Nulla in facilisis neque. Proin ut neque auctor, hendrerit purus et, feugiat est. Maecenas sed ornare libero. Nullam ut facilisis ex, elementum sodales urna. Aenean rhoncus blandit nibh, quis sollicitudin augue pretium pellentesque. Aliquam ac sodales nunc, ut mattis massa.\n\nDonec finibus, risus et maximus tempor, risus tortor sagittis velit, vitae commodo lacus nisi quis arcu. Proin aliquet iaculis nulla ut consequat. Vivamus gravida pulvinar neque, eu ultrices nisi dapibus non. Quisque ac diam volutpat, bibendum ligula vel, faucibus purus. Ut nec magna urna. Phasellus dolor massa, rutrum ut luctus interdum, fringilla eget dolor. Nam vitae orci sed felis molestie posuere. Quisque vitae felis commodo, faucibus risus vitae, tristique diam. Pellentesque porttitor rhoncus libero, eu ullamcorper metus blandit a. Pellentesque sed risus turpis.",
//			timestamp: 1479760748,
//			author: "gazpachu",
//		  });
		
//		firebase.database().ref('/posts/').once('value').then(function(snapshot) {
//		  	console.log(snapshot.val());
//		});
		
		$('.hero .world-map').show().animateCss('slideInUp', function() {
			$('.hero .hero-content').show().animateCss('fadeInUp');
		});
	}
	
	renderItem(post, id) {
		
//		let imgRef = firebase.storage().child('posts/' + post.slug + '.jpg');
//		imgRef.getDownloadURL().then(function(url) {
//		  	this.refs['post-'+id+'-img'].src = url;
//		}.bind(this)).catch(function(error) {
//		  console.log(error);
//		});
		
		const converter = new showdown.Converter();
		
		return <li key={id} id={id} ref={`post-${id}`} className="featured-post">
			<h1 className="post-title"><Link to={`/news/${post.slug}`}>{post.title}</Link></h1>
			<img className="post-image" ref={`post-${id}-img`} />
			<div className="post-meta">
				<p>By <span className="post-author">{post.author}</span> on <span className="post-data">{moment(post.data).format('D/M/YYYY')}</span></p>
			</div>
			<div className="post-content" dangerouslySetInnerHTML={{__html: converter.makeHtml(post.content)}}></div>
		</li>;
	}
	
	render() {
		const {firebase, posts} = this.props;
		
		const postsList = (!isLoaded(posts)) ? 'Loading' : (isEmpty(posts) ) ? 'News list is empty' : posts.map((post, id) => this.renderItem(post, id));
		
		return (
            <section className="home page">
				<div className="hero">
					<Icon glyph={World} className="world-map" />
					<div className="hero-content">
						<Icon glyph={Logo} className="logo" />
						<div className="slogan">Ultimate Realtime Education</div>
					</div>
				</div>
				<div className="columns">
					<div className="news column">
						<ul className="posts">
							{postsList}
						</ul>
					</div>
					<div className="courses column">
						<h2 className="courses-heading">Coming up courses. Enroll now</h2>
						<ul className="courses-list">
							<li className="course-item"><span className="course-title">Multimedia</span>, 4 slots available. Starts in 1 days</li>
							<li className="course-item"><span className="course-title">Journalism</span>, 4 slots available. Starts in 1 days</li>
							<li className="course-item"><span className="course-title">Climate change</span>, 4 slots available. Starts in 1 days</li>
							<li className="course-item"><span className="course-title">Economics</span>, 4 slots available. Starts in 1 days</li>
							<li className="course-item"><span className="course-title">Art History</span>, 4 slots available. Starts in 1 days</li>
							<li className="course-item"><span className="course-title">Multimedia</span>, 4 slots available. Starts in 1 days</li>
							<li className="course-item"><span className="course-title">Multimedia</span>, 4 slots available. Starts in 1 days</li>
						</ul>
						<div className="courses-nav">
							<Icon glyph={Back} />
							<Icon glyph={Forward} />
						</div>
						<h3 className="new-courses-heading">New courses</h3>
						<ul className="new-courses-list">
							<li className="course-item">
								<div className="course-thumb"></div>
								<span className="course-title">Self-driving cars</span>
								<span>Starts in 1 days</span>
							</li>
							<li className="course-item">
								<div className="course-thumb"></div>
								<span className="course-title">Nanotechnology</span>
								<span>Starts in 1 days</span>
							</li>
							<li className="course-item">
								<div className="course-thumb"></div>
								<span className="course-title">Microwaves</span>
								<span>Starts in 1 days</span>
							</li>
							<li className="course-item">
								<div className="course-thumb"></div>
								<span className="course-title">Mathematics</span>
								<span>Starts in 1 days</span>
							</li>
							<li className="course-item">
								<div className="course-thumb"></div>
								<span className="course-title">English II</span>
								<span>Starts in 1 days</span>
							</li>
							<li className="course-item">
								<div className="course-thumb"></div>
								<span className="course-title">French I</span>
								<span>Starts in 1 days</span>
							</li>
						</ul>
					</div>
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