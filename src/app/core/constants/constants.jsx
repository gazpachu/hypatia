import showdown from 'showdown';

// Global objects
export const converter = new showdown.Converter();

// Redux
export const SET_USER = 'SET_USER';
export const SET_LOADING = 'SET_LOADING';
export const SET_BREADCRUMBS = 'SET_BREADCRUMBS';
export const SET_DESKTOP = 'SET_DESKTOP';
export const SET_PANEL = 'SET_PANEL';
export const SET_NOTIFICATION = 'SET_NOTIFICATION';
export const SET_USER_DATA = 'SET_USER_DATA';

// Demo details
export const DEMO_EMAIL = 'demo@hypatialms.com';
export const DEMO_CHAT_WARNING = '(Demo account is read-only)';

// Messages
export const USER_CONFIRM_EMAIL = 'Please confirm your email to be able to login';
export const EMAIL_CHANGED = 'Email changed successfully!';
export const DISPLAY_NAME_CHANGED = 'Display name changed successfully!';
export const PASSWORD_CHANGED = 'Password changed successfully!';
export const PASSWORD_MATCH_ERROR = 'Passwords don\'t match';
export const PASSWORD_MIN_LENGTH_ERROR = 'Password min. length is 6 characters';
export const USER_INFO_CHANGED = 'User details changed successfully!';
export const USER_INFO_EMPTY = 'Display name, first name and last name cannot be empty';
export const ITEM_SAVED = 'Item saved!';
export const ITEM_REMOVED = 'Item removed!';
export const CONFIRM_DELETE = 'Are you sure you want to delete';
export const NEED_TITLE = 'You need at least a title';
export const WAIT_FINISH_OPERATION = 'Please wait until the current operation ends';
export const CONFIRM_ENROL = 'Are you sure you want to enrol in the select subjects?';
export const ENROLLED_COURSE = 'You are now enrolled in this course!';
export const ADMIN_REQUIRED = 'Sorry, this operation requires admin rights';

// User level
export const ADMIN_LEVEL = 5;
