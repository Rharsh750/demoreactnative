import React from 'react';
import {ActivityIndicator, StyleSheet, View} from 'react-native';

export const Loading = ({enabled}) => {
	return enabled ? (
		<View style={styles.container}>
			<View style={styles.loadingView}>
				<ActivityIndicator size={'large'} color={'#fff'}/>
			</View>
		</View>
	) : null;
};

const styles = StyleSheet.create({
	container: {
		position: 'absolute',
		height: '100%',
		width: '100%',
		zIndex: 10000,
		backgroundColor: 'hsla(0, 0%, 0%, 0)',
	},
	loadingView: {
		width: '100%',
		height: '100%',
		flex: 1,
		justifyContent: 'center',
		backgroundColor: 'hsla(0, 100%, 0%, 0.25)',
	},
});
