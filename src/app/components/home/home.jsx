import React, { Component, PropTypes } from 'react';
import { setLoading, setFilters } from '../../actions/actions';
import { connect } from 'react-redux';
import $ from 'jquery';
import Icon from '../common/lib/icon/icon';

import Menu from '../../../../static/menu.svg';
import Search from '../../../../static/search.svg';
import Filter from '../../../../static/filter.svg';
import Log from '../../../../static/log.svg';
import Download from '../../../../static/download.svg';
import StarOutline from '../../../../static/star-outline.svg';
import Star from '../../../../static/star.svg';
import Share from '../../../../static/share.svg';
import Mail from '../../../../static/mail.svg';
import LighthouseLogo from '../../../../static/lighthouse-logo.svg';


class Home extends Component {
    
	constructor(props) {
		super(props);
	}
	
	componentDidMount() {
		this.props.setLoading(false);  // Move this to API callback when implemented (if ever)
		$('.js-main').removeClass().addClass('main js-main home-page');
	}
	
	componentDidUpdate() {
		// Spotlight semi easter egg to display only at night time
		var hr = (new Date()).getHours();

		if ((hr > 18 || hr < 8) && this.props.isDesktop) {
			var $spotLight = $('.spotlight');
			$spotLight.show();
			$(document).on('mousemove', function(e){
				$('.spotlight').css('left', e.clientX - 100).css('top', e.clientY - 100);
			});
		}
	}
	
	render() {
		return (
            <section className="home page container-fluid">
				<div className="spotlight"></div>
				<div className="ray"></div>
				<Icon className="icon animated slideInLeft lighthouse" glyph={LighthouseLogo} />
				<div className="col-md-9 col-md-offset-2">
					<div className="col-md-6">
						<h3 className="animated tada">Welcome!</h3>
						<p className="intro">Lighthouse is a centralised visualisation tool.<br/>A fixed point to help you navigate a complex sea of data, guiding you towards actionable insights.</p>
					</div>						
				</div>
				
				<div className="col-md-9 col-md-offset-2 features">
					<div className="col-md-6">
						<ul className="feature-list">
							<li className="feature-item">
								<span className="icon-holder">
									<Icon glyph={Menu} className="icon menu" /><Icon glyph={Search} />
								</span>
								Use the menu or search to find questions you'd like answered.
							</li>
							<li className="feature-item">
								<span className="icon-holder">
									<Icon glyph={Filter} />
								</span>
								Adjust the parameters for the chart and table.
							</li>
							<li className="feature-item">
								<span className="icon-holder">
									<Icon glyph={Log} />
								</span>
								Not sure why the data has changed? View the event logs.
							</li>
							<li className="feature-item">
								<span className="icon-holder">
									<Icon glyph={Download} />
								</span>
								Download a report.
							</li>
						</ul>
					</div>
					<div className="col-md-6">
						<ul className="feature-list">
							<li className="feature-item">
								<span className="icon-holder">
									<Icon glyph={StarOutline} />
								</span>
								Need something on the regular? Add it to your favourites.
							</li>
							<li className="feature-item">
								<span className="icon-holder">
									<Icon glyph={Star} />
								</span>
								View your favourite items.
							</li>
							<li className="feature-item">
								<span className="icon-holder">
									<Icon glyph={Share} />
								</span>
								Send a report to a colleague's inbox, with an email alert too.
							</li>
							<li className="feature-item">
								<span className="icon-holder">
									<Icon glyph={Mail} />
								</span>
								View reports sent to your inbox.
							</li>
						</ul>						
					</div>					
				</div>
				<div className="col-md-12 footer"></div>
            </section>
		)
	}
}

const mapDispatchToProps = {
	setLoading
}

const mapStateToProps = ({ mainReducer: { isDesktop } }) => ({ isDesktop });

export default connect(mapStateToProps, mapDispatchToProps)(Home);