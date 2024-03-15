import React from 'react';
import {Linking, SafeAreaView, StyleSheet, Text, View} from 'react-native';
import {connect} from 'react-redux';

import {BackgroundBranded} from '../components/background-branded';
import {BigButton} from '../components/big-button';
import {MirusLogo} from '../components/mirus-logo';
import {routes} from '../services/routes';
import {theme} from '../services/theme';
import {actions} from '../store';

const mapStateToProps = () => ({});

const mapDispatchToProps = {
	toggleLoading: (show) => ({type: actions.SHOW_LOADING_OVERLAY, payload: show}),
};

const WelcomeScreen = ({navigation, toggleLoading}) => {
	React.useEffect(() => {
		toggleLoading(false);
	});

	const handleNext = () => {
		navigation.navigate(routes.permissions);
	};

	return (
		<BackgroundBranded>
			<SafeAreaView style={theme.generalWrapper}>
				<View style={[theme.formContainer, theme.commonContainer]}>
					<View style={styles.logo}>
						<MirusLogo/>
					</View>
					<View>
						<View style={styles.introText}>
							<Text style={[theme.text, styles.paragraph]}>Welcome to Mirus Works!</Text>
							<Text style={[theme.text, styles.paragraph]}>Improve care with the right people, in the right place, at the right time using Mirus Works!</Text>
							<Text style={[theme.text, theme.textLink, styles.paragraph]}
								onPress={() => Linking.openURL('https://www.mirusaustralia.com/mirus-works/')}>
								Learn More.
							</Text>
						</View>
					</View>
				</View>
				<View style={{width: '100%', alignItems: 'center'}}>
					<View style={[theme.commonContainer, theme.center]}>
						<View style={styles.introText}>
							<Text style={[theme.text]}>Already a Mirus Works user?</Text>
						</View>
					</View>
					<BigButton
						onSubmit={handleNext}
						label={'Get Started'}
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
	paragraph: {
		marginBottom: theme.margins.paragraph,
	},
});

export default connect(mapStateToProps, mapDispatchToProps)(WelcomeScreen);
