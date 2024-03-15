import {useFocusEffect} from '@react-navigation/native';
import React from 'react';
import {SafeAreaView, StyleSheet, Text, View} from 'react-native';
import {connect} from 'react-redux';

import {BackgroundBranded} from '../components/background-branded';
import {BigButton} from '../components/big-button';
import {ErrorMessage} from '../components/error-message';
import {LoginInput} from '../components/login-input';
import {MirusLogo} from '../components/mirus-logo';
import {language} from '../services/language';
import {deviceUpToMedium} from '../services/responsive';
import {routes} from '../services/routes';
import {theme} from '../services/theme';
import {checkRequestLocationPermissions} from '../services/utils';
import {actions} from '../store';

const mapStateToProps = ({
	accountStrategy,
	userPassword,
	userUsername,
}) => ({
	accountStrategy,
	userPassword,
	userUsername,
});

const mapDispatchToProps = {
	setCredentials: (username, password) => ({
		type: actions.USER_SET_CREDENTIALS,
		payload: {username, password},
	}),
	toggleLoading: (show) => ({type: actions.SHOW_LOADING_OVERLAY, payload: show}),
};

const LoginScreen = ({
	accountStrategy,
	navigation,
	route,
	setCredentials,
	toggleLoading,
	userPassword,
	userUsername,
}) => {
	const [username, setUsername] = React.useState(userUsername);
	const [password, setPassword] = React.useState(userPassword);

	const [errorMessage, setErrorMessage] = React.useState();
	const [inputInFocus, setInputInFocus] = React.useState(false);
	const [showLogo, setShowLogo] = React.useState(true);

	useFocusEffect(
		React.useCallback(() => {
			if (accountStrategy !== 'local') {
				return navigation.navigate(routes.kiosk);
			}
			if (route?.params?.kioskAuthError) {
				setErrorMessage(language.loginInvalidCredentials);
			} else if (route?.params?.timeoutError) {
				setErrorMessage(language.kioskTimeoutError);
			} else {
				setErrorMessage(null);
			}
			toggleLoading(false);
			return () => {};
		}, [route.params]),
	);

	const handleOnSubmit = async () => {
		if (!username || !password || username.length < 3 || password.length < 3) {
			setErrorMessage(language.loginInvalidCredentials);
			return;
		}

		setErrorMessage(null);
		toggleLoading(true);
		setCredentials(username, password);

		if (!await checkRequestLocationPermissions()) return toggleLoading(false);

		navigation.navigate(routes.kiosk);
	};

	const handleOnInputFocus = () => {
		setErrorMessage(null);
		setInputInFocus(true);
		deviceUpToMedium && setShowLogo(false);
	};

	const handleOnInputBlur = () => {
		setInputInFocus(false);
		setShowLogo(true);
	};

	const handleDevTool = () => {
		setUsername('kiosk');
		setPassword('M2rus2@17');
	};

	return (
		<BackgroundBranded>
			<SafeAreaView style={theme.generalWrapper}>
				<View style={[theme.formContainer, theme.commonContainer, inputInFocus ? {paddingBottom: 0} : {}]}>
					{showLogo &&
					<View style={[styles.logo, inputInFocus ? {marginBottom: theme.margins.commonGapKeyboard} : {}]}>
						<MirusLogo/>
					</View>}
					<View>
						<View style={styles.introText}>
							<Text style={theme.text}>Please enter your Username and Password:</Text>
						</View>
						{errorMessage && <ErrorMessage message={errorMessage}/>}
						<LoginInput
							keyboard={'email-address'}
							onBlur={handleOnInputBlur}
							onChange={setUsername}
							onFocus={handleOnInputFocus}
							placeholder={'Username'}
							type={'email'}
							value={username}
						/>
						<LoginInput
							isPassword={true}
							onBlur={handleOnInputBlur}
							onChange={setPassword}
							onFocus={handleOnInputFocus}
							onSubmit={handleOnSubmit}
							placeholder={'Password'}
							type={'password'}
							value={password}
							noBottomMargin={inputInFocus}
							returnKey={'go'}
						/>
						{!inputInFocus && <View style={styles.introText}>
							<Text style={theme.text}>
								If you forget your password, please speak with your Mirus Works admin or contact Mirus Support.
							</Text>
						</View>}
					</View>
				</View>
				<View style={{width: '100%'}}>
					<BigButton
						onSubmit={handleOnSubmit}
						label={'Login'}
					/>
					{__DEV__ &&
					<View style={[theme.center, {position: 'absolute', bottom: 0, right: 0, borderLeftWidth: 1}]}>
						<View style={theme.center}>
							<BigButton onSubmit={handleDevTool} label={'__DEV__'}/>
						</View>
					</View>}
				</View>
			</SafeAreaView>
		</BackgroundBranded>
	);
};

const styles = StyleSheet.create({
	logo: {
		marginBottom: theme.margins.commonGap,
	},
	introText: {
		marginBottom: theme.margins.commonRow,
	},
});

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen);
