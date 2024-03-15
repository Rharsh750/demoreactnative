import React from 'react';
import {connect} from 'react-redux';
import SplashScreen from 'react-native-splash-screen'

import {get, keys} from '../services/local-storage';
import {routes} from '../services/routes';
import {actions} from '../store';

const mapStateToProps = () => ({});

const mapDispatchToProps = {
	setAccountAlias: (alias) => ({type: actions.ACCOUNT_SET_ALIAS, payload: alias}),
	setAccountStrategy: (strategy) => ({type: actions.ACCOUNT_SET_STRATEGY, payload: strategy}),
	setCredentials: (username, password) => ({type: actions.USER_SET_CREDENTIALS, payload: {username, password}}),
	setDeviceToken: (token) => ({type: actions.DEVICE_TOKEN_SET_RESTORE, payload: token}),
};

const BootstrapScreen = ({
	navigation,
	setAccountAlias,
	setAccountStrategy,
	setCredentials,
	setDeviceToken
}) => {
	const boot = async () => {
		const alias = await get(keys.ACCOUNT_ALIAS);
		alias && setAccountAlias(alias);

		const strategy = await get(keys.ACCOUNT_STRATEGY);
		strategy && setAccountStrategy(strategy);

		const username = await get(keys.USER_USERNAME);
		const password = await get(keys.USER_PASSWORD);
		username && setCredentials(username, password);

		const deviceToken = await get(keys.DEVICE_TOKEN);
		deviceToken && setDeviceToken(deviceToken);

		const onBoardingComplete = await get(keys.ONBOARDING_COMPLETED);

		if (!onBoardingComplete) {
			navigation.replace(routes.welcome);
		} else if (alias) {
			if (username && password || strategy !== 'local') {
				navigation.replace(routes.kiosk, {noAnimation: true});
			} else {
				navigation.replace(routes.login, {noAnimation: true});
			}
		} else {
			navigation.replace(routes.alias, {noAnimation: true});
		}

		setTimeout(() => SplashScreen.hide(), 200);
	};

	void boot();
	return null;
};

export default connect(mapStateToProps, mapDispatchToProps)(BootstrapScreen);
