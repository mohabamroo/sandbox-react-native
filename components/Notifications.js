import React from 'react';
import { Permissions, Notifications } from 'expo';
import moment from 'moment';


export async function registerForPushNotificationsAsync() {
	const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
	let finalStatus = existingStatus;
	if (existingStatus !== 'granted') {
		const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
		finalStatus = status;
	}

	if (finalStatus !== 'granted') {
		console.log('GRANTED?', finalStatus)
		return;
	}
}
// moment().valueOf() + 10000
export async function scheduleNotification(title, body, time) {
  let notificationId = Notifications.scheduleLocalNotificationAsync(
    {
      title,
      body,
			ios: {
				sound: true
			}
    },
    {
      time
    },
  );
};
