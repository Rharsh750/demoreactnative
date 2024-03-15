import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {responsive} from '../services/responsive';

import {theme} from '../services/theme';

export const BigButton = ({onSubmit, label, disabled}) => {
	return (<TouchableOpacity
		activeOpacity={disabled ? 1 : 0.75}
		onPress={() => {!disabled && onSubmit()}}
		style={{width: '100%'}}
	>
		<View style={[styles.container, disabled ? {opacity: 0.5} : {}]}>
			<Text style={styles.text}>{label}</Text>
		</View>
	</TouchableOpacity>);
};

const styles = StyleSheet.create({
	container: {
		padding: responsive(8, 9, 10),
		backgroundColor: theme.colors.primaryBlue,
		height: responsive(50, 55, 60),
		alignItems: 'center',
		justifyContent: 'center',
		width: '100%',
	},
	text: {
		color: theme.colors.primaryWhite,
		fontSize: responsive(13, 15, 17),
		fontWeight: 'bold',
	},
});
