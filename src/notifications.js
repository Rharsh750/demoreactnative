import {Platform} from 'react-native';
import firebase from 'react-native-firebase';

import {actions, store} from './store';

const setToken = (token) => store.dispatch({type: actions.DEVICE_TOKEN_SET_SDK, payload: token});

const pushUrl = (url, notificationId) => {
	const join = url.includes('?') ? '&' : '?';
	store.dispatch({
		type: actions.NOTIFICATION_PUSH_KIOSK_URL,
		payload: url + join + 'notificationId=' + notificationId,
	});
};

const setup = async () => {
	// Get Token if available
	const token = await firebase.messaging().getToken();
	if (token) setToken(token);
	if (__DEV__) console.log('~~~ token', token);

	const channel = new firebase.notifications.Android.Channel('works', 'Mirus Works', firebase.notifications.Android.Importance.Max)
		.setDescription('Shift offers and important notifications.');
	firebase.notifications().android.createChannel(channel);

	// Watch token refresh
	firebase.messaging().onTokenRefresh(setToken);

	// App in Foreground & notification received
	firebase.notifications().onNotification(({notificationId, title, body, data}) => {
		const localNotification = new firebase.notifications.Notification()
			.setNotificationId(notificationId)
			.setTitle(title)
			.setBody(body)
			.setData(data);

		if (Platform.OS === 'android') {
			localNotification.android.setChannelId('works');
			localNotification.android.setSmallIcon('@mipmap/ic_launcher_square');
		}

		firebase.notifications().displayNotification(localNotification)
			.catch((e) => __DEV__ && console.log('~~~ e', e));
	});

	// App in background & notification tapped
	firebase.notifications().onNotificationOpened(({notification}) => {
		try {
			pushUrl(notification.data.kioskUrl, notification.notificationId);
		} catch (e) {
			__DEV__ && console.log('~~~ e onNotificationOpened', e);
		}
	});

	// App closed & notification tapped
	try {
		const initialNotification = await firebase.notifications().getInitialNotification();
		if (initialNotification && initialNotification.notification.data.kioskUrl) {
			pushUrl(initialNotification.notification.data.kioskUrl,
				initialNotification.notification.notificationId);
		}
	} catch (e) {
		if (__DEV__) console.log('~~~ getInitialNotification', e);
	}
};

void setup();
