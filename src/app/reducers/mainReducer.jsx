import * as CONSTANTS from '../constants/constants';

// State is not the application state, only the state this reducer is respondible for
export default function main(state = {isLoading: true, isLogOpened: false, isDesktop: true, breadcrumbs: [], currentFilters: [], alphaSorting: ''}, action) {
	switch (action.type) {
		case CONSTANTS.SET_LOADING: return Object.assign({}, state, {isLoading: action.payload});
		case CONSTANTS.SET_LOG_OPENED: return Object.assign({}, state, {isLogOpened: action.payload});
		case CONSTANTS.SET_BREADCRUMBS: return Object.assign({}, state, {breadcrumbs: action.payload});
		case CONSTANTS.SET_DESKTOP: return Object.assign({}, state, {isDesktop: action.payload});
		case CONSTANTS.SET_FILTERS: return Object.assign({}, state, {currentFilters: action.payload});
		case CONSTANTS.SET_ALPHA_SORTING: return Object.assign({}, state, {alphaSorting: action.payload});
			
		default: return state;
	}
}