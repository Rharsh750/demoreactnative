import React from 'react';
import {Image} from 'react-native';

import {responsive} from '../services/responsive';
const worksLogo = require('../assets/mirus-works-logo.png');

export const MirusLogo = () => {
	return (<Image source={worksLogo} style={{height: responsive(40, 50, 60)}} resizeMode={'contain'}/>);
};
