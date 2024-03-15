import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

import {theme} from '../services/theme';

export const ErrorMessage = ({message}) => {
	return (<View style={styles.container}>
		<Text style={theme.text}>{message}</Text>
	</View>);
};

const styles = StyleSheet.create({
	container: {
		width: 280,
		marginBottom: 20,
		backgroundColor: 'hsla(1, 86%, 41%, 1)',
		borderRadius: 5,
		padding: 10,
	},
});
