import React, { Component, PropTypes } from 'react';
import { history } from '../../../store';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import Breadcrumbs from '../breadcrumbs/breadcrumbs';
import Search from '../search/search';
import Helpers from '../../common/helpers';
import $ from 'jquery';
import Icon from '../lib/icon/icon';
import Star from '../../../../../static/star.svg';
import Mail from '../../../../../static/mail.svg';
import SearchIcon from '../../../../../static/search.svg';
import Close from '../../../../../static/x.svg';
import Forward from '../../../../../static/forward.svg';
import Back from '../../../../../static/back.svg';
import Logout from '../../../../../static/logout.svg';
import Chat from '../../../../../static/chat.svg';

class Navigation extends Component {

	constructor(props) {
		super(props);
		
		this.loadQuestion = this.loadQuestion.bind(this);
		this.resetNav = this.resetNav.bind(this);
		this.renderTopic = this.renderTopic.bind(this);
		this.renderQuestion = this.renderQuestion.bind(this);
		this.clickItem = this.clickItem.bind(this);
		this.setItem = this.setItem.bind(this);
		this.goBack = this.goBack.bind(this);
		
		this.state = {
			currentItem: null,
			initialised: false
		}
	}
	
	componentDidMount() {
		history.listen( location => {
			let id = location.query.question_id || location.pathname.substring(1);
			this.checkLocation(id);
		});
	}
	
	componentDidUpdate() {	
		if(this.props.topics.data.length > 0 && !this.state.initialised) {
			this.setState({initialised: true}, function() {
				this.checkLocation(this.props.location.query.question_id);
			});
		}
	}
	
	checkLocation(id) {
		if (isNaN(parseInt(id))) this.resetNav(id); // If the question ID is not a number then reset to home
		else {
			let index = Helpers.findTopicIndexOfQuestion(this.props.topics, id);
			if (index) {
				if (this.props.topics.data[index].relationships.parent.data) {
					this.setItem(this.props.topics.data[index].relationships.parent.data.id, this.props.topics.data[index].id);
				}
			}
		}
	}
	
	resetNav(id) {
		if (id !== undefined) {
			(id === '') ? this.setState({currentItem: {id: 'home', level: 0, name: 'Home', submenu: null}}) : this.setState({currentItem: {id: null, level: 0, name: '', submenu: null}});
		}
		else this.setState({currentItem: {id: null, level: 0, name: '', submenu: null}});
	}
	
	setItem(id, submenu = null) {
		let index = Helpers.findIndex(this.props.topics, id);
		
		if (index >= 0) {
			this.setState({currentItem: {id: id, level: this.props.topics.data[index].attributes.level + 1, name: this.props.topics.data[index].attributes.name, submenu: submenu}});
		}
	}
	
	goBack() {
		this.setState({currentItem: {id: null, level: this.state.currentItem.level - 1, name: '', submenu: null}});
	}
	
	loadQuestion(id) {
		//history.push('/insights?question_id=' + id);
		if (this.props.navigating) this.props.toggleNav();
	}
	
	clickItem(event) {
		let $el = $(event.currentTarget).closest('.nav-topic'),
			id = $el.data('id');
		
		if (!$el.hasClass('disabled')) { // Don't do anything if the item is disabled
			if ($el.hasClass('has-topics')) this.setItem(id); // Navigating to another topic
			else if ($el.hasClass('has-questions')) $el.toggleClass('opened'); // Toggling topic's questions submenu
		}
	}
	
	renderTopic(item, i) {

		let hidden = '';
		let opened = '';
		
		if (this.state.currentItem) {
			let matchLevel = (this.state.currentItem.level == item.attributes.level) ? true : false;
			let matchParent = true;
			
			if (this.state.currentItem.level > 0)
				matchParent = (item.relationships.parent.data && this.state.currentItem.id == item.relationships.parent.data.id) ? true : false;
			
			hidden = (matchLevel && matchParent) ? '' : 'hidden';
			opened = (this.state.currentItem.submenu == item.id) ? 'opened' : '';
			//console.log(item.id, opened);
		}
		
		let disabled = (item.attributes.status !== 'active') ? 'disabled' : '';
		let hasTopics = (item.relationships.topics.data.length > 0) ? 'has-topics' : '';
		let hasQuestions = (item.relationships.questions.data.length > 0) ? 'has-questions' : '';
		
		return <li className={`nav-topic ${opened} ${disabled} ${hidden} ${hasTopics} ${hasQuestions}`} key={i} data-parent={item.relationships.parent.data ? item.relationships.parent.data.id : ''} data-id={item.id} data-level={item.attributes.level}>
			<span className="title" onClick={this.clickItem}>{item.attributes.name}</span><Icon glyph={Forward} />
			<span className={`status ${item.attributes.status}`}>{item.attributes.status.replace(/_/g, ' ')}</span>
			{(item.relationships.questions.data && this.props.questions.data) ? <ul className="nav-questions">
				{item.relationships.questions.data.map((question, j) => this.renderQuestion(question, j))}
			</ul>: ''}
		</li>
	}
														   
	renderQuestion(item, i) {
		let questionActive = (this.props.location.query.question_id === item.id) ? 'active' : '';
		let index = Helpers.findIndex(this.props.questions, item.id);
		
		return (this.props.questions.data[item.id]) ? <li key={i} className={`nav-question ${questionActive}`} onClick={(id) => {this.loadQuestion(id) }} data-id={item.id}><Link to={`/insights?question_id=${item.id}`}>{this.props.questions.data[index].attributes.short_title}</Link></li> : '';
	}
														   
	render() {
		let goBackHidden = (this.state.currentItem && this.state.currentItem.level > 0) ? '' : 'hidden';
		return (
			<nav className="navigation">
				<Breadcrumbs location={this.props.location} setItem={this.setItem} resetNav={this.resetNav} />
				<div className="sidenav js-sidenav flyout">
					<button className="mobile-close" onClick={() => {this.props.toggleNav() }}><Icon glyph={Close} className="icon close" /></button>
					<table className="mobile-nav-items">
						<tbody>
							<tr>
								<td><Link to="/favourites" className="mobile-nav-item" onClick={() => {this.props.toggleNav() }}><Icon glyph={Star} className="icon star" /></Link></td>
								<td><Link to="/inbox" className="mobile-nav-item" onClick={() => {this.props.toggleNav() }}><Icon glyph={Mail} className="icon mail" /></Link></td>
								<td><button className="mobile-nav-item" onClick={() => {this.props.toggleSearch() }}><Icon glyph={SearchIcon} className="icon search" /></button></td>
								<td><button className="mobile-nav-item"><Icon glyph={Chat} /></button></td>
								<td><button className="mobile-nav-item" onClick={() => {this.props.toggleLogout() }}><Icon glyph={Logout} className="icon logout" /></button></td>
							</tr>
						</tbody>
					</table>
					<div className="nav-scroll">
						<ul className="nav-topics">
							<li className={`nav-back ${goBackHidden}`} onClick={this.goBack}><span className="title"><Icon glyph={Back} /> Go back</span></li>
						</ul>
					</div>
				</div>
				<Search closeSearch={this.props.closeSearch} />
			</nav>
		)
	}
}

const mapStateToProps = ({ }) => ({ });

export default connect(mapStateToProps)(Navigation);