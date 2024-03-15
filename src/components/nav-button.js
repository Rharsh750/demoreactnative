import React from 'react';
import {TouchableOpacity, Text, View} from 'react-native';

export const NavButton = ({title, onPress}) => {
	return (
		<TouchableOpacity onPress={onPress} activeOpacity={0.75}>
			<View style={{padding: 5, marginHorizontal: 10}}>
				<Text style={{color: '#fff', fontSize: 16}}>{title}</Text>
			</View>
		</TouchableOpacity>
	)
};
