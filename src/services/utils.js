import {Alert, Platform} from 'react-native';
import firebase from 'react-native-firebase';
import {check, PERMISSIONS, request, RESULTS} from 'react-native-permissions';

import {settingsApi, settingsToken, strategyApi, strategyToken} from '../../app.json';
import {store} from '../store';
import {language} from './language';

export const checkRequestLocationPermissions = async () => {
	const permission = Platform.OS === 'ios' ?
		PERMISSIONS.IOS.LOCATION_WHEN_IN_USE :
		PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;
	return await check(permission)
		.then(permissionsCheckHandler)
		.catch(permissionsErrorHandler);
};

const permissionsCheckHandler = async (result, isRequest) => {
	const permission = Platform.OS === 'ios' ?
		PERMISSIONS.IOS.LOCATION_WHEN_IN_USE :
		PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;
	switch (result) {
		case RESULTS.DENIED:
			if (isRequest) {
				Alert.alert(language.errorNoGeoNoLocTitle, language.errorNoGeoNoLocMessage);
				return false;
			} else {
				return request(permission)
					.then((result) => permissionsCheckHandler(result, true));
			}
		case RESULTS.GRANTED:
			return true;
		case RESULTS.BLOCKED:
			Alert.alert(language.errorNoGeoNoLocTitle, language.errorNoGeoNoLocMessage);
			return false;
		case RESULTS.UNAVAILABLE:
		default:
			Alert.alert(language.errorNoGeoPermsTitle, language.errorNoGeoPermsMessage);
			return false;
	}
};

const permissionsErrorHandler = (error) => {
	if (__DEV__) console.error(error);
	return false;
};

/** getAliasConfig
 * {"url": "https://fs.ozcare.org.au/adfs/ls/",	"strategy": "saml"}
 * {"errors": [{"message": "Account for alias 'blah' not found"}]}
 */
export const getAliasConfig = async (alias) => {
	if (__DEV__ && alias === 'local') {
		return await new Promise((resolve) => {
			setTimeout(() => resolve({strategy: 'openid'}), 500);
		});
	}

	try {
		return await fetch(`${strategyApi}?alias=${alias}`, {headers: {'authorization': strategyToken}})
			.then((response) => response.json())
			.then((json) => json);
	} catch (e) {
		if (__DEV__) console.log('~~~ error getAliasConfig', e);
		return null;
	}
};

/** postDeviceToken {
	"alias": "<alias> ",
	"person": "<person_id>",
	"deviceToken": "dZRNHjNFxk ... 3Ee49R8cA_x7cv",
	"pushEnabled": true
} */
export const postDeviceToken = async (alias, personId) => {
	const {deviceToken} = store.getState();
	if (!deviceToken || !alias || !personId) return;

	try {
		const data = {
			alias,
			deviceToken,
			pushEnabled: await firebase.messaging().hasPermission(),
			person: personId,
		};

		fetch(settingsApi, {
			method: 'PUT',
			headers: {'authorization': settingsToken, 'Content-Type': 'application/json'},
			body: JSON.stringify(data),
		})
			.then((response) => response.text())
			.then((text) => {__DEV__ && console.log('~~~ postDeviceToken', text);});
	} catch (e) {
		if (__DEV__) console.log('~~~ error postDeviceToken', e);
	}
};

export const handleGeoError = (code) => {
	// console.log('~~~ handleGeoError', code);
	// https://www.npmjs.com/package/react-native-geolocation-service#error-codes
	switch (code) {
		case 1: //PERMISSION_DENIED
			return Alert.alert(language.errorNoGeoPermsTitle, language.errorNoGeoPermsMessage);
		case 2: //POSITION_UNAVAILABLE
		case 3: //TIMEOUT
			return Alert.alert(language.errorNoGeoNoLocTitle, language.errorNoGeoNoLocMessage);
		case 4: //PLAY_SERVICE_NOT_AVAILABLE
		case 5: //SETTINGS_NOT_SATISFIED
		case -1: //INTERNAL_ERROR
		// return Alert.alert(language.errorNoGeoErrorTitle, language.errorNoGeoErrorMessage);
	}
};
