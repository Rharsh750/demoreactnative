import React from 'react';
import {StatusBar} from 'react-native';
import {Provider} from 'react-redux';

import './notifications';

import {store} from './store';
import Router from './router';

StatusBar.setBarStyle('light-content');

const App = () => {
	return (
		<Provider store={store}>
			<Router />
		</Provider>
	);
};

export default App;
