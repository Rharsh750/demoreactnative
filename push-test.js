const worksApiPushTest = () => {
	const https = require('https');

	const data = JSON.stringify({
		'people': ['1573'],
		'title': 'Mirus Works! Shift Available',
		'body': 'RNE2 at Burleigh Heads on 07-04-2020 from 07:30 to 15:00. Open the app to Accept or Decline.',
	});

	const options = {
		hostname: 'api.mirus.works',
		port: 443,
		path: '/o/v1/app/notify',
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Content-Length': data.length,
			'authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50Ijp7ImFsaWFzIjoiZGV2In0sInNjb3BlIjoibXc6YXBwOm5vdGlmeSJ9.ZBhrT-cUWXSIK_6srP2FDfCVXhxTX54moXxTHxmpjAY',
		},
	};

	const req = https.request(options, (res) => {
		console.log(`statusCode: ${res.statusCode}`);

		res.on('data', (d) => {
			process.stdout.write(d);
		});
	});

	req.on('error', (error) => {
		console.error(error);
	});

	req.write(data);
	req.end();
};

const firebasePushTest = () => {
	const admin = require('firebase-admin');
	const serviceAccount = require('./.firebase/mirus-works-kiosk-fcbf5541ad7a.json');

	admin.initializeApp({
		credential: admin.credential.cert(serviceAccount),
		databaseURL: 'https://mirus-works-kiosk.firebaseio.com',
	});

	const registrationTokens = [
		'cTTcpw5iIsM:APA91bFPGcIWQqd46hgOJbGl8GLQ7wtkyRBU-WVUKofi2OxqpxZWDie3FfFp9P87HnWW41pp-LyS1G-lDeXQDXoZOHdn-dk2LTm32JJVkysjMHXbnVHAFN3h35O81ZrisW2CibJA8XIg',
		'c3ROGRzpEkE4lj-OFkx5rx:APA91bGKgq24SMKVFxKQl2odwvOcCjZAfuEN1enPiesZSDohLvkAOtvKL2uR9_fPg49RaQ2qf7WhT7wMDbERoQ9uA4W3M-cj0oz247MxTYi_TvIEOttB4PWrBCsYq_i8RX6kA_yFaOku',
	];

	const message = {
		data: {
			kioskUrl: '/#/works/selfservice/shiftoffer',
		},
		notification: {
			title: 'New Shift Offer Availablez!!',
			body: 'RNE2 at Burleigh Heads on 07-04-2020 from 07:30 to 15:00. Open the Kiosk to Accept or Decline.',
		},
		tokens: registrationTokens,
	};

	admin.messaging().sendMulticast(message)
		.then((response) => {
			console.log('Successfully sent message:', response);
		})
		.catch((error) => {
			console.log('Error sending message:', error);
		})
		.finally(() => {
			process.exit();
		});

};

// worksApiPushTest();
firebasePushTest();
