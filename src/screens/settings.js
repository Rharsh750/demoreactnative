import React from 'react';
import {SafeAreaView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {connect} from 'react-redux';
import {version} from '../../app';
import {nativeLogoutPath} from '../../app.json';
import {BigButton} from '../components/big-button';

import {routes} from '../services/routes';
import {theme} from '../services/theme';
import {actions} from '../store';

const mapStateToProps = ({
	accountAlias,
	accountStrategy,
	userIsLoggedIn,
}) => ({
	accountAlias,
	isLocalStrategy: accountStrategy === 'local',
	showLogout: userIsLoggedIn,
});

const mapDispatchToProps = {
	handleLogout: () => ({type: actions.USER_LOGOUT}),
	handleLogoutNonLocal: () => ({
		type: actions.USER_LOGOUT_NON_LOCAL,
		payload: nativeLogoutPath + '?rand_id=' + Date.now(),
	}),
};

const SettingsScreen = ({navigation, accountAlias, handleLogout, isLocalStrategy, showLogout, handleLogoutNonLocal}) => {
	const logout = () => {
		if (isLocalStrategy) {
			handleLogout();
			navigation.reset({routes: [{name: routes.login}]});
		} else {
			handleLogoutNonLocal();
			navigation.goBack();
		}
	};

	return (
		<SafeAreaView style={theme.generalWrapper}>
			<View style={styles.container}>
				<View style={styles.item}>
					<TouchableOpacity
						style={styles.option}
						activeOpacity={0.75}
						onPress={() => navigation.push(routes.alias, {isUpdate: true})}
					>
						<View>
							<Text style={[theme.text, theme.textBlack]}>Account</Text>
						</View>
						<View style={styles.action}>
							<Text style={[theme.text, theme.textBlack, {opacity: 0.75}]}>
								{accountAlias}
							</Text>
							<Text style={[theme.text, theme.textBlack, {
								opacity: 0.5,
								marginLeft: 15,
							}]}>&gt;</Text>
						</View>
					</TouchableOpacity>
				</View>
			</View>
			<View style={{justifyContent: 'center', marginVertical: 12}}>
				<Text style={{textAlign: 'center'}}>Mirus Works Kiosk v{version}</Text>
				<Text style={{textAlign: 'center'}}>&copy; 2020 Mirus Australia Pty Ltd</Text>
			</View>
			{showLogout && <View style={{width: '100%'}}>
				<BigButton onSubmit={logout} label={'Logout'}/>
			</View>}
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingVertical: 40,
		width: '100%',
	},
	item: {
		height: 60,
		flexDirection: 'row',
		backgroundColor: theme.colors.backgroundGrey,
		marginBottom: 30,
	},
	option: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		height: 60,
		paddingHorizontal: 30,
		backgroundColor: theme.colors.primaryWhite,
	},
	action: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'flex-end',
	},
});

export default connect(mapStateToProps, mapDispatchToProps)(SettingsScreen);
