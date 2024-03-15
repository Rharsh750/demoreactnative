import React from 'react';
import {SafeAreaView, StyleSheet, Text, View, Platform} from 'react-native';
import {connect} from 'react-redux';
import firebase from 'react-native-firebase';

import {BackgroundBranded} from '../components/background-branded';
import {BigButton} from '../components/big-button';
import {MirusLogo} from '../components/mirus-logo';
import {routes} from '../services/routes';
import {theme} from '../services/theme';
import {checkRequestLocationPermissions} from '../services/utils';
import {set, keys} from '../services/local-storage'

const mapStateToProps = () => ({});

const mapDispatchToProps = {};

const isAndroidPermissionsSetAlready = Platform.OS === 'android';

const PermissionsScreen = ({navigation}) => {
	const [promptedLocation, setPromptedLocation] = React.useState(false);
	const [promptedNotifications, setPromptedNotifications] = React.useState(false);

	const handleEnableLocation = () => {
		void checkRequestLocationPermissions();
		setPromptedLocation(true);
	};

	const handleEnableNotifications = () => {
		void firebase.messaging().requestPermission();
		setPromptedNotifications(true);
	};

	const handleNext = () => {
		void set(keys.ONBOARDING_COMPLETED, true);
		navigation.navigate(routes.alias);
	};

	return (
		<BackgroundBranded>
			<SafeAreaView style={theme.generalWrapper}>
				<View style={[theme.formContainer, theme.commonContainer]}>
					<View style={styles.logo}>
						<MirusLogo/>
					</View>
					<View style={styles.box}>
						<View style={styles.introText}>
							<Text style={theme.text}>To start and finish shifts Works requires access to your location:</Text>
						</View>
						<View style={{width: 200}}>
							<BigButton
								onSubmit={handleEnableLocation}
								label={'Enable Location'}
								disabled={promptedLocation}
							/>
						</View>
					</View>
					{!isAndroidPermissionsSetAlready && <View style={[styles.box, theme.last]}>
						<View style={styles.introText}>
							<Text style={theme.text}>To receive shifts offers please enable notifications:</Text>
						</View>
						<View style={{width: 200}}>
							<BigButton
								onSubmit={handleEnableNotifications}
								label={'Enable Notifications'}
								disabled={promptedNotifications}
							/>
						</View>
					</View>}
				</View>
				<View style={{width: '100%'}}>
					<BigButton
						onSubmit={handleNext}
						label={'Next'}
						disabled={!promptedLocation && (!isAndroidPermissionsSetAlready || !promptedNotifications)}
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
	box: {
		width: 280,
		marginBottom: theme.margins.commonGap,
		alignItems: 'center',
	},
});

export default connect(mapStateToProps, mapDispatchToProps)(PermissionsScreen);
