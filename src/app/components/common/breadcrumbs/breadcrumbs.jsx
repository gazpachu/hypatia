import React, { Component, PropTypes } from 'react';
import $ from 'jquery';
import { history } from '../../../store';
import { Link } from 'react-router';
import Helpers from '../../common/helpers';
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
			let id = location.query.question_id || location.pathname.substring(1);
			//this.updateTrail(id);
		});
	}
	
	componentDidUpdate() {	
		
	}
	
	updateTrail(id) {
		if (id !== undefined) {
			let newTrail = [];

			if (id !== '') {
				let index = Helpers.findTopicIndexOfQuestion(this.props.topics, id);

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
							parentIndex = Helpers.findIndex(this.props.topics, parentId);
							parents.push(this.props.topics.data[parentIndex].attributes.name);
						}
						index = parentIndex;
					}

					parents.reverse();

					for (let i=0; i<parents.length; i++) {
						newTrail.push(parents[i]);
					}
					
					// Add the current topic name
					newTrail.push(name);

					// Add the current question at the end of the trail
					let questionIndex = Helpers.findIndex(this.props.questions, id);
					newTrail.push(this.props.questions.data[questionIndex].attributes.short_title);
				}
				else { // Case for static pages (i.e. favourites, inbox) or favourite links
					if (!isNaN(id)) {
						if (this.props.questions.data[0])
							newTrail.push(this.props.questions.data[0].attributes.short_title);
					}
					else
						newTrail.push(id);
				}
			}
			else { // Case for the home page
				newTrail.push('Home');
			}

			this.props.setBreadcrumbs(newTrail);
		}
	}
	
	render() {
		return (
			<div className="breadcrumbs">
				<ul className="breadcrumbs-items">
					{this.props.breadcrumbs ? this.props.breadcrumbs.map((item, i) => <li className="item" key={i}>{item}</li>) : ''}
				</ul>
			</div>
		)
	}
}

const mapDispatchToProps = {
	setBreadcrumbs
}

const mapStateToProps = ({ mainReducer: { breadcrumbs } }) => ({ breadcrumbs });

export default connect(mapStateToProps, mapDispatchToProps)(Breadcrumbs);