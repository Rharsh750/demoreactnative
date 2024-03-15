import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import {KeyboardAvoidingView, Platform} from 'react-native';
import {connect} from 'react-redux';
import firebase from 'react-native-firebase';

import {Loading} from './components/loading';
import {NavButton} from './components/nav-button';

import AliasScreen from './screens/alias';
import BootstrapScreen from './screens/bootstrap';
import KioskScreen from './screens/kiosk';
import LoginScreen from './screens/login';
import PermissionsScreen from './screens/permissions';
import SettingsScreen from './screens/settings';
import WelcomeScreen from './screens/welcome';

import {routes} from './services/routes';
import {headerStyle} from './services/theme';

const mapStateToProps = ({showLoadingOverlay}) => ({showLoading: showLoadingOverlay});

const MainStack = createStackNavigator();

firebase.analytics().setAnalyticsCollectionEnabled(true);

const getActiveRouteName = state => {
	const route = state.routes[state.index];
	if (route.state) return getActiveRouteName(route.state);
	return route.name;
};

const Router = ({showLoading}) => {
	const routeNameRef = React.useRef();
	const navigationRef = React.useRef();

	React.useEffect(() => {
		const state = navigationRef.current.getRootState();
		routeNameRef.current = getActiveRouteName(state);
	}, []);

	return (
		<NavigationContainer
			ref={navigationRef}
			onStateChange={(state) => {
				const previousRouteName = routeNameRef.current;
				const currentRouteName = getActiveRouteName(state);
				if (previousRouteName !== currentRouteName) {
					firebase.analytics().setCurrentScreen(currentRouteName, currentRouteName);
				}
				routeNameRef.current = currentRouteName;
			}}>
			<KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : null} style={{flex: 1}}>
				<MainStack.Navigator
					headerMode={'screen'}
					screenOptions={headerStyle}
					initialRoute={routes.bootstrap}
				>
					<MainStack.Screen
						name={routes.bootstrap}
						component={BootstrapScreen}
						options={{
							animationEnabled: false,
							headerShown: false,
						}}
					/>
					<MainStack.Screen
						name={routes.alias}
						component={AliasScreen}
						options={({route}) => ({
							title: 'Account',
							animationEnabled: !route?.params?.noAnimation,
						})}
					/>
					<MainStack.Screen
						name={routes.login}
						component={LoginScreen}
						options={({navigation, route}) => ({
							title: 'Login',
							headerRight: ({route}) => (
								<NavButton
									onPress={() => navigation.navigate(routes.settings)}
									title="Settings"
								/>
							),
							animationEnabled: !route?.params?.noAnimation,
						})}
					/>
					<MainStack.Screen
						name={routes.kiosk}
						component={KioskScreen}
						options={({route}) => ({
							headerShown: false,
							title: 'Kiosk',
							animationEnabled: !route?.params?.noAnimation,
						})}
					/>
					<MainStack.Screen
						name={routes.settings}
						component={SettingsScreen}
						options={{
							title: 'Settings',
						}}
					/>
					<MainStack.Screen
						name={routes.welcome}
						component={WelcomeScreen}
						options={{
							title: 'Welcome',
							animationEnabled: false,
						}}
					/>
					<MainStack.Screen
						name={routes.permissions}
						component={PermissionsScreen}
						options={{
							title: 'Setup',
						}}
					/>
				</MainStack.Navigator>
			</KeyboardAvoidingView>
			<Loading enabled={showLoading}/>
		</NavigationContainer>
	);
};

export default connect(mapStateToProps)(Router);

