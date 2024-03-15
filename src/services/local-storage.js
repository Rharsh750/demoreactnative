import AsyncStorage from '@react-native-community/async-storage';

export const keys = {
	ACCOUNT_ALIAS: 'ACCOUNT_ALIAS', // string
	ACCOUNT_STRATEGY: 'ACCOUNT_STRATEGY', // string
	USER_USERNAME: 'USER_USERNAME', // string
	USER_PASSWORD: 'USER_PASSWORD', // string
	DEVICE_TOKEN: 'DEVICE_TOKEN', // string
	ONBOARDING_COMPLETED: 'ONBOARDING_COMPLETED', // bool
};

export const set = async (key, value) => {
	try {
		return await AsyncStorage.setItem(key, JSON.stringify(value));
	} catch (e) {
		if (__DEV__) console.error('set failed', e);
		return null;
	}
};

export const get = async (key) => {
	try {
		const value = await AsyncStorage.getItem(key);
		return JSON.parse(value);
	} catch (e) {
		if (__DEV__) console.error('get failed', e);
		return null;
	}
};

export const remove = async (key) => {
	try {
		await AsyncStorage.removeItem(key);
	} catch (e) {
		if (__DEV__) console.error('removeItem failed', e);
		return null;
	}
};
