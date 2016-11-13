import * as CONSTANTS from '../constants/constants';

// State is not the application state, only the state this reducer is respondible for
export default function main(state = {isLoading: true, isDesktop: true, breadcrumbs: []}, action) {
	switch (action.type) {
		case CONSTANTS.SET_LOADING: return Object.assign({}, state, {isLoading: action.payload});
		case CONSTANTS.SET_BREADCRUMBS: return Object.assign({}, state, {breadcrumbs: action.payload});
		case CONSTANTS.SET_DESKTOP: return Object.assign({}, state, {isDesktop: action.payload});
			
		default: return state;
	}
}