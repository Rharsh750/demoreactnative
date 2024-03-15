import {applyMiddleware, createStore} from 'redux';
import {createLogger} from 'redux-logger';

import {keys, remove, set} from './services/local-storage';

/**
 * ACTIONS
 */
export const actions = {
	SHOW_LOADING_OVERLAY: 'SHOW_LOADING_OVERLAY',
	ACCOUNT_SET_ALIAS: 'ACCOUNT_SET_ALIAS',
	ACCOUNT_SET_STRATEGY: 'ACCOUNT_SET_STRATEGY',
	ACCOUNT_SET_FEDERATED_URL: 'ACCOUNT_SET_FEDERATED_URL',
	USER_SET_CREDENTIALS: 'USER_SET_CREDENTIALS',
	USER_LOGOUT: 'USER_LOGOUT',
	USER_LOGOUT_NON_LOCAL: 'USER_LOGOUT_NON_LOCAL',
	USER_LOGIN_VALID: 'USER_LOGIN_VALID',
	USER_LOGIN_INVALID: 'USER_LOGIN_INVALID',
	DEVICE_TOKEN_SET_RESTORE: 'DEVICE_TOKEN_SET_RESTORE',
	DEVICE_TOKEN_SET_SDK: 'DEVICE_TOKEN_SET_SDK',
	NOTIFICATION_PUSH_KIOSK_URL: 'NOTIFICATION_PUSH_KIOSK_URL',
};

/**
 * DEFAULT STATE
 */
const defaultState = {
	showLoadingOverlay: true, // bool
	accountAlias: null, // string
	accountStrategy: null, // string
	userUsername: null, // string
	userPassword: null, // string
	userIsLoggedIn: false, // bool
	userPersonId: null, // string
	deviceToken: null, // string
	pushedUrl: null, // string
};

/**
 * REDUCER
 */
const reducer = (state = defaultState, action = {}) => {

	try {
		switch (action.type) {
			case actions.SHOW_LOADING_OVERLAY:
				return {
					...state,
					showLoadingOverlay: action.payload,
				};
			case actions.ACCOUNT_SET_ALIAS:
				return {
					...state,
					accountAlias: action.payload,
				};
			case actions.ACCOUNT_SET_STRATEGY:
				return {
					...state,
					accountStrategy: action.payload,
				};
			case actions.USER_SET_CREDENTIALS:
				void set(keys.USER_USERNAME, action.payload?.username);
				void set(keys.USER_PASSWORD, action.payload?.password);
				return {
					...state,
					userUsername: action.payload?.username,
					userPassword: action.payload?.password,
				};
			case actions.USER_LOGIN_VALID:
				if (state.userUsername) void set(keys.USER_USERNAME, state.userUsername);
				if (state.userPassword) void set(keys.USER_PASSWORD, state.userPassword);
				return {
					...state,
					userIsLoggedIn: true,
					userPersonId: action.payload ? action.payload : state.userPersonId,
				};
			case actions.USER_LOGIN_INVALID:
				return {
					...state,
					userIsLoggedIn: false,
					userPersonId: null,
				};
			case actions.USER_LOGOUT:
				void remove(keys.USER_USERNAME);
				void remove(keys.USER_PASSWORD);
				return {
					...state,
					userUsername: null,
					userPassword: null,
					userIsLoggedIn: false,
					userPersonId: null,
				};
			case actions.USER_LOGOUT_NON_LOCAL:
				return {
					...state,
					pushedUrl: action.payload,
					userIsLoggedIn: false,
				};
			case actions.DEVICE_TOKEN_SET_RESTORE:
				// Restoring shouldn't overwrite any SDK set token
				if (state.deviceToken) {
					return state;
				} else {
					return {
						...state,
						deviceToken: action.payload,
					};
				}
			case actions.DEVICE_TOKEN_SET_SDK:
				void set(keys.DEVICE_TOKEN, action.payload);
				return {
					...state,
					deviceToken: action.payload,
				};
			case actions.NOTIFICATION_PUSH_KIOSK_URL:
				return {
					...state,
					pushedUrl: action.payload,
				};
			default:
				return state;
		}
	} catch (e) {
		return state;
	}
};

/**
 * MIDDLEWARE
 */
const middlewares = [];
const wantLogger = false;
if (__DEV__ && wantLogger) {
	middlewares.push(createLogger());
}
const middleware = applyMiddleware(...middlewares);

// EXPORT
export const store = createStore(reducer, middleware);
