import * as CONSTANTS from '../constants/constants';

export function setUser(state) {
  return { type: CONSTANTS.SET_USER, payload: state };
}

export function setPanel(state) {
  return { type: CONSTANTS.SET_PANEL, payload: state };
}

export function setLoading(state) {
  return { type: CONSTANTS.SET_LOADING, payload: state };
}

export function setBreadcrumbs(state) {
  return { type: CONSTANTS.SET_BREADCRUMBS, payload: state };
}

export function changeViewport(state) {
  return { type: CONSTANTS.SET_DESKTOP, payload: state };
}

export function setNotification(state) {
  return { type: CONSTANTS.SET_NOTIFICATION, payload: state };
}

export function setUserData(state) {
  return { type: CONSTANTS.SET_USER_DATA, payload: state };
}
