import {Dimensions} from 'react-native';

const screenWidth = Dimensions.get('window').width;

const smallDevice = screenWidth <= 320;
const mediumDevice = screenWidth > 320 && screenWidth <= 375;
const largeDevice = screenWidth > 375;

export const responsive = (s = 1, m = s, l = m) => {
	return smallDevice ? s : mediumDevice ? m : largeDevice ? l : m;
};

export const isDevice = (...sizes) => {
	let flag = false;
	sizes.forEach((size) => {
		switch (size) {
			case 's':
				smallDevice ? flag = true : null; break;
			case 'm':
				mediumDevice ? flag = true : null; break;
			case 'l':
				largeDevice ? flag = true : null; break;
			default:
				if (__DEV__) console.error('~~~ isDevice error', size);
				break;
		}
	});
	return flag;
};

export const deviceUpToSmall = isDevice('s');
export const deviceUpToMedium = isDevice('m');
export const deviceUpToLarge = isDevice('l');
