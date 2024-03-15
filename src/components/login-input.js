import React from 'react';
import {StyleSheet, TextInput, View, Text} from 'react-native';

import {theme} from '../services/theme';
import {responsive} from '../services/responsive';

export const LoginInput = ({
	isPassword,
	keyboard,
	maxLength,
	onBlur,
	onChange,
	onFocus,
	onSubmit,
	overlayText,
	placeholder,
	returnKey,
	type,
	value,
	noBottomMargin,
}) => {
	return <View style={[styles.container, noBottomMargin ? {marginBottom: 0} : {}]}>
		{overlayText && <View style={styles.overlayContainer}>
			<Text style={styles.overlay}>{overlayText}</Text>
		</View>}
		<TextInput
			autoCapitalize={'none'}
			autoCompleteType={type}
			autoCorrect={false}
			keyboardType={keyboard}
			maxLength={maxLength}
			onBlur={onBlur}
			onChangeText={onChange}
			onFocus={onFocus}
			onSubmitEditing={onSubmit}
			placeholder={placeholder}
			placeholderTextColor={'#cacccd'}
			returnKeyType={returnKey}
			secureTextEntry={isPassword}
			style={styles.input}
			value={value}
		/>
	</View>;
};

const styles = StyleSheet.create({
	container: {
		backgroundColor: 'rgba(255, 255, 255, 0.3)',
		marginBottom: theme.margins.commonRow,
		borderWidth: 0,
		borderRadius: 6,
	},
	input: {
		width: 300,
		height: responsive(45, 48, 52),
		paddingHorizontal: 15,
		...theme.text,
	},
	overlayContainer: {
		position: 'absolute',
		right: 0,
		top: 0,
		height: '100%',
		flex: 1,
		justifyContent: 'center',
		paddingRight: 15,
	},
	overlay: {
		...theme.text,
		opacity: 0.75,
	}
});
