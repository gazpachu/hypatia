import React from 'react';
import $ from 'jquery';
import moment from 'moment';
import classNames from 'classnames';
import { Link } from 'react-router';
import { converter } from '../../constants/constants';
import Icon from './lib/icon/icon';
import Calendar from '../../../../static/svg/calendar2.svg';
import Course from '../../../../static/svg/course.svg';
import Users from '../../../../static/svg/users.svg';

// CSS3 animation helper to cleanup classes after animationd ends
$.fn.extend({
    animateCss: function (animationName, callback) {
        var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
        $(this).addClass('animated ' + animationName).one(animationEnd, function() {
            $(this).removeClass('animated ' + animationName);
            if (callback) callback();
        });
    }
});

// String capitalization
String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

// Common app methods
module.exports = {
	
	renderCards: function(type) {
		let newList = [],
			path = type;

		if (type === 'news') type = 'posts';
		
		newList = Object.keys(this.props[type]).map(function(key) {
			let item = this.props[type][key],
				date = (type === 'courses') ? item.startDate : item.date;

			if (item && item.status && item.status !== 'inactive') {
				return <li key={key} ref={`item-${key}`} className={`card ${type}-card`}>
					<Link to={`/${path}/${item.slug}`}>{item.featuredImage ? <div className="card-thumb card-image" style={{backgroundImage: 'url(' + this.props.files[item.featuredImage].url + ')'}}></div> : <div className="card-thumb"><span>{item.code}</span></div>}</Link>
					<div className="card-wrapper clearfix">
						<h3 className="card-title"><Link to={`/${path}/${item.slug}`}>{item.title}</Link></h3>
						<div className="card-meta">
							<p><Icon glyph={Calendar} />{(type === 'courses') ? 'Starts ' : ''}
								<span className="card-date">{item.startDate || item.date ? moment(date).format('D/M/YYYY') : 'anytime'}</span>
								{(type === 'courses' && item.level) ? <span><Icon glyph={Course} />{this.props.levels[item.level].code}</span> : ''}
							</p>
						</div>
						<div className="card-content" dangerouslySetInnerHTML={{__html: converter.makeHtml(item.content1)}}></div>
						{(type === 'posts') ? 
							<div className="card-actions">
								<button className="btn btn-xs btn-secondary float-right"><Link to={`/${path}/${item.slug}`}>Read more</Link></button>
							</div>
						: (type === 'courses') ? <div className="card-info">
								<span className="card-enrolled"><Icon glyph={Users} /> 1.5K enrolled</span>
								{item.price ? <span className="card-price">{item.price}€</span> : ''}
						</div> : ''}
					</div>
				</li>;
			}
			else {
				return '';
			}
		}.bind(this));
		
		return newList;
	},
	
	slugify: function(string) {
		return string.toLowerCase()
			.replace(/[^\w\s-]/g, '') // remove non-word [a-z0-9_], non-whitespace, non-hyphen characters
			.replace(/[\s_-]+/g, '-') // swap any length of whitespace, underscore, hyphen characters with a single -
			.replace(/^-+|-+$/g, ''); // remove leading, trailing -
	},
	
	copyTextToClipboard: function(text) {
		var textArea = document.createElement("textarea");
		textArea.style.position = 'fixed';
		textArea.style.top = 0;
		textArea.style.left = 0;
		textArea.style.width = '2em';
		textArea.style.height = '2em';
		textArea.style.padding = 0;
		textArea.style.border = 'none';
		textArea.style.outline = 'none';
		textArea.style.boxShadow = 'none';
		textArea.style.background = 'transparent';
		textArea.value = text;

		document.body.appendChild(textArea);
		textArea.select();

		try {
			var successful = document.execCommand('copy');
			var msg = successful ? 'successful' : 'unsuccessful';
			console.log('Copying text command was ' + msg);
		} catch (err) {
			console.log('Oops, unable to copy');
		}

		document.body.removeChild(textArea);
	},
	
	getAppVersion: function(element) {
		$.ajax('/static/version.json').done(function(response) {
			var date = new Date(response.version.buildDate);
			var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
			$(element).html('v' + response.version.version + ' (Built on ' + date.getDate() + ' ' + monthNames[date.getMonth()] + ' ' + date.getFullYear() + ')');
		}).fail(function(error) {
			console.log(error);
		});
	}
}