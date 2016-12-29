import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { setLoading, setNotification } from '../../actions/actions';
import * as CONSTANTS from '../../constants/constants';
import { firebase, helpers } from 'redux-react-firebase';
import $ from 'jquery';
import classNames from 'classnames';
import SimpleMDE from 'react-simplemde-editor';
import Select2 from 'react-select2-wrapper';
import 'react-select2-wrapper/css/select2.css';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import ModalBox from '../common/modalbox/modalbox';
import Helpers from '../common/helpers';
import Icon from '../common/lib/icon/icon';
import Calendar from '../../../../static/svg/calendar.svg';
import User from '../../../../static/svg/avatar.svg';
import Group from '../../../../static/svg/group.svg';
import Course from '../../../../static/svg/course.svg';
import Subject from '../../../../static/svg/subject.svg';
import Module from '../../../../static/svg/module.svg';
import Activity from '../../../../static/svg/activity.svg';
import Post from '../../../../static/svg/post.svg';
import File from '../../../../static/svg/file.svg';
import Folder from '../../../../static/svg/folder.svg';
import LinkIcon from '../../../../static/svg/link.svg';
import Metadata from '../../../../static/svg/metadata.svg';
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
	activities: PropTypes.object,
	posts: PropTypes.object,
	pages: PropTypes.object,
	files: PropTypes.object
};

@firebase( [
	'users',
	'groups',
	'courses',
	'subjects',
	'modules',
	'activities',
	'posts',
	'pages',
	'files'
])
@connect(
  	({firebase}) => ({
		users: dataToJS(firebase, 'users'),
 		groups: dataToJS(firebase, 'groups'),
		courses: dataToJS(firebase, 'courses'),
		subjects: dataToJS(firebase, 'subjects'),
		modules: dataToJS(firebase, 'modules'),
 		activities: dataToJS(firebase, 'activities'),
		posts: dataToJS(firebase, 'posts'),
		pages: dataToJS(firebase, 'pages'),
		files: dataToJS(firebase, 'files')
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
			modalTitle: '',
			fileMetadata: null
		}
		
		this.storageRef =  this.props.firebase.storage().ref();
		this.tempFile = null;
		this.uploadStatus = '';
		this.uploadTask = null;
		this.selectedImage = null;
	}
	
	componentDidMount() {
		this.props.setLoading(false);
		$('.js-main').removeClass().addClass('main js-main admin-page');
	}
	
	handleSelect(event, action, type) {
		if (this.uploadStatus === '') {
			const index = event.target.selectedIndex;
			this.reset();
			event.target.selectedIndex = index;
			this.loadItem(event.target.value, action, type);
		}
	}
	
	loadItem(id, action, type) {
		if (isLoaded(type) && !isEmpty(type) && id !== '') {
			let selectedItem = this.props[type][id];

			this.setState({ action, type, selectedId: id, selectedItem }, function() {
				if (type === 'files') {
					// Load file meta data
					var fileRef = this.storageRef.child('files/'+this.state.selectedItem.file);
					fileRef.getMetadata().then(function(metadata) {
						this.setState({fileMetadata: metadata});
					}.bind(this)).catch(function(error) {
						this.props.setNotification({message: error, type: 'error'});
					}.bind(this));
				}
			}.bind(this));
		}
	}
	
	new(type) {
		if (this.uploadStatus === '') {
			this.cancel();
			this.setState({ action: 'new', type });
		}
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
		this.refs['posts-select'].selectedIndex = 0;
		this.refs['pages-select'].selectedIndex = 0;
		this.refs['files-select'].selectedIndex = 0;
	}
	
	save() {
		let item = this.state.selectedItem,
			method = (this.state.action === 'new') ? 'push' : 'set',
			path = (this.state.action === 'new') ? this.state.type : this.state.type + '/' + this.state.selectedId,
			uploadFile = false;
		
		if (item && item.title) {
			if (this.state.type !== 'files')
				item.slug = Helpers.slugify(item.title);
			else {
				if (this.tempFile) {
					item.file = this.tempFile.name;
					uploadFile = true;
					this.uploadFile(this.tempFile);
				}
			}

			if (item.date) item.date = moment(item.date).format('YYYY-MM-DD');
			if (item.startDate) item.startDate = moment(item.startDate).format('YYYY-MM-DD');
			if (item.endDate) item.endDate = moment(item.endDate).format('YYYY-MM-DD');
			if (item.gradeDate) item.gradeDate = moment(item.gradeDate).format('YYYY-MM-DD');
			
			item.status = this.refs['status-checkbox'].checked ? 'active' : 'inactive';

			this.toggleButtons(false);
			
			if (!uploadFile) {
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
		}
		else {
			this.props.setNotification({message: CONSTANTS.NEED_TITLE, type: 'error'});
		}
	}
	
	uploadFile(file) {
		const {firebase} = this.props;
		
		this.uploadTask = this.storageRef.child('files/' + file.name).put(file);
		$('.file-input').hide();
		$('.file-upload-wrapper').show();
		
		this.uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, function(snapshot) {
			var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
			$('.file-progress').attr('value', progress);
			
			switch (snapshot.state) {
				case firebase.storage.TaskState.PAUSED: this.uploadStatus = 'paused'; break;
				case firebase.storage.TaskState.RUNNING: this.uploadStatus = 'uploading'; break;
			}
		}.bind(this), function(error) {
			$('.file-input').show();
			$('.file-upload-wrapper').hide();
			this.toggleButtons(true);
			this.uploadStatus = '';
			
			switch (error.code) {
				case 'storage/unauthorized': break;
				case 'storage/canceled': break;
				case 'storage/unknown': break;
			}
		}.bind(this), function() {
			$('.file-input').show();
			$('.file-upload-wrapper').hide();
			this.tempFile = null;
			this.uploadStatus = '';
			
			this.updateItem(this.uploadTask.snapshot.metadata.contentType, 'type');
			this.updateItem(this.uploadTask.snapshot.downloadURL, 'url', function() {
				this.save();
			}.bind(this));
		}.bind(this));
	}
	
	changeUploadStatus(status) {
		if (status === 'paused' && this.uploadStatus === 'paused') {
			$(this.refs['pause-upload']).html('pause');
			this.uploadTask.resume();
		}
		else if (status === 'paused') {
			$(this.refs['pause-upload']).html('resume');
			this.uploadTask.pause();
		}
		else if (status === 'cancelled') {
			if (this.uploadStatus === 'paused') this.uploadTask.resume();
			this.uploadTask.cancel();
		}
	}
	
	delete() {
		this.setState({ modalTitle: CONSTANTS.CONFIRM_DELETE + ' \"' + this.state.selectedItem.title + '\"?'}, function() {
			$('.js-modal-box-wrapper').show().animateCss('fade-in');
		});
	}
	
	updateInput(event, prop) {
		this.updateItem(event.target.value, prop);
	}
	
	updateCheckbox(event, prop) {
		let val = (event.target.checked) ? 'active' : 'inactive';
		this.updateItem(val, prop);
	}
	
	updateFile(event, prop) {
		this.tempFile = event.target.files[0];

		this.updateItem(this.tempFile.name, 'file');
		if (this.refs['title-input'].value === '') this.updateItem(this.tempFile.name, 'title');
	}
	
	updateDate(date, prop) {
		if (prop === 'endDate' && moment(date).isBefore(moment(this.state.selectedItem.startDate))) {
			date = this.state.selectedItem.endDate;
		}
		this.updateItem(date, prop);
	}
	
	updateSelect(select, prop) {
		let value = (select.selectedIndex >= 0) ? select.options[select.selectedIndex].value : '';
		this.updateItem(value, prop);
	}
	
	updateMultiSelect(select, prop) {
		let selectedValues = [];
		
		for (var i=0; i<select.length; i++) {
			if (select.options[i].selected) selectedValues.push(select.options[i].value);
		}

		this.updateItem(selectedValues, prop);
	}
	
	fileSelected(select) {
		let key = (select.selectedIndex >= 0) ? select.options[select.selectedIndex].value : '';
		if (key) {
			Helpers.copyTextToClipboard(this.props.files[key].url);
			if (this.props.files[key].type.indexOf('image') !== -1) {
				$(this.refs['btn-featured-image']).removeClass('disabled');
				this.selectedImage = key;
			}
			else {
				$(this.refs['btn-featured-image']).addClass('disabled');
				this.selectedImage = null;
			}
		}
		else {
			$(this.refs['btn-featured-image']).addClass('disabled');
			this.selectedImage = null;
		}
	}
	
	updateItem(value, prop, callback) {
		let newItem = null;
		
		if (value && !isEmpty(value)) {
			newItem = Object.assign({}, this.state.selectedItem, {[prop]: value});
		}
		else {
			newItem = _.omit(this.state.selectedItem, [prop]);
		}
		
		if (!isEmpty(newItem) && JSON.stringify(newItem) !== JSON.stringify(this.state.selectedItem))
			this.setState({ selectedItem: newItem }, function() {
				if (callback) callback();
			});
	}
	
	toggleButtons(state) {
		$(this.refs.remove).toggle(state);
		$(this.refs.save).toggle(state);
		$(this.refs.saveTop).toggle(state);
		$(this.refs.cancel).toggle(state);
		$(this.refs.cancelTop).toggle(state);
		$(this.refs.loader).toggle(!state);
		$(this.refs.loaderTop).toggle(!state);
	}
	
	modalBoxAnswer(answer) {
		if (answer === 'accept') {
			this.toggleButtons(false);
			
			// Delete the file first (if there's any)
			if (this.state.selectedItem.file) {
				var desertRef = this.storageRef.child('files/' + this.state.selectedItem.file);

				desertRef.delete().then(function() {
					this.props.firebase.remove(this.state.type+'/'+this.state.selectedId, function() {
						this.toggleButtons(true);
						this.cancel();
						this.props.setNotification({message: CONSTANTS.ITEM_REMOVED, type: 'success'});
					}.bind(this));
				}.bind(this)).catch(function(error) {
					this.props.setNotification({message: error, type: 'error'})
				});
			}
			else {
				this.props.firebase.remove(this.state.type+'/'+this.state.selectedId, function() {
					this.toggleButtons(true);
					this.cancel();
					this.props.setNotification({message: CONSTANTS.ITEM_REMOVED, type: 'success'});
				}.bind(this));
			}
		}
	}
	
	toggleElement(ref) {
		$(this.refs[ref]).toggleClass('active');
	}
	
	formatFileType(state) {
		if (!state.id) { return state.text; }
		let contentType = state.text.substring(state.text.indexOf('[')+1, state.text.indexOf(']'));
		var $state = $('<span><img src="//www.stdicon.com/crystal/' + contentType + '?size=24" class="select2-img" />' + state.text.substring(state.text.indexOf(']')+1, state.text.length) + '</span>');
		return $state;
	}
	
	createList(type) {
		let newList = [];
		if (isLoaded(this.props[type]) && !isEmpty(this.props[type])) {
			newList = Object.keys(this.props[type]).map(function(key) {
					let item = this.props[type][key];
					return (type === 'users') ? {text: item.info.firstName + ' ' + item.info.lastName1 + ' ' + item.info.lastName2, id: key} : (type === 'files') ? {text: (item.type) ? '[' + item.type + '] ' + item.title : item.title, id: key} : {text: item.title, id: key};
			}.bind(this));
		}
		return newList;
	}
	
	render () {
		const users = this.createList('users');
		const groups = this.createList('groups');
		const courses = this.createList('courses');
		const subjects = this.createList('subjects');
		const modules = this.createList('modules');
		const activities = this.createList('activities');
		const posts = this.createList('posts');
		const pages = this.createList('pages');
		const files = this.createList('files');
		
		const title = (this.state.selectedItem && this.state.selectedItem.title) ? this.state.selectedItem.title : '';
		const iconHeading = (this.state.type === 'courses') ? <Icon glyph={Course} /> : (this.state.type === 'subjects') ? <Icon glyph={Subject} /> : (this.state.type === 'modules') ? <Icon glyph={Module} /> : <Icon glyph={Activity} />;
		const code = (this.state.selectedItem && this.state.selectedItem.code) ? this.state.selectedItem.code : '';
		const price = (this.state.selectedItem && this.state.selectedItem.price) ? this.state.selectedItem.price : '';
		const credits = (this.state.selectedItem && this.state.selectedItem.credits) ? this.state.selectedItem.credits : '';
		const date = (this.state.selectedItem && this.state.selectedItem.date) ? moment(this.state.selectedItem.date) : null;
		const startDate = (this.state.selectedItem && this.state.selectedItem.startDate) ? moment(this.state.selectedItem.startDate) : null;
		const endDate = (this.state.selectedItem && this.state.selectedItem.endDate) ? moment(this.state.selectedItem.endDate) : null;
		const gradeDate = (this.state.selectedItem && this.state.selectedItem.gradeDate) ? moment(this.state.selectedItem.gradeDate) : null;
		const status = (this.state.selectedItem && this.state.selectedItem.status && this.state.selectedItem.status === 'inactive') ? false : true;;
		const fileContentType = (this.state.fileMetadata) ? this.state.fileMetadata.contentType : '';
		let fileSize = (this.state.fileMetadata) ? Math.round(this.state.fileMetadata.size/1000) : 0;
		fileSize = (fileSize < 1000) ? Math.round(fileSize)+'KB' : (fileSize < 1000000) ? Math.round(fileSize/1000)+'MB' : (fileSize < 1000000000) ? Math.round(fileSize/1000000)+'GB' : Math.round(fileSize/1000000000)+'TB'; 
		const fileCreatedOn = (this.state.fileMetadata) ? moment(this.state.fileMetadata.timeCreated).format('YYYY-MM-DD HH:MM:SS') : '';
		const fileUpdatedOn = (this.state.fileMetadata) ? moment(this.state.fileMetadata.updated).format('YYYY-MM-DD HH:MM:SS') : '';
		
		return (
			<section className="admin page container-fluid">
				<div className="columns">
					<div className="nav column">
						<div className="block clearfix">
							<div className="clearfix">
								<Icon glyph={User} />
								<Select2 className="select-items" style={{width: '50%'}} ref="users-select" data={users} defaultValue={this.state.selectedId} options={{placeholder: 'Users', allowClear: true}} onChange={(event) => this.handleSelect(event, 'edit', 'users')} />
								<button className="btn btn-primary btn-xs" onClick={() => this.new('users')}>new</button>
							</div>
							
							<div className="clearfix">
								<Icon glyph={Group} />
								<Select2 className="select-items" style={{width: '50%'}} ref="groups-select" data={groups} defaultValue={this.state.selectedId} options={{placeholder: 'Groups', allowClear: true}} onChange={(event) => this.handleSelect(event, 'edit', 'groups')} />
								<button className="btn btn-primary btn-xs" onClick={() => this.new('groups')}>new</button>
							</div>
							
							<div className="clearfix">
								<Icon glyph={Course} />
								<Select2 className="select-items" style={{width: '50%'}} ref="courses-select" data={courses} defaultValue={this.state.selectedId} options={{placeholder: 'Courses', allowClear: true}} onChange={(event) => this.handleSelect(event, 'edit', 'courses')} />
								<button className="btn btn-primary btn-xs" onClick={() => this.new('courses')}>new</button>
							</div>
	
							<div className="clearfix">
								<Icon glyph={Subject} />
								<Select2 className="select-items" style={{width: '50%'}} ref="subjects-select" data={subjects} defaultValue={this.state.selectedId} options={{placeholder: 'Subjects', allowClear: true}} onChange={(event) => this.handleSelect(event, 'edit', 'subjects')} />
								<button className="btn btn-primary btn-xs" onClick={() => this.new('subjects')}>new</button>
							</div>
		
							<div className="clearfix">
								<Icon glyph={Module} />
								<Select2 className="select-items" style={{width: '50%'}} ref="modules-select" data={modules} defaultValue={this.state.selectedId} options={{placeholder: 'Modules', allowClear: true}} onChange={(event) => this.handleSelect(event, 'edit', 'modules')} />
								<button className="btn btn-primary btn-xs" onClick={() => this.new('modules')}>new</button>
							</div>
		
							<div className="clearfix">
								<Icon glyph={Activity} />
								<Select2 className="select-items" style={{width: '50%'}} ref="activities-select" data={activities} defaultValue={this.state.selectedId} options={{placeholder: 'Activities', allowClear: true}} onChange={(event) => this.handleSelect(event, 'edit', 'activities')} />
								<button className="btn btn-primary btn-xs" onClick={() => this.new('activities')}>new</button>
							</div>
							
							<div className="clearfix">
								<Icon glyph={Post} />
								<Select2 className="select-items" style={{width: '50%'}} ref="posts-select" data={posts} defaultValue={this.state.selectedId} options={{placeholder: 'Posts', allowClear: true}} onChange={(event) => this.handleSelect(event, 'edit', 'posts')} />
								<button className="btn btn-primary btn-xs" onClick={() => this.new('posts')}>new</button>
							</div>
							
							<div className="clearfix">
								<Icon glyph={Post} />
								<Select2 className="select-items" style={{width: '50%'}} ref="pages-select" data={pages} defaultValue={this.state.selectedId} options={{placeholder: 'Pages', allowClear: true}} onChange={(event) => this.handleSelect(event, 'edit', 'pages')} />
								<button className="btn btn-primary btn-xs" onClick={() => this.new('pages')}>new</button>
							</div>
							
							<div className="clearfix">
								<Icon glyph={File} />
								<Select2 className="select-items" style={{width: '50%'}} ref="files-select" data={files} defaultValue={this.state.selectedId} options={{placeholder: 'Files', allowClear: true, templateResult: this.formatFileType, templateSelection: this.formatFileType}} onChange={(event) => this.handleSelect(event, 'edit', 'files')} />
								<button className="btn btn-primary btn-xs" onClick={() => this.new('files')}>new</button>
							</div>
						</div>
					</div>
					<div className={classNames('item-content column', {hidden: this.state.action === ''})}>
						<div className={`block clearfix ${this.state.type}`}>
							<h3 className="block-title">{iconHeading}{(this.state.action === 'new') ? <span>You are adding a new {(this.state.type === 'activities') ? 'activity' : this.state.type.slice(0, -1)}...</span> : <span>You are editing {(this.state.type === 'activities') ? 'an activity' : 'a ' + this.state.type.slice(0, -1)}...</span>}<button className="btn btn-primary btn-xs float-right btn-save" ref="saveTop" onClick={() => this.save()}>save in {this.state.type}</button><button className="btn btn-outline btn-xs float-right" ref="cancelTop" onClick={() => this.cancel()}>cancel</button><div className="loader-small" ref="loaderTop"></div></h3>
							
							<input type="text" className="input-field title-input" ref="title-input" placeholder={(this.state.type === 'activities') ? 'Activity title' : this.state.type.slice(0, -1).capitalize() + ' title'} value={title} onChange={(event) => this.updateInput(event, 'title')} />
							<input type="text" className={classNames('input-field code-input', {hidden: (this.state.type === 'posts' || this.state.type === 'pages' || this.state.type === 'files')})} ref="code-input" placeholder="Code" value={code} onChange={(event) => this.updateInput(event, 'code')} />
							<input type="text" className={classNames('input-field price-input', {visible: (this.state.type === 'courses')})} ref="price-input" placeholder="Price" value={price} onChange={(event) => this.updateInput(event, 'price')} />
							<div className={classNames('float-right', {hidden: (this.state.type !== 'posts')})}>
								<Icon glyph={Calendar} className="icon calendar" /><DatePicker className="input-field date-input" selected={date} date={date} placeholderText="Date" isClearable={true} onChange={(date) => this.updateDate(date, 'date')} dateFormat="YYYY-MM-DD" popoverAttachment="bottom right" popoverTargetAttachment="bottom right" popoverTargetOffset="0px 0px" />
							</div>
							
							<div className={classNames({hidden: (this.state.type !== 'groups')})}>
								<Select2 style={{width: '100%'}} multiple data={users} value={(this.state.selectedItem && this.state.selectedItem.users) ? this.state.selectedItem.users : []} options={{placeholder: 'Users in this group...', allowClear: true}} onChange={(event) => this.updateMultiSelect(event.currentTarget, 'users')} />
								<Select2 style={{width: '100%'}} data={courses} value={(this.state.selectedItem && this.state.selectedItem.course) ? this.state.selectedItem.course : ''} options={{placeholder: 'Select a course...', allowClear: true}} onChange={(event) => this.updateSelect(event.currentTarget, 'course')} />
							</div>
							
							<div className="clearfix">
								<div className={classNames('dates-wrapper', {hidden: (this.state.type !== 'courses') && (this.state.type !== 'activities')})}>
									<label>From</label><Icon glyph={Calendar} className="icon calendar" /><DatePicker className="input-field date-input" selected={startDate} placeholderText="Date" isClearable={true} selectsStart startDate={startDate} endDate={endDate} onChange={(date) => this.updateDate(date, 'startDate')} dateFormat="YYYY-MM-DD" />
									<label className="date-label">Until</label><Icon glyph={Calendar} className="icon calendar" /><DatePicker className="input-field date-input" selected={endDate} placeholderText="Date" isClearable={true} selectsEnd startDate={startDate} endDate={endDate} onChange={(date) => this.updateDate(date, 'endDate')} dateFormat="YYYY-MM-DD" />
									<div className={classNames('grade-wrapper', {hidden: (this.state.type !== 'activities')})}>
										<label className="date-label">Grade</label><Icon glyph={Calendar} className="icon calendar" /><DatePicker className="input-field date-input" selected={gradeDate} placeholderText="Date" isClearable={true} onChange={(date) => this.updateDate(date, 'gradeDate')} dateFormat="YYYY-MM-DD" />
									</div>
								</div>
								<div className={classNames('credits-wrapper', {hidden: (this.state.type !== 'courses') && (this.state.type !== 'subjects')})}>
									<label>Credits</label><input type="text" className="input-field credits-input" ref="credits-input" placeholder="Credits" value={credits} onChange={(event) => this.updateInput(event, 'credits')} />
								</div>
							</div>
							
							<div className={classNames('clearfix', {hidden: (this.state.type === 'users') || (this.state.type === 'groups') || (this.state.type === 'files')})}>
								<div className="file-settings-block">
									<Select2 style={{width: '100%'}} data={files} options={{placeholder: 'Select a file to copy its URL...', allowClear: true, templateResult: this.formatFileType, templateSelection: this.formatFileType}} onChange={(event) => this.fileSelected(event.currentTarget)} />
									<label className="option-label">Featured image</label>
									<span>{(this.state.selectedItem && this.state.selectedItem.featuredImage) ? <a href={this.props.files[this.state.selectedItem.featuredImage] ? this.props.files[this.state.selectedItem.featuredImage].url : ''} target="_blank">{this.props.files[this.state.selectedItem.featuredImage] ? this.props.files[this.state.selectedItem.featuredImage].file : ''}</a> : 'none'}</span>
									<button className={classNames('btn btn-cancel btn-xs', {visible: (this.state.selectedItem && this.state.selectedItem.featuredImage && this.state.selectedItem.featuredImage !== '')})} onClick={() => this.updateItem('', 'featuredImage')}>unlink</button>
								</div>
								<div className="featured-image-wrapper">
									{(this.state.selectedItem && this.state.selectedItem.featuredImage) ? <img className="featured-image" src={this.props.files[this.state.selectedItem.featuredImage] ? this.props.files[this.state.selectedItem.featuredImage].url : ''} /> : <button className="btn btn-primary btn-xs btn-featured-image disabled" ref="btn-featured-image" onClick={() => this.updateItem(this.selectedImage, 'featuredImage')}>Set as featured image</button>}
								</div>
							</div>
							
							<div className={classNames({hidden: (this.state.type === 'files')})}>
								<h4 className="heading active" ref="editor1-heading" onClick={() => (this.toggleElement('editor1-heading'), this.toggleElement('editor1-wrapper'))}>Primary content block<Icon glyph={Forward} /></h4>
								<div className="editor-wrapper active" ref="editor1-wrapper">
									<SimpleMDE ref="editor1" value={(this.state.selectedItem && this.state.selectedItem.content1) ? this.state.selectedItem.content1 : ''} onChange={(event) => this.updateItem(event, 'content1')} />
								</div>
							</div>
							
							<div className={classNames({hidden: (this.state.type === 'posts' || this.state.type === 'files')})}>
								<h4 className="heading" ref="editor2-heading" onClick={() => (this.toggleElement('editor2-heading'), this.toggleElement('editor2-wrapper'))}>Secondary content block<Icon glyph={Forward} /></h4>
								<div className="editor-wrapper" ref="editor2-wrapper">
									<SimpleMDE ref="editor2" value={(this.state.selectedItem && this.state.selectedItem.content2) ? this.state.selectedItem.content2 : ''} onChange={(event) => this.updateItem(event, 'content2')} />
								</div>

								<h4 className="heading" ref="editor3-heading" onClick={() => (this.toggleElement('editor3-heading'), this.toggleElement('editor3-wrapper'))}>Tertiary content block<Icon glyph={Forward} /></h4>
								<div className="editor-wrapper" ref="editor3-wrapper">
									<SimpleMDE ref="editor3" value={(this.state.selectedItem && this.state.selectedItem.content3) ? this.state.selectedItem.content3 : ''} onChange={(event) => this.updateItem(event, 'content3')} />
								</div>
							</div>
							
							<div className={classNames({hidden: (this.state.type !== 'files')})}>
								<div>
									{(this.state.selectedItem && this.state.selectedItem.url) ? <div>
										<div className="clearfix file-download">
											<Icon glyph={LinkIcon} />
											<a href={this.state.selectedItem.url} target="_blank">View/download file</a>
										</div>
										<div className="file-metadata">
											<img src={`//www.stdicon.com/crystal/${fileContentType}?size=24`} /><span>File metadata</span>
											<ul>
												<li><span>Original file name:</span>{this.state.selectedItem.file}</li>
												<li><span>Content type:</span>{fileContentType}</li>
												<li><span>File size:</span>{fileSize}</li>
												<li><span>Created on:</span>{fileCreatedOn}</li>
												<li><span>Updated on:</span>{fileUpdatedOn}</li>
											</ul>
										</div>
										{(fileContentType.indexOf('image') !== -1) ? <img className="file-preview" src={this.state.selectedItem.url} /> : (fileContentType.indexOf('video') !== -1) ? <video className="file-preview" src={this.state.selectedItem.url} controls></video> : <object className="file-preview" data={this.state.selectedItem.url} width="50%" height="80%" type={fileContentType}></object>}
									</div> :
									<div>
										<input type="file" className="file-input" ref="file-input" placeholder="Select file" onChange={(event) => this.updateFile(event, 'file')}/>
										<span className="file-upload-wrapper">Uploading {(this.tempFile) ? this.tempFile.name : ''} <progress className="file-progress" max="100" value="0"></progress><button className="btn btn-outline btn-xs" ref="pause-upload" onClick={() => this.changeUploadStatus('paused')}>pause</button><button className="btn btn-cancel btn-xs" ref="cancel-upload" onClick={() => this.changeUploadStatus('cancelled')}>cancel</button></span>
									</div>}
								</div>
							</div>
							
							<h4 className="heading" ref="editor4-heading" onClick={() => (this.toggleElement('editor4-heading'), this.toggleElement('editor4-wrapper'))}>Private notes<Icon glyph={Forward} /></h4>
							<div className="editor-wrapper" ref="editor4-wrapper">
								<SimpleMDE ref="editor4" value={(this.state.selectedItem && this.state.selectedItem.notes) ? this.state.selectedItem.content4 : ''} onChange={(event) => this.updateItem(event, 'content4')} />
							</div>
							
							<label className="checkbox-label">Active </label><input type="checkbox" className="status-checkbox" ref="status-checkbox" checked={status} onChange={(event) => this.updateCheckbox(event, 'status')} />
							
							<div className="footer-buttons">
								<button className="btn btn-cancel btn-xs float-left" ref="remove" onClick={() => this.delete()}>remove from {this.state.type}</button>
								<button className="btn btn-primary btn-xs float-right btn-save" ref="save" onClick={() => this.save()}>save in {this.state.type}</button>
								<button className="btn btn-outline btn-xs float-right" ref="cancel" onClick={() => this.cancel()}>cancel</button>
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