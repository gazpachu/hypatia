// Redux
export const SET_LOADING = 'SET_LOADING';
export const SET_LOG_OPENED = 'SET_LOG_OPENED';
export const SET_BREADCRUMBS = 'SET_BREADCRUMBS';
export const SET_DESKTOP = 'SET_DESKTOP';
export const SET_FILTERS = 'SET_FILTERS';
export const SET_ALPHA_SORTING = 'SET_ALPHA_SORTING';

// API
export const API_URL = process.env.NODE_ENV === 'production' ? '/lighthouse/' : 'https://vf-lighthouse-staging.herokuapp.com/lighthouse/';
export const API_PATH = 'api';