import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { setLoading, setNotification } from '../../actions/actions';
import * as CONSTANTS from '../../constants/constants';
import { firebase, helpers } from 'redux-react-firebase';
import $ from 'jquery';
import classNames from 'classnames';
import SimpleMDE from 'react-simplemde-editor';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import ModalBox from '../common/modalbox/modalbox'
import Helpers from '../common/helpers';
import Icon from '../common/lib/icon/icon';
import Calendar from '../../../../static/svg/calendar.svg';
import User from '../../../../static/svg/avatar.svg';
import Group from '../../../../static/svg/group.svg';
import Course from '../../../../static/svg/course.svg';
import Subject from '../../../../static/svg/subject.svg';
import Module from '../../../../static/svg/module.svg';
import Activity from '../../../../static/svg/activity.svg';
import Forward from '../../../../static/svg/forward.svg';

const {isLoaded, isEmpty, dataToJS} = helpers;

const defaultProps = {
};

const propTypes = {
	users: PropTypes.object,
	groups: PropTypes.object,
	courses: PropTypes.object,
	subjects: PropTypes.object,
	modules: PropTypes.object,
	activities: PropTypes.object
};

@firebase( [
	'users',
	'groups',
	'courses',
	'subjects',
	'modules',
	'activities'
])
@connect(
  	({firebase}) => ({
		users: dataToJS(firebase, 'users'),
 		groups: dataToJS(firebase, 'groups'),
		courses: dataToJS(firebase, 'courses'),
		subjects: dataToJS(firebase, 'subjects'),
		modules: dataToJS(firebase, 'modules'),
 		activities: dataToJS(firebase, 'activities')
  	})
)
class Admin extends Component {
	
	constructor(props) {
		super(props);
		
		this.state = {
			action: '',
			type: '',
			selectedId: '',
			selectedItem: null,
			modalTitle: ''
		}
	}
	
	componentDidMount() {
		this.props.setLoading(false);
	}
	
	handleSelect(event, action, type) {
		const index = event.target.selectedIndex;
		this.reset();
		event.target.selectedIndex = index;
		this.loadItem(event.target.value, action, type);
	}
	
	loadItem(id, action, type) {
		if (isLoaded(type) && !isEmpty(type) && id !== '') {
			let selectedItem = this.props[type][id];

			this.setState({ action, type, selectedId: id, selectedItem }, function() {
				console.log(this.state.action, this.state.type, this.state.selectedId, this.state.selectedItem);
			}.bind(this));
		}
	}
	
	new(type) {
		this.cancel();
		this.setState({ action: 'new', type });
	}
	
	cancel() {
		this.setState({ action: '', type: '', selectedId: '', selectedItem: null });
		this.reset();
	}
	
	reset() {
		this.refs['users-select'].selectedIndex = 0;
		this.refs['groups-select'].selectedIndex = 0;
		this.refs['courses-select'].selectedIndex = 0;
		this.refs['subjects-select'].selectedIndex = 0;
		this.refs['modules-select'].selectedIndex = 0;
		this.refs['activities-select'].selectedIndex = 0;
	}
	
	save() {
		let item = this.state.selectedItem,
			method = (this.state.action === 'new') ? 'push' : 'set',
			path = (this.state.action === 'new') ? this.state.type : this.state.type + '/' + this.state.selectedId;
		
		item.slug = Helpers.slugify(item.title);
		
		if (item.startDate) item.startDate = moment(item.startDate).format('YYYY-MM-DD');
		if (item.endDate) item.endDate = moment(item.endDate).format('YYYY-MM-DD');
		if (item.gradeDate) item.gradeDate = moment(item.gradeDate).format('YYYY-MM-DD');
			
		this.toggleButtons(false);
		this.props.firebase[method](path, item).then(function(snap) {
			this.toggleButtons(true);
			this.props.setNotification({message: CONSTANTS.ITEM_SAVED, type: 'success'});
			
			if (snap) {
				this.setState({ selectedId: snap.key }, function() {
					this.loadItem(snap.key, 'edit', this.state.type);
				}.bind(this));
			}
		}.bind(this));
	}
	
	delete() {
		this.setState({ modalTitle: CONSTANTS.CONFIRM_DELETE + ' \"' + this.state.selectedItem.title + '\"?'}, function() {
			$('.js-modal-box').show();
			$('.js-overlay').show().animateCss('fade-in');
		});
	}
	
	updateInput(event, prop) {
		this.updateItem(event.target.value, prop);
	}
	
	updateDate(date, prop) {
		if (prop === 'endDate' && moment(date).isBefore(moment(this.state.selectedItem.startDate))) {
			date = this.state.selectedItem.endDate;
		}
		this.updateItem(date, prop);
	}
	
	updateItem(value, prop) {
		const newItem = Object.assign({}, this.state.selectedItem, {[prop]: value});
		this.setState({ selectedItem: newItem });
	}
	
	loadItems(type) {
		return (isLoaded(this.props[type]) && !isEmpty(this.props[type])) ? Object.keys(this.props[type]).map(function(key) {
			let item = this.props[type][key];
			return <option key={key} value={key}>{(type === 'users') ? item.info.firstName + ' ' + item.info.lastName1 + ' ' + item.info.lastName2 : item.title}</option>;
		}.bind(this)) : '';
	}
	
	toggleButtons(state) {
		$(this.refs.remove).toggle(state);
		$(this.refs.save).toggle(state);
		$(this.refs.saveTop).toggle(state);
		$(this.refs.cancel).toggle(state);
		$(this.refs.loader).toggle(!state);
		$(this.refs.loaderTop).toggle(!state);
	}
	
	modalBoxAnswer(answer) {
		if (answer === 'accept') {
			this.toggleButtons(false);
			this.props.firebase.remove(this.state.type+'/'+this.state.selectedId, function() {
				this.toggleButtons(true);
				this.cancel();
				this.props.setNotification({message: CONSTANTS.ITEM_REMOVED, type: 'success'})
			}.bind(this));
		}
	}
	
	toggleElement(ref) {
		$(this.refs[ref]).toggleClass('active');
	}
	
	render () {
		const usersList = this.loadItems('users');
		const groupsList = this.loadItems('groups');
		const coursesList = this.loadItems('courses');
		const subjectsList = this.loadItems('subjects');
		const modulesList = this.loadItems('modules');
		const activitiesList = this.loadItems('activities');
		
		const title = (this.state.selectedItem && this.state.selectedItem.title) ? this.state.selectedItem.title : '';
		const iconHeading = (this.state.type === 'courses') ? <Icon glyph={Course} /> : (this.state.type === 'subjects') ? <Icon glyph={Subject} /> : (this.state.type === 'modules') ? <Icon glyph={Module} /> : <Icon glyph={Activity} />;
		const code = (this.state.selectedItem && this.state.selectedItem.code) ? this.state.selectedItem.code : '';
		const credits = (this.state.selectedItem && this.state.selectedItem.credits) ? this.state.selectedItem.credits : '';
		const startDate = (this.state.selectedItem && this.state.selectedItem.startDate) ? moment(this.state.selectedItem.startDate) : null;
		const endDate = (this.state.selectedItem && this.state.selectedItem.endDate) ? moment(this.state.selectedItem.endDate) : null;
		const gradeDate = (this.state.selectedItem && this.state.selectedItem.gradeDate) ? moment(this.state.selectedItem.gradeDate) : null;
		
		return (
			<section className="admin page container-fluid">
				<div className="columns">
					<div className="blocks column">
						<div className="block clearfix">
							<h3 className="block-title"><Icon glyph={User} />Users<button className="btn btn-primary btn-xs" onClick={() => this.new('users')}>+ add</button></h3>
							<select className="select-items" ref="users-select" onChange={(event) => this.handleSelect(event, 'edit', 'users')}>
								<option value="">Select to edit</option>
								{usersList}
							</select>
							
							<h3 className="block-title"><Icon glyph={Group} />Groups<button className="btn btn-primary btn-xs" onClick={() => this.new('groups')}>+ add</button></h3>
							<select className="select-items" ref="groups-select" onChange={(event) => this.handleSelect(event, 'edit', 'groups')}>
								<option value="">Select to edit</option>
								{groupsList}
							</select>
									
							<h3 className="block-title"><Icon glyph={Course} />Courses<button className="btn btn-primary btn-xs" onClick={() => this.new('courses')}>+ add</button></h3>
							<select className="select-items" ref="courses-select" onChange={(event) => this.handleSelect(event, 'edit', 'courses')}>
								<option value="">Select to edit</option>
								{coursesList}
							</select>
	
							<h3 className="block-title"><Icon glyph={Subject} />Subjects<button className="btn btn-primary btn-xs" onClick={() => this.new('subjects')}>+ add</button></h3>
							<select className="select-items" ref="subjects-select" onChange={(event) => this.handleSelect(event, 'edit', 'subjects')}>
								<option value="">Select to edit</option>
								{subjectsList}
							</select>
		
							<h3 className="block-title"><Icon glyph={Module} />Modules<button className="btn btn-primary btn-xs" onClick={() => this.new('modules')}>+ add</button></h3>
							<select className="select-items" ref="modules-select" onChange={(event) => this.handleSelect(event, 'edit', 'modules')}>
								<option value="">Select to edit</option>
								{modulesList}
							</select>
		
							<h3 className="block-title"><Icon glyph={Activity} />Activities<button className="btn btn-primary btn-xs" onClick={() => this.new('activities')}>+ add</button></h3>
							<select className="select-items" ref="activities-select" onChange={(event) => this.handleSelect(event, 'edit', 'activities')}>
								<option value="">Select to edit</option>
								{activitiesList}
							</select>
						</div>
					</div>
					<div className={classNames('item-content column', {hidden: this.state.action === ''})}>
						<div className="block clearfix">
							<h3 className="block-title">{iconHeading}{(this.state.action === 'new') ? <span>You are adding a new {(this.state.type === 'activities') ? 'activity' : this.state.type.slice(0, -1)}...</span> : <span>You are editing {(this.state.type === 'activities') ? 'an activity' : 'a ' + this.state.type.slice(0, -1)}...</span>}<button className="btn btn-primary btn-xs" ref="saveTop" onClick={() => this.save()}>save in {this.state.type}</button><div className="loader-small" ref="loaderTop"></div></h3>
							<input type="text" className="input-field title-input" ref="title-input" placeholder="Title" value={title} onChange={(event) => this.updateInput(event, 'title')} />
							<input type="text" className="input-field code-input" ref="code-input" placeholder="Code" value={code} onChange={(event) => this.updateInput(event, 'code')} />
							
							<div className="clearfix">
								<div className={classNames('dates-wrapper', {hidden: (this.state.type !== 'courses') && (this.state.type !== 'activities')})}>
									<label>From</label><Icon glyph={Calendar} className="icon calendar" /><DatePicker className="input-field date-input" readOnly selected={startDate} selectsStart startDate={startDate} endDate={endDate} onChange={(date) => this.updateDate(date, 'startDate')} dateFormat="YYYY-MM-DD" />
									<label>Until</label><Icon glyph={Calendar} className="icon calendar" /><DatePicker className="input-field date-input" readOnly selected={endDate} selectsEnd startDate={startDate} endDate={endDate} onChange={(date) => this.updateDate(date, 'endDate')} dateFormat="YYYY-MM-DD" />
									<div className={classNames('grade-wrapper', {hidden: (this.state.type !== 'activities')})}>
										<label>Grade</label><Icon glyph={Calendar} className="icon calendar" /><DatePicker className="input-field date-input" readOnly selected={gradeDate} onChange={(date) => this.updateDate(date, 'gradeDate')} dateFormat="YYYY-MM-DD" />
									</div>
								</div>
								<div className={classNames('credits-wrapper', {hidden: (this.state.type !== 'courses') && (this.state.type !== 'subjects')})}>
									<label>Credits</label><input type="text" className="input-field credits-input" ref="credits-input" placeholder="Credits" value={credits} onChange={(event) => this.updateInput(event, 'credits')} />
								</div>
							</div>
							
							<h4 className="heading active" ref="editor1-heading" onClick={() => (this.toggleElement('editor1-heading'), this.toggleElement('editor1-wrapper'))}>Primary content block<Icon glyph={Forward} /></h4>
							<div className="editor-wrapper active" ref="editor1-wrapper">
								<SimpleMDE ref="editor1" value={(this.state.selectedItem && this.state.selectedItem.content1) ? this.state.selectedItem.content1 : ''} onChange={(event) => this.updateItem(event, 'content1')} />
							</div>
							
							<h4 className="heading" ref="editor2-heading" onClick={() => (this.toggleElement('editor2-heading'), this.toggleElement('editor2-wrapper'))}>Secondary content block<Icon glyph={Forward} /></h4>
							<div className="editor-wrapper" ref="editor2-wrapper">
								<SimpleMDE ref="editor2" value={(this.state.selectedItem && this.state.selectedItem.content2) ? this.state.selectedItem.content2 : ''} onChange={(event) => this.updateItem(event, 'content2')} />
							</div>

							<h4 className="heading" ref="editor3-heading" onClick={() => (this.toggleElement('editor3-heading'), this.toggleElement('editor3-wrapper'))}>Tertiary content block<Icon glyph={Forward} /></h4>
							<div className="editor-wrapper" ref="editor3-wrapper">
								<SimpleMDE ref="editor3" value={(this.state.selectedItem && this.state.selectedItem.content3) ? this.state.selectedItem.content3 : ''} onChange={(event) => this.updateItem(event, 'content3')} />
							</div>
							
							<div className="footer-buttons">
								<button className="btn btn-cancel btn-xs" ref="remove" onClick={() => this.delete()}>Remove from {this.state.type}</button>
								<button className="btn btn-primary btn-xs" ref="save" onClick={() => this.save()}>save in {this.state.type}</button>
								<button className="btn btn-outline btn-xs" ref="cancel" onClick={() => this.cancel()}>Cancel</button>
								<div className="loader-small" ref="loader"></div>
							</div>
						</div>
					</div>
				</div>
				<ModalBox title={this.state.modalTitle} answer={this.modalBoxAnswer.bind(this)} />
			</section>
		)
	}
}

Admin.propTypes = propTypes;
Admin.defaultProps = defaultProps;

const mapStateToProps = null;

const mapDispatchToProps = {
	setLoading,
	setNotification
};

export default connect(mapStateToProps, mapDispatchToProps)(Admin);