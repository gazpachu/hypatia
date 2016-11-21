import React, { Component, PropTypes } from 'react';
import { setLoading, setFilters } from '../../actions/actions';
import {connect} from 'react-redux'
import {firebase, helpers} from 'redux-react-firebase'
import $ from 'jquery';
import Icon from '../common/lib/icon/icon';

const {isLoaded, isEmpty, dataToJS} = helpers;

@firebase( [
  	'posts'
])
@connect(
  	({firebase}) => ({
    	posts: dataToJS(firebase, 'posts'),
  	})
)
class Home extends Component {
    
	constructor(props) {
		super(props);
	}
	
	componentDidMount() {
		this.props.setLoading(false);  // Move this to API callback when implemented (if ever)
		$('.js-main').removeClass().addClass('main js-main home-page');
		
//		firebase.database().ref('posts/0').set({
//			title: "New virtual campus",
//			slug: "new-virtual-campus",
//			content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin auctor pretium arcu, ac ultrices ipsum hendrerit vitae. Nunc at efficitur leo. Nulla tellus mauris, feugiat in mauris volutpat, dictum pellentesque dui. Etiam sed scelerisque odio. Nam fringilla ligula sed tincidunt dapibus. Maecenas eget purus malesuada, blandit nisl in, ornare metus. Phasellus nec sem ipsum. Nulla non enim tristique, pretium leo id, congue lorem. Etiam vitae consectetur tortor. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Maecenas sed lobortis felis. Vestibulum tristique aliquam nunc, nec consectetur metus condimentum feugiat. Praesent at magna a leo tincidunt volutpat ac a mauris.\n\nProin nec orci eu odio faucibus commodo. Donec sed turpis viverra, hendrerit nunc sed, rutrum est. Cras pellentesque libero vel maximus viverra. Fusce dictum nisi euismod rutrum lobortis. Praesent sed magna quam. Mauris eu risus tempor, ullamcorper nulla eu, dignissim nulla. Integer viverra ipsum eget eros feugiat, tempus pulvinar tellus facilisis. Vivamus sed magna ac ipsum tincidunt suscipit sit amet non velit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris tempus eleifend mi, in auctor quam. Integer ut metus fringilla nunc cursus molestie. Praesent eget tortor sagittis, viverra felis sit amet, tempor lectus.\n\nEtiam leo elit, tempor ac tellus eget, commodo mattis orci. Nullam quis mauris eu augue interdum hendrerit. Quisque vehicula aliquet consequat. Nulla in facilisis neque. Proin ut neque auctor, hendrerit purus et, feugiat est. Maecenas sed ornare libero. Nullam ut facilisis ex, elementum sodales urna. Aenean rhoncus blandit nibh, quis sollicitudin augue pretium pellentesque. Aliquam ac sodales nunc, ut mattis massa.\n\nDonec finibus, risus et maximus tempor, risus tortor sagittis velit, vitae commodo lacus nisi quis arcu. Proin aliquet iaculis nulla ut consequat. Vivamus gravida pulvinar neque, eu ultrices nisi dapibus non. Quisque ac diam volutpat, bibendum ligula vel, faucibus purus. Ut nec magna urna. Phasellus dolor massa, rutrum ut luctus interdum, fringilla eget dolor. Nam vitae orci sed felis molestie posuere. Quisque vitae felis commodo, faucibus risus vitae, tristique diam. Pellentesque porttitor rhoncus libero, eu ullamcorper metus blandit a. Pellentesque sed risus turpis.",
//			timestamp: 1479760748,
//			author: "gazpachu",
//		  });
		
//		firebase.database().ref('/posts/').once('value').then(function(snapshot) {
//		  	console.log(snapshot.val());
//		});
	}
	
	render() {
		const {firebase, posts} = this.props;
		
		const postsList = (!isLoaded(posts)) ?
                          'Loading'
                        : (isEmpty(posts) ) ?
                              'Todo list is empty'
						: posts.map((post, id) => <li key={id} id={id}>{post.title}</li>)
		
		return (
            <section className="home page container-fluid">
				<ul>
					{postsList}
				</ul>
            </section>
		)
	}
}

const mapDispatchToProps = {
	setLoading
}

const mapStateToProps = ({ mainReducer: { isDesktop } }) => ({ isDesktop });

export default connect(mapStateToProps, mapDispatchToProps)(Home);