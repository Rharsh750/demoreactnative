import React from 'react';
import {useFocusEffect} from '@react-navigation/native';
import {SafeAreaView, StyleSheet, Text, View} from 'react-native';
import {connect} from 'react-redux';

import {BackgroundBranded} from '../components/background-branded';
import {BigButton} from '../components/big-button';
import {ErrorMessage} from '../components/error-message';
import {LoginInput} from '../components/login-input';
import {MirusLogo} from '../components/mirus-logo';
import {language} from '../services/language';
import {keys, set} from '../services/local-storage';
import {routes} from '../services/routes';
import {theme} from '../services/theme';
import {checkRequestLocationPermissions, getAliasConfig} from '../services/utils';

import {actions} from '../store';

const mapStateToProps = ({accountAlias}) => ({accountAlias});

const mapDispatchToProps = {
	setAccountAlias: (payload) => ({type: actions.ACCOUNT_SET_ALIAS, payload: payload}),
	setAccountStrategy: (payload) => ({type: actions.ACCOUNT_SET_STRATEGY, payload: payload}),
	toggleLoading: (show) => ({type: actions.SHOW_LOADING_OVERLAY, payload: show}),
};

const AliasScreen = ({
	accountAlias,
	navigation,
	route,
	setAccountAlias,
	setAccountStrategy,
	toggleLoading,
}) => {
	const isUpdate = route?.params?.isUpdate;

	const [errorMessage, setErrorMessage] = React.useState();
	const [inputInFocus, setInputInFocus] = React.useState(false);
	const [newAlias, setNewAlias] = React.useState(accountAlias);

	useFocusEffect(
		React.useCallback(() => {
			toggleLoading(false);
			if (route?.params?.timeoutError) {
				setErrorMessage(language.kioskTimeoutError);
			} else {
				setErrorMessage(null);
			}
			return () => {};
		}, [route.params]),
	);

	const handleOnSubmit = async () => {
		const regex = /^[a-zA-Z]+$/; // alpha only
		if (!newAlias || newAlias.length < 3 || !regex.test(newAlias)) {
			setErrorMessage(language.invalidAccountAlias);
			return;
		}

		setErrorMessage(null);
		toggleLoading(true);

		const config = await getAliasConfig(newAlias);
		if (!config || !config.strategy) {
			setErrorMessage(language.invalidAccountAlias);
			toggleLoading(false);
			return;
		}

		await set(keys.ACCOUNT_ALIAS, newAlias);
		await set(keys.ACCOUNT_STRATEGY, config.strategy);

		setAccountAlias(newAlias);
		setAccountStrategy(config.strategy);

		if (!await checkRequestLocationPermissions()) {
			toggleLoading(false);
			return;
		}

		if (isUpdate) {
			navigation.goBack();
		} else if (config.strategy !== 'local') {
			navigation.navigate(routes.kiosk);
		} else {
			navigation.navigate(routes.login);
		}

		toggleLoading(false);
	};

	const handleInputOnChange = (data) => {
		setNewAlias(data ? data.trim() : '');
	};

	const handleOnInputFocus = () => {
		setErrorMessage(null);
		setInputInFocus(true);
	};

	const handleOnInputBlur = () => {
		setInputInFocus(false);
	};

	return (
		<BackgroundBranded>
			<SafeAreaView style={theme.generalWrapper}>
				<View style={[theme.formContainer, theme.commonContainer, inputInFocus ? {paddingBottom: 0} : {}]}>
					<View style={[styles.logo, inputInFocus ? {marginBottom: theme.margins.commonGapKeyboard} : {}]}>
						<MirusLogo/>
					</View>
					<View>
						<View style={styles.introText}>
							<Text style={theme.text}>Please enter your Account Name:</Text>
						</View>
						{errorMessage && <ErrorMessage message={errorMessage}/>}
							<LoginInput
								maxLength={20}
								onBlur={handleOnInputBlur}
								onChange={handleInputOnChange}
								onFocus={handleOnInputFocus}
								onSubmit={handleOnSubmit}
								overlayText={'.mirus.works'}
								returnKey={isUpdate ? 'done' : 'next'}
								type={'off'}
								value={newAlias}
							/>
						{!inputInFocus && <Text style={theme.text}>If you’re not sure what your Account Name should, please speak with your Mirus Works admin or contact Mirus Support.</Text>}
					</View>
				</View>
				<View style={{width: '100%'}}>
					<BigButton
						onSubmit={handleOnSubmit}
						label={isUpdate ? 'Save' : 'Next'}
					/>
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

export default connect(mapStateToProps, mapDispatchToProps)(AliasScreen);
