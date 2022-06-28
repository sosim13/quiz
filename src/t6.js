import React, { useRef } from 'react';
import firebase from './FireBase';
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { onBackgroundMessage } from "firebase/messaging/sw";
import request from 'request';

function App() {

	const axios = require('axios')

	function asFcmRequest(options) {
	  const request = {
		url: 'https://fcm.googleapis.com/fcm/send',
		headers: {
		  Authorization: 'key=AAAAMjvVL9Y:APA91bFmhTC4IJ32zy4XyPASEqjeYZXxM2ZsgFBtTWr7P7YgyKOshNsDDQgZOhSLpAwYfyErvEW9skRiiWAHGW1I5YWJsyWAOw1oNbZfi1Gt6xT8pn61Z-oZpZR3qJiQiEZhNkTmm8IG',
		  'Content-Type': 'application/json'
		},
		method: 'post',
		data: options
	  }
	  return axios(request)
	}

  const messaging = getMessaging();


	onMessage(messaging, (payload) => {
	  alert('Message received. ', payload);
	  // ...
	});

	//허가를 요청합니다!
	getToken(messaging, { vapidKey: 'BHS7eLgwaepndxSfK4hzz0ctTX-6mbkMWhFwplpDeQgCg1pQ6Ic-hC4-Q1yXbEi0ur50W_ZFQFFzJg6XeG4vSVs' }).then((currentToken) => {

	  if (currentToken) {
		// Send the token to your server and update the UI if necessary
		// ...
	    console.log('currentToken : ', currentToken);

	  } else {
		// Show permission request UI
		console.log('No registration token available. Request permission to generate one.');
		// ...
	  }
	}).catch((err) => {
	  console.log('Error : ', err);
	  // ...
	});

	const push = (title, msg) => {

		const option = {


				'to': 'c1pwWw2mqkM:APA91bEBhzRcYHlfurqIC8noWjCE1yqkMRApmcCPwYINREkwsbNV1tI3Fc4M4-YfFMq2lSRw7XYlU1ElrsO0ZIj0I--u_RpuyWSDsx7pExRqNwjkZliys39zajhmEU9SDduS7pJKpDfA',
				'notification': {
					'title': title,
					'body': msg,
					'click_action': '', //이 부분에 원하는 url을 넣습니다.
				}
		}

		asFcmRequest(option);
	}

  return (
    <>
      <input type="text" value="Text Copy" id="cop" ></input>
      <button onClick={() => push('제목이다','나는 호랑이다 어흥.')}>copy</button>
    </>
  );
}

export default App;