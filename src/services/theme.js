import {responsive} from './responsive';

export const theme = {
	colors: {
		primaryBlue: '#1a86cf',
		primaryNavy: 'hsla(208, 100%, 20%, 1)',
		primaryWhite: '#fff',
		backgroundGrey: 'hsla(0, 0%, 95%, 1)',
	},
	text: {
		color: '#fff',
		fontSize: responsive(14, 16, 18),
	},
	textBlack: {
		color: '#000',
	},
	textLink: {
		fontWeight: 'bold',
		textDecorationLine: 'underline',
	},
	margins: {
		paragraph: responsive(12, 14, 16),
		commonRow: responsive(20, 25, 30),
		commonRowKeyboard: responsive(10, 12, 15),
		commonGap: responsive(30, 50, 60),
		commonGapKeyboard: responsive(15, 25, 30),
	},
	debug: {
		borderWidth: 1,
		borderColor: 'red',
	},
	generalWrapper: {
		flex: 1,
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	formContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		paddingBottom: responsive(40, 50, 60),
	},
	commonContainer: {
		width: responsive(280, 300, 320),
	},
	center: {
		alignItems: 'center',
	},
	last: {
		marginBottom: 0,
	}
};

export const headerStyle = {
	headerStyle: {
		backgroundColor: theme.colors.primaryNavy,
		elevation: 0,
		shadowOpacity: 0,
		borderBottomWidth: 0,
	},
	headerTintColor: theme.colors.primaryWhite,
};

