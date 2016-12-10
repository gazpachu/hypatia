import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { setLoading, setNotification } from '../../actions/actions';
import * as CONSTANTS from '../../constants/constants';
import { firebase, helpers } from 'redux-react-firebase';
import $ from 'jquery';
import classNames from 'classnames';
import SimpleMDE from 'simplemde';
import Helpers from '../common/helpers';
import Icon from '../common/lib/icon/icon';

const {isLoaded, isEmpty, dataToJS} = helpers;

const defaultProps = {
	module: {
		title: '',
		content: '',
		slug: ''
	}
};

const propTypes = {
	module: PropTypes.object
};

@firebase( [
  	'modules',
	'subjects',
	'courses'
])
@connect(
  	({firebase}) => ({
    	modules: dataToJS(firebase, 'modules'),
		subjects: dataToJS(firebase, 'subjects'),
		courses: dataToJS(firebase, 'courses')
  	})
)
class Admin extends Component {
	
	constructor(props) {
		super(props);
		
		this.state = {
			action: '',
			type: '',
			selectedId: '',
			selectedItem: null
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
		if (isLoaded(type) && !isEmpty(type) && event.target.value !== '') {
			let selectedItem = this.props[type][event.target.value];

			this.setState({ action, type, selectedId: event.target.value, selectedItem }, function() {
				console.log(this.state.action, this.state.type, this.state.selectedId, this.state.selectedItem);
			}.bind(this));
		}
		else this.cancel();
	}
	
	new(type) {
		this.setState({ action: 'new', type, selectedId: '', selectedItem: null });
	}
	
	cancel() {
		this.setState({ action: '', type: '', selectedId: '' });
		this.refs['modules-select'].selectedIndex = 0;
		this.refs['subjects-select'].selectedIndex = 0;
		this.refs['courses-select'].selectedIndex = 0;
	}
	
	save() {
		if (this.state.action === 'new') {
			this.props.firebase.push(this.state.type, {
				title: this.refs['title-input'].value,
				slug: Helpers.slugify(this.refs['title-input'].value),
				content: this.refs['editor'].value
			}, () => this.props.setNotification({message: CONSTANTS.ITEM_SAVED, type: 'success'}));
		}
		else {
			this.props.firebase.set(this.state.type+'/'+this.state.selectedId, {
				title: this.refs['title-input'].value,
				slug: Helpers.slugify(this.refs['title-input'].value),
				content: this.refs['editor'].value
			}, () => this.props.setNotification({message: CONSTANTS.ITEM_SAVED, type: 'success'}));
		}
	}
	
	delete() {
		firebase.remove(this.state.type+'/'+this.state.selectedId);
	}
	
	updateItem(event, prop, value) {
		const newItem = Object.assign({}, this.state.selectedItem, {[prop]: value || event.target.value});
		this.setState({ selectedItem: newItem });
	}
	
	render () {
		const {firebase, modules, subjects, courses} = this.props;

		const modulesList = (isLoaded(modules) && !isEmpty(modules)) ?
			Object.keys(modules).map(function(key) {
				let item = modules[key];
				return <option key={key} value={key}>{item.title}</option>;
			}) : '';
		
		const subjectsList = (isLoaded(subjects) && !isEmpty(subjects)) ?
			Object.keys(subjects).map(function(key) {
				let item = subjects[key];
				return <option key={key} value={key}>{item.title}</option>;
			}) : '';
		
		const coursesList = (isLoaded(courses) && !isEmpty(courses)) ?
			Object.keys(courses).map(function(key) {
				let item = courses[key];
				return <option key={key} value={key}>{item.title}</option>;
			}) : '';
		
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
					</div>
					<div className={classNames('item-content column', {hidden: this.state.action === ''})}>
						<div className="block clearfix">
							<h3 className="block-title">{(this.state.action === 'new') ? <span>New item for {this.state.type}</span> : <span>Edit {this.state.type} item</span>}</h3>
							<input type="text" className="input-field" ref="title-input" placeholder="Title" value={(this.state.selectedItem) ? this.state.selectedItem.title : ''} onChange={(event) => this.updateItem(event, 'title')} />
							<textarea className="input-field" id="editor" ref="editor" value={(this.state.selectedItem) ?this.state.selectedItem.content : ''} onChange={(event) => this.updateItem(event, 'content')}></textarea>
							<button className="btn btn-cancel btn-xs" onClick={() => this.delete()}>Remove</button>
							
							<button className="btn btn-primary btn-xs" onClick={() => this.save()}>Save</button>
							<button className="btn btn-outline btn-xs" onClick={() => this.cancel()}>Cancel</button>
						</div>
					</div>
				</div>
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