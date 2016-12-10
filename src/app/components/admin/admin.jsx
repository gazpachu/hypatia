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

const {isLoaded, isEmpty, dataToJS} = helpers;

const defaultProps = {
};

const propTypes = {
	modules: PropTypes.object,
	subjects: PropTypes.object,
	courses: PropTypes.object,
	activities: PropTypes.object
};

@firebase( [
  	'modules',
	'subjects',
	'courses',
	'activities'
])
@connect(
  	({firebase}) => ({
    	modules: dataToJS(firebase, 'modules'),
		subjects: dataToJS(firebase, 'subjects'),
		courses: dataToJS(firebase, 'courses'),
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
		
		this.editor = null;
	}
	
	componentDidMount() {
		this.props.setLoading(false);
		
		this.editor = new SimpleMDE({
			element: document.getElementById('editor'),
			forceSync: true
		});
		
		this.editor.codemirror.on('change', function() {
			this.updateItem(null, 'content', this.editor.value());
		}.bind(this));
	}
	
	handleSelect(event, action, type) {
		const index = event.target.selectedIndex;
		this.reset();
		event.target.selectedIndex = index;
		
		if (isLoaded(type) && !isEmpty(type) && event.target.value !== '') {
			let selectedItem = this.props[type][event.target.value];

			this.setState({ action, type, selectedId: event.target.value, selectedItem }, function() {
				console.log(this.state.action, this.state.type, this.state.selectedId, this.state.selectedItem);
			}.bind(this));
		}
	}
	
	new(type) {
		this.cancel();
		this.setState({ action: 'new', type });
	}
	
	cancel() {
		this.setState({ action: '', type: '', selectedId: '' });
		this.reset();
	}
	
	reset() {
		this.refs['modules-select'].selectedIndex = 0;
		this.refs['subjects-select'].selectedIndex = 0;
		this.refs['courses-select'].selectedIndex = 0;
		this.refs['activities-select'].selectedIndex = 0;
	}
	
	save() {
		this.toggleButtons(false);
		let item = this.state.selectedItem;
		item.startDate = moment(item.startDate).format('YYYY-MM-DD');
		item.endDate = moment(item.endDate).format('YYYY-MM-DD');
		
		if (this.state.action === 'new') {
			this.props.firebase.push(this.state.type, item, () => this.props.setNotification({message: CONSTANTS.ITEM_SAVED, type: 'success'}));
		}
		else {
			this.props.firebase.set(this.state.type+'/'+this.state.selectedId, item, function() {
				this.toggleButtons(true);
				this.props.setNotification({message: CONSTANTS.ITEM_SAVED, type: 'success'})
			}.bind(this));
		}
	}
	
	delete() {
		firebase.remove(this.state.type+'/'+this.state.selectedId);
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
		$(this.refs.cancel).toggle(state);
		$(this.refs.loader).toggle(!state);
	}
	
	render () {
		const modulesList = this.loadItems('modules');
		const subjectsList = this.loadItems('subjects');
		const coursesList = this.loadItems('courses');
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
							<h3 className="block-title">Modules</h3>
							<select className="select-items" ref="modules-select" onChange={(event) => this.handleSelect(event, 'edit', 'modules')}>
								<option value="">Select to edit</option>
								{modulesList}
							</select>
							<button className="btn btn-primary btn-xs" onClick={() => this.new('modules')}>Add new module</button>
						</div>
						<div className="block clearfix">		
							<h3 className="block-title">Subjects</h3>
							<select className="select-items" ref="subjects-select" onChange={(event) => this.handleSelect(event, 'edit', 'subjects')}>
								<option value="">Select to edit</option>
								{subjectsList}
							</select>
							<button className="btn btn-primary btn-xs" onClick={() => this.new('subjects')}>Add new subject</button>
						</div>
						<div className="block clearfix">		
							<h3 className="block-title">Courses</h3>
							<select className="select-items" ref="courses-select" onChange={(event) => this.handleSelect(event, 'edit', 'courses')}>
								<option value="">Select to edit</option>
								{coursesList}
							</select>
							<button className="btn btn-primary btn-xs" onClick={() => this.new('courses')}>Add new course</button>
						</div>
						<div className="block clearfix">		
							<h3 className="block-title">Activities</h3>
							<select className="select-items" ref="activities-select" onChange={(event) => this.handleSelect(event, 'edit', 'activities')}>
								<option value="">Select to edit</option>
								{activitiesList}
							</select>
							<button className="btn btn-primary btn-xs" onClick={() => this.new('activities')}>Add new activity</button>
						</div>
					</div>
					<div className={classNames('item-content column', {hidden: this.state.action === ''})}>
						<div className="block clearfix">
							<h3 className="block-title">{(this.state.action === 'new') ? <span>New item for {this.state.type}</span> : <span>Edit {this.state.type} item</span>}</h3>
							<input type="text" className="input-field title-input" ref="title-input" placeholder="Title" value={title} onChange={(event) => this.updateItem(event, 'title')} />
							<input type="text" className="input-field code-input" ref="code-input" placeholder="Code" value={code} onChange={(event) => this.updateItem(event, 'code')} />
							<textarea className="input-field" id="editor" ref="editor" value={(this.state.selectedItem) ?this.state.selectedItem.content : ''} onChange={(event) => this.updateItem(event, 'content')}></textarea>
							
							{(this.state.type === 'courses' || this.state.type === 'activities') ? <div>
								From <DatePicker className="input-field date-input" readOnly selected={startDate} selectsStart startDate={startDate} endDate={endDate} onChange={(date) => this.updateDate(date, 'startDate')} dateFormat="YYYY-MM-DD" /><Icon glyph={Calendar} className="icon calendar" />
								Until <DatePicker className="input-field date-input" readOnly selected={endDate} selectsEnd startDate={startDate} endDate={endDate} onChange={(date) => this.updateDate(date, 'endDate')} dateFormat="YYYY-MM-DD" /><Icon glyph={Calendar} className="icon calendar" />
							</div> : ''}
							
							<button className="btn btn-cancel btn-xs" ref="remove" onClick={() => this.delete()}>Remove</button>
							<button className="btn btn-primary btn-xs" ref="save" onClick={() => this.save()}>Save</button>
							<button className="btn btn-outline btn-xs" ref="cancel" onClick={() => this.cancel()}>Cancel</button>
							<div className="loader-small" ref="loader"></div>
						</div>
					</div>
				</div>
				<ModalBox title={this.state.modalTitle} answer={this.updateModalAnswer.bind(this)} />
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