import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { setLoading, setNotification } from '../../actions/actions';
import * as CONSTANTS from '../../constants/constants';
import { firebase, helpers } from 'redux-react-firebase';
import $ from 'jquery';
import classNames from 'classnames';
import SimpleMDE from 'simplemde';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import ModalBox from '../common/modalbox/modalbox'
import Helpers from '../common/helpers';
import Icon from '../common/lib/icon/icon';
import Calendar from '../../../../static/svg/calendar.svg';
import Course from '../../../../static/svg/course.svg';
import Subject from '../../../../static/svg/subject.svg';
import Module from '../../../../static/svg/module.svg';
import Activity from '../../../../static/svg/activity.svg';
import Forward from '../../../../static/svg/forward.svg';

const {isLoaded, isEmpty, dataToJS} = helpers;

const defaultProps = {
};

const propTypes = {
	courses: PropTypes.object,
	subjects: PropTypes.object,
	modules: PropTypes.object,
	activities: PropTypes.object
};

@firebase( [
	'courses',
	'subjects',
	'modules',
	'activities'
])
@connect(
  	({firebase}) => ({
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
		
		this.editor1 = null;
		this.editor2 = null;
		this.editor3 = null;
	}
	
	componentDidMount() {
		this.props.setLoading(false);
		
		this.editor1 = new SimpleMDE({ element: document.getElementById('editor1'), forceSync: true });
		this.editor2 = new SimpleMDE({ element: document.getElementById('editor2'), forceSync: true });
		this.editor3 = new SimpleMDE({ element: document.getElementById('editor3'), forceSync: true });
		
		this.editor1.codemirror.on('change', function() { this.updateItem(null, 'content1', this.editor1.value()); }.bind(this));
		this.editor2.codemirror.on('change', function() { this.updateItem(null, 'content2', this.editor2.value()); }.bind(this));
		this.editor3.codemirror.on('change', function() { this.updateItem(null, 'content3', this.editor3.value()); }.bind(this));
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
		
		if (this.state.type === 'courses' || this.state.type === 'activities') {
			item.startDate = moment(item.startDate).format('YYYY-MM-DD');
			item.endDate = moment(item.endDate).format('YYYY-MM-DD');
		}
		
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
	
	updateItem(event, prop, value) {
		const newItem = Object.assign({}, this.state.selectedItem, {[prop]: value || event.target.value});
		this.setState({ selectedItem: newItem });
	}
	
	updateDate(date, prop) {
		if (prop === 'endDate' && moment(date).isBefore(moment(this.state.selectedItem.startDate))) {
			date = this.state.selectedItem.endDate;
		}
		
		const newItem = Object.assign({}, this.state.selectedItem, {[prop]: date});
		this.setState({ selectedItem: newItem });
	}
	
	loadItems(type) {
		return (isLoaded(this.props[type]) && !isEmpty(this.props[type])) ? Object.keys(this.props[type]).map(function(key) {
			let item = this.props[type][key];
			return <option key={key} value={key}>{item.title}</option>;
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
		const coursesList = this.loadItems('courses');
		const subjectsList = this.loadItems('subjects');
		const modulesList = this.loadItems('modules');
		const activitiesList = this.loadItems('activities');
		const title = (this.state.selectedItem && this.state.selectedItem.title) ? this.state.selectedItem.title : '';
		const code = (this.state.selectedItem && this.state.selectedItem.code) ? this.state.selectedItem.code : '';
		const startDate = (this.state.selectedItem && this.state.selectedItem.startDate) ? moment(this.state.selectedItem.startDate) : moment();
		const endDate = (this.state.selectedItem && this.state.selectedItem.endDate) ? moment(this.state.selectedItem.endDate) : moment();
		
		return (
			<section className="admin page container-fluid">
				<div className="columns">
					<div className="blocks column">
						<div className="block clearfix">		
							<h3 className="block-title"><Icon glyph={Course} />Courses<button className="btn btn-primary btn-xs" onClick={() => this.new('courses')}>+ add</button></h3>
							<select className="select-items" ref="courses-select" onChange={(event) => this.handleSelect(event, 'edit', 'courses')}>
								<option value="">Select to edit</option>
								{coursesList}
							</select>
						</div>
						<div className="block clearfix">		
							<h3 className="block-title"><Icon glyph={Subject} />Subjects<button className="btn btn-primary btn-xs" onClick={() => this.new('subjects')}>+ add</button></h3>
							<select className="select-items" ref="subjects-select" onChange={(event) => this.handleSelect(event, 'edit', 'subjects')}>
								<option value="">Select to edit</option>
								{subjectsList}
							</select>
						</div>
						<div className="block clearfix">		
							<h3 className="block-title"><Icon glyph={Module} />Modules<button className="btn btn-primary btn-xs" onClick={() => this.new('modules')}>+ add</button></h3>
							<select className="select-items" ref="modules-select" onChange={(event) => this.handleSelect(event, 'edit', 'modules')}>
								<option value="">Select to edit</option>
								{modulesList}
							</select>
						</div>
						<div className="block clearfix">		
							<h3 className="block-title"><Icon glyph={Activity} />Activities<button className="btn btn-primary btn-xs" onClick={() => this.new('activities')}>+ add</button></h3>
							<select className="select-items" ref="activities-select" onChange={(event) => this.handleSelect(event, 'edit', 'activities')}>
								<option value="">Select to edit</option>
								{activitiesList}
							</select>
						</div>
					</div>
					<div className={classNames('item-content column', {hidden: this.state.action === ''})}>
						<div className="block clearfix">
							<h3 className="block-title">{(this.state.action === 'new') ? <span>Adding a new item in {this.state.type}</span> : <span>Editing an item in {this.state.type}</span>}<button className="btn btn-primary btn-xs" ref="saveTop" onClick={() => this.save()}>save in {this.state.type}</button><div className="loader-small" ref="loaderTop"></div></h3>
							<input type="text" className="input-field title-input" ref="title-input" placeholder="Title" value={title} onChange={(event) => this.updateItem(event, 'title')} />
							<input type="text" className="input-field code-input" ref="code-input" placeholder="Code" value={code} onChange={(event) => this.updateItem(event, 'code')} />
							
							<div className={classNames({hidden: this.state.type !== 'courses' || this.state.type !== 'activities'})}>
								From <DatePicker className="input-field date-input" readOnly selected={startDate} selectsStart startDate={startDate} endDate={endDate} onChange={(date) => this.updateDate(date, 'startDate')} dateFormat="YYYY-MM-DD" /><Icon glyph={Calendar} className="icon calendar" />
								Until <DatePicker className="input-field date-input" readOnly selected={endDate} selectsEnd startDate={startDate} endDate={endDate} onChange={(date) => this.updateDate(date, 'endDate')} dateFormat="YYYY-MM-DD" /><Icon glyph={Calendar} className="icon calendar" />
							</div>
							
							<h4 className="heading">Primary content block</h4>
							<textarea className="input-field" id="editor1" ref="editor1" value={(this.state.selectedItem) ?this.state.selectedItem.content1 : ''} onChange={(event) => this.updateItem(event, 'content1')}></textarea>
							
							<h4 className="heading" ref="editor2-heading" onClick={() => (this.toggleElement('editor2-heading'), this.toggleElement('editor2-wrapper'))}>Secondary content block<Icon glyph={Forward} /></h4>
							<div className="editor-wrapper" ref="editor2-wrapper">
								<textarea className="input-field" id="editor2" ref="editor2" value={(this.state.selectedItem) ?this.state.selectedItem.content2 : ''} onChange={(event) => this.updateItem(event, 'content2')}></textarea>
							</div>

							<h4 className="heading" ref="editor3-heading" onClick={() => (this.toggleElement('editor3-heading'), this.toggleElement('editor3-wrapper'))}>Tertiary content block<Icon glyph={Forward} /></h4>
							<div className="editor-wrapper" ref="editor3-wrapper">
								<textarea className="input-field" id="editor3" ref="editor3" value={(this.state.selectedItem) ?this.state.selectedItem.content3 : ''} onChange={(event) => this.updateItem(event, 'content3')}></textarea>
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