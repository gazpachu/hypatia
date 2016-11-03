import React, { Component, PropTypes } from 'react';
import $ from 'jquery';
import { history } from '../../../store';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { setBreadcrumbs } from '../../../actions/actions';

import Icon from '../lib/icon/icon';
import Back from '../../../../../static/back.svg';

class Breadcrumbs extends Component {
	
	constructor(props) {
		super(props);
		
		this.state = {
			initialised: false
		}
	}
	
	componentDidMount() {
		
		history.listen( location => {
			let id = location.pathname.substring(1);
			this.updateTrail(id);
		});
	}
	
	componentDidUpdate() {	
		if(this.props.topics && this.props.topics.data.length > 0 && !this.state.initialised) {
			this.setState({initialised: true}, function() {
				this.updateTrail(this.props.params.questionId);
			});
		}
	}
	
	searchIdIndex(id) {
		
		// Look for the index of the given ID in the topics dataset
		let index = null;
		this.props.topics.data.map(function(item, i) {
			if (item.id === id) index = i;
		});
		return index;
	}
	
	updateTrail(id) {
		
		if (id !== undefined) {
			let newTrail = [];

			if (id !== '') {
				let index = this.searchIdIndex(id);

				// Build the breadcrumbs trail if ID found in topics dataset
				if (index) {

					let level = this.props.topics.data[index].attributes.level,
						name = this.props.topics.data[index].attributes.name,
						parents = [];

					// Find the item parents if there's any
					for (let i=level; i>0; i--) {
						let parentIndex = null,
							parentId = this.props.topics.data[index].relationships.parent.data.id || null;

						if (parentId) {
							parentIndex = this.searchIdIndex(parentId);
							parents.push({id: parentId, level: i, name: this.props.topics.data[parentIndex].attributes.name});
						}
						index = parentIndex;
					}

					parents.reverse();

					for (let i=0; i<parents.length; i++) {
						newTrail[i] = {name: parents[i].name, id: parents[i].id, level: parents[i].level};
					}

					// Add the current item at the end of the trail
					newTrail.push({id: id, level: level, name: name});
				}
				else { // Case for static pages (i.e. favourites, inbox)
					newTrail.push({id: id, level: 0, name: id});
				}
			}
			else {
				newTrail.push({name: 'Home'});
			}

			this.props.setBreadcrumbs(newTrail);
		}
	}
	
	render() {
		return (
			<div className="breadcrumbs">
				<Link to="/" className={`go-back`}><Icon glyph={Back} /></Link>
				<ul className="breadcrumbs-items">
					{this.props.breadcrumbs ? this.props.breadcrumbs.map((item, i) => <li className="item" key={i} data-id={item.id} data-level={item.level} onClick={() => {this.updateTrail(item.id); this.props.setItem(item.id)}}>{item.name}</li>) : ''}
				</ul>
			</div>
		)
	}
}

export default Breadcrumbs;