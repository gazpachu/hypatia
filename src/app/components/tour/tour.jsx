import React, { Component, PropTypes } from 'react';
import { Link, browserHistory } from 'react-router';
import { connect } from 'react-redux';
import { setLoading } from '../../actions/actions';
import $ from 'jquery';
import _ from 'lodash';
import Icon from '../common/lib/icon/icon';

class Tour extends Component {
	
	constructor(props) {
		super(props);
		//this.impressAPI = null;
		
		//this.handleResize = this.handleResize.bind(this);
	}
	
	componentDidMount() {
		this.props.setLoading(false);
		$('.js-main').removeClass().addClass('main js-main tour-page full-screen');
		
//		if ("ontouchstart" in document.documentElement) { 
//			document.querySelector('.hint').innerHTML = "<p>Tap on the left or right to navigate</p>";
//		}
		
//		this.impressAPI = impress();
//		this.impressAPI.init();
//		
//		$('#impress').addEventListener( "impress:init", function( event ) {
//			var api = event.detail.api;
//
//			$('.tour-page').addEventListener( "keydown", function( event ) {
//				if ( event.keyCode === 9 ||
//				   ( event.keyCode >= 32 && event.keyCode <= 34 ) ||
//				   ( event.keyCode >= 37 && event.keyCode <= 40 ) ) {
//					event.preventDefault();
//				}
//			}, false );
//
//			$('.tour-page').addEventListener( "keyup", function( event ) {
//
//				if ( event.shiftKey || event.altKey || event.ctrlKey || event.metaKey ) {
//					return;
//				}
//
//				if ( event.keyCode === 9 ||
//				   ( event.keyCode >= 32 && event.keyCode <= 34 ) ||
//				   ( event.keyCode >= 37 && event.keyCode <= 40 ) ) {
//					switch ( event.keyCode ) {
//						case 33: // Page up
//						case 37: // Left
//						case 38: // Up
//								 api.prev();
//								 break;
//						case 9:  // Tab
//						case 32: // Space
//						case 34: // Page down
//						case 39: // Right
//						case 40: // Down
//								 api.next();
//								 break;
//					}
//
//					event.preventDefault();
//				}
//			}, false );
//
//			$('.tour-page').addEventListener( "click", function( event ) {
//				var target = event.target;
//				while ( ( target.tagName !== "A" ) &&
//						( target !== document.documentElement ) ) {
//					target = target.parentNode;
//				}
//
//				if ( target.tagName === "A" ) {
//					var href = target.getAttribute( "href" );
//
//					if ( href && href[ 0 ] === "#" ) {
//						target = document.getElementById( href.slice( 1 ) );
//					}
//				}
//
//				if ( api.goto( target ) ) {
//					event.stopImmediatePropagation();
//					event.preventDefault();
//				}
//			}, false );
//
//			$('.tour-page').addEventListener( "click", function( event ) {
//				var target = event.target;
//
//				while ( !( target.classList.contains( "step" ) &&
//						  !target.classList.contains( "active" ) ) &&
//						  ( target !== document.documentElement ) ) {
//					target = target.parentNode;
//				}
//
//				if ( api.goto( target ) ) {
//					event.preventDefault();
//				}
//			}, false );
//
//			$('.tour-page').addEventListener( "touchstart", function( event ) {
//				if ( event.touches.length === 1 ) {
//					var x = event.touches[ 0 ].clientX,
//						width = window.innerWidth * 0.3,
//						result = null;
//
//					if ( x < width ) {
//						result = api.prev();
//					} else if ( x > window.innerWidth - width ) {
//						result = api.next();
//					}
//
//					if ( result ) {
//						event.preventDefault();
//					}
//				}
//			}, false );
//
//			window.addEventListener( "resize", _.throttle(this.handleResize, 250 ), false );
//
//		}, false );
	}
	
	componentWillUnmount() {
		//this.impressAPI = null;
	}
	
//	handleResize() {
//		api.goto( document.querySelector( ".step.active" ), 500 );
//	}
	
	render () {
		return (
			<section className="tour page">
				<div className="fallback-message">
					<p>Your browser <b>doesn't support the features required</b>, so you are presented with a simplified version of this presentation.</p>
					<p>For the best experience please use the latest <b>Chrome</b>, <b>Safari</b> or <b>Firefox</b> browser.</p>
				</div>
				<div id="impress">
					<div id="start" className="step quote" data-x="-1000" data-y="-1500">
						<blockquote>
							<p>"Education is the most powerful weapon which you can use to change the world"</p>
							<footer>— Nelson Mandela</footer>
						</blockquote>
					</div>
					
					<div className="step" data-x="0" data-y="-1500">
						<q>And using more and more social media and the Internet</q>
					</div>

					<div className="step" data-x="1000" data-y="-1500">
						<q>Online education is growing very fast</q>
					</div>
					
					<div className="step title" data-x="0" data-y="0" data-scale="4">
						<span className="try">Developing countries</span>
						<h1>are hungry</h1>
						<span className="footnote">for knowledge</span>
					</div>
					
					<div className="step" data-x="850" data-y="3000" data-rotate="90" data-scale="5">
						<p>It’s a <strong>presentation tool</strong> <br/>
						inspired by the idea behind <a href="http://prezi.com">prezi.com</a> <br/>
						and based on the <strong>power of CSS3 transforms and transitions</strong> in modern browsers.</p>
					</div>

					<div id="big" className="step" data-x="3500" data-y="2100" data-rotate="180" data-scale="6">
						<p>visualize your <b>big</b> <span className="thoughts">thoughts</span></p>
					</div>
					
					<div id="tiny" className="step" data-x="2825" data-y="2325" data-z="-3000" data-rotate="300" data-scale="1">
						<p>and <b>tiny</b> ideas</p>
					</div>
					
					<div id="ing" className="step" data-x="3500" data-y="-850" data-rotate="270" data-scale="6">
						<p>by <b className="positioning">positioning</b>, <b className="rotating">rotating</b> and <b className="scaling">scaling</b> them on an infinite canvas</p>
					</div>

					<div id="imagination" className="step" data-x="6700" data-y="-300" data-scale="6">
						<p>the only <b>limit</b> is your <b className="imagination">imagination</b></p>
					</div>

					<div id="source" className="step" data-x="6300" data-y="2000" data-rotate="20" data-scale="4">
						<p>want to know more?</p>
						<q><a href="http://github.com/bartaz/impress.js">use the source</a>, Luke!</q>
					</div>

					<div id="one-more-thing" className="step" data-x="6000" data-y="4000" data-scale="2">
						<p>one more thing...</p>
					</div>
					
					<div id="its-in-3d" className="step" data-x="6200" data-y="4300" data-z="-100" data-rotate-x="-40" data-rotate-y="10" data-scale="2">
						<p><span className="have">have</span> <span className="you">you</span> <span className="noticed">noticed</span> <span className="its">it’s</span> <span className="in">in</span> <b>3D<sup>*</sup></b>?</p>
						<span className="footnote">* beat that, prezi ;)</span>
					</div>
					
					<div id="overview" className="step" data-x="3000" data-y="1500" data-scale="10"></div>
					
					<div className="hint">
						<p>Use the spacebar or arrow keys to navigate</p>
					</div>
				</div>
			</section>
		)
	}
}

const mapStateToProps = null;

const mapDispatchToProps = {
	setLoading
};

export default connect(mapStateToProps, mapDispatchToProps)(Tour);