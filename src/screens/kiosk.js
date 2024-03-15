import {useFocusEffect} from '@react-navigation/native';
import React, {useRef} from 'react';
import {BackHandler, SafeAreaView, StyleSheet, View} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import {WebView} from 'react-native-webview';
import {connect} from 'react-redux';
import firebase from 'react-native-firebase';

import {localhost} from '../../app.json';
import {routes} from '../services/routes';
import {theme} from '../services/theme';
import {checkRequestLocationPermissions, handleGeoError, postDeviceToken} from '../services/utils';
import {actions} from '../store';

const mapStateToProps = ({
	accountAlias,
	accountStrategy,
	userPassword,
	userUsername,
	showLoadingOverlay,
	pushedUrl,
	userPersonId,
}) => ({
	accountAlias,
	userPassword,
	userUsername,
	isLocalStrategy: accountStrategy === 'local',
	isLoading: showLoadingOverlay,
	pushedUrl,
	webAuthValid: !!userPersonId,
});

const mapDispatchToProps = {
	handleValidLogin: (personId) => ({type: actions.USER_LOGIN_VALID, payload: personId}),
	handleInvalidLogin: () => ({type: actions.USER_LOGIN_INVALID}),
	handleLogout: () => ({type: actions.USER_LOGOUT}),
	toggleLoading: (show) => ({type: actions.SHOW_LOADING_OVERLAY, payload: show}),
};

const LoginScreen = ({
	accountAlias,
	handleLogout,
	handleValidLogin,
	handleInvalidLogin,
	isLocalStrategy,
	navigation,
	toggleLoading,
	userPassword,
	userUsername,
	isLoading,
	pushedUrl,
	webAuthValid,
}) => {
	const [uri, setUri] = React.useState();

	const webViewRef = useRef();
	const aliasRef = useRef();
	const uriRef = useRef();
	const loadTimeoutRef = useRef();
	const locationRef = useRef();
	const canGoBackRef = useRef();

	useFocusEffect(
		React.useCallback(() => {
			handleAliasChanges(accountAlias, isLocalStrategy);
			if (!uriRef.current || (uriRef.current && pushedUrl)) {
				const host = accountAlias === 'local' ? localhost : `https://${accountAlias}.mirus.works`;
				const url = pushedUrl && webAuthValid ? pushedUrl : isLocalStrategy ? '/#/login-native' : '/#/works/home';
				uriRef.current = `${host}${url}`;
				setUri(uriRef.current);
			}

			void checkRequestLocationPermissions();
			startWatchingPosition();

			startLoadingTimer();
			startBackHandler();

			if (pushedUrl) {
				firebase.notifications().removeAllDeliveredNotifications();
			}

			return () => {
				stopLoadingTimer();
				stopWatchingPosition();
				stopBackHandler();
			};
		}, [accountAlias, isLocalStrategy, pushedUrl, webAuthValid, uriRef.current]),
	);

	const appReadyAndAuthenticated = (personId) => {
		handleValidLogin(personId);
		if (personId) void postDeviceToken(accountAlias, personId);
		setTimeout(() => toggleLoading(false), 500);
	};

	const appReadyNonLocal = () => {
		setTimeout(() => toggleLoading(false), 500);
	};

	const handleOnMessage = (event) => {
		try {
			const message = JSON.parse(event.nativeEvent.data);
			if (__DEV__) console.log('~~~ message', message);
			if (!message || !message.action) return;
			stopLoadingTimer();
			switch (message.action) {
				case 'NATIVE_LOGIN_READY':
					const credentials = JSON.stringify({username: userUsername, password: userPassword});
					webViewRef.current.injectJavaScript(`window.nativeAppCredentials = ${credentials};`);
					webViewRef.current.injectJavaScript(`window.nativeAppSubmitLogin()`);
					break;
				case 'NATIVE_LOGIN_RESULT':
					if (message.payload === true) appReadyAndAuthenticated();
					else if (isLocalStrategy) navigation.reset({routes: [{name: routes.login, params: {kioskAuthError: true}}]});
					break;
				case 'NATIVE_WEBVIEW_RELOAD':
					webViewRef.current.reload();
					break;
				case 'APP_IS_AUTHENTICATED':
					if (message.payload) {
						appReadyAndAuthenticated(message.payload);
					} else if (isLocalStrategy) {
						handleInvalidLogin();
					} else {
						appReadyNonLocal();
					}
					break;
				case 'APP_LOGOUT':
					handleLogout();
					if (isLocalStrategy) setTimeout(() => navigation.reset({routes: [{name: routes.login}]}), 250);
					break;
				case 'NAVIGATE_SETTINGS':
					navigation.navigate(routes.settings);
					break;
				case 'CONSOLE_LOG':
					if (__DEV__) console.log(message.payload);
					break;
			}
		} catch (e) {
			if (__DEV__) console.log('~~~ handleOnMessage e', e);
		}
	};

	const startLoadingTimer = () => {
		if (!loadTimeoutRef.current) {
			loadTimeoutRef.current = setTimeout(() => {
				loadTimeoutRef.current = null;
				navigation.navigate(isLocalStrategy ? routes.login : routes.alias, {timeoutError: true});
			}, 15 * 1000);
		}
	};

	const stopLoadingTimer = () => {
		if (loadTimeoutRef.current) clearTimeout(loadTimeoutRef.current);
	};

	const startWatchingPosition = () => {
		if (!locationRef.current) {
			locationRef.current = Geolocation.watchPosition(
				injectCoords,
				({code}) => handleGeoError(code),
				{enableHighAccuracy: true},
			);
		}
	};

	const injectCoords = ({coords}) => {
		if (webViewRef.current && coords) {
			// if (__DEV__) console.log('~~~ injectCoords', coords);
			const injectCoords = {longitude: coords.longitude, latitude: coords.latitude};
			webViewRef.current.injectJavaScript(`window.nativeAppCoords = {coords: ${JSON.stringify(injectCoords)}};`);
		}
	};

	const stopWatchingPosition = () => {
		if (locationRef.current) {
			Geolocation.clearWatch(locationRef.current);
			locationRef.current = null;
		}
	};

	const onNavStateChange = ({canGoBack, url}) => {
		console.log('~~~ url', url);
		if (Platform.OS === 'android') canGoBackRef.current = canGoBack;
	};

	const backHandler = () => {
		if (canGoBackRef.current && webViewRef.current) webViewRef.current.goBack();
		return canGoBackRef.current;
	};

	const startBackHandler = () => {
		if (Platform.OS === 'android') {
			BackHandler.addEventListener('hardwareBackPress', backHandler);
		}
	};

	const stopBackHandler = () => {
		if (Platform.OS === 'android') {
			BackHandler.removeEventListener('hardwareBackPress', backHandler);
		}
	};

	const handleAliasChanges = (alias, isLocal) => {
		if (!aliasRef.current) {
			aliasRef.current = alias;
		} else if (aliasRef.current !== alias) {
			uriRef.current = null;
			handleLogout();
			if (isLocal) navigation.replace(routes.login);
		}
	};

	return uri ? (
		<View style={styles.container}>
			<SafeAreaView style={[styles.webWrapper, {left: isLoading ? '100%' : 0}]}>
				<WebView
					ref={(ref) => webViewRef.current = ref}
					source={{uri}}
					originWhitelist={['*']}
					onMessage={(event) => handleOnMessage(event)}
					onNavigationStateChange={onNavStateChange}
					// incognito={isLocalStrategy}
				/>
			</SafeAreaView>
		</View>
	) : null;
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: theme.colors.primaryNavy,
	},
	webWrapper: {
		flex: 1,
		position: 'absolute',
		width: '100%',
		height: '100%',
		top: 0,
		left: '100%',
	},
});

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen);
