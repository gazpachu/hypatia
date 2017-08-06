import * as CONSTANTS from '../constants/constants';

// State is not the application state, only the state this reducer is respondible for
export default function main(state = {
  isLoading: true,
  user: null,
  panel: '',
  isDesktop: true,
  breadcrumbs: [],
  notification: {
    message: '',
    type: ''
  },
  userData: {}
}, action) {
  switch (action.type) {
    case CONSTANTS.SET_USER:
      return Object.assign({}, state, { user: action.payload });
    case CONSTANTS.SET_PANEL:
      return Object.assign({}, state, { panel: action.payload });
    case CONSTANTS.SET_LOADING:
      return Object.assign({}, state, { isLoading: action.payload });
    case CONSTANTS.SET_BREADCRUMBS:
      return Object.assign({}, state, { breadcrumbs: action.payload });
    case CONSTANTS.SET_DESKTOP:
      return Object.assign({}, state, { isDesktop: action.payload });
    case CONSTANTS.SET_NOTIFICATION:
      return Object.assign({}, state, { notification: action.payload });
    case CONSTANTS.SET_USER_DATA:
      return Object.assign({}, state, { userData: action.payload });
    default:
      return state;
  }
}
