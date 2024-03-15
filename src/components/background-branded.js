import React from 'react';
import {ImageBackground} from 'react-native';

import {theme} from '../services/theme';
const backgroundImage = require('../assets/couple-background.jpg');

export const BackgroundBranded = ({children}) => {
	return (
		<ImageBackground source={backgroundImage} style={{
			width: '100%',
			height: '100%',
			backgroundColor: theme.colors.primaryNavy,
		}}>
			{children}
		</ImageBackground>
	);
};
