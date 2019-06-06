import { Permissions, Notifications } from 'expo';
import { FavoritesDB } from '../Config/DB';
import moment from 'moment';

export async function registerForPushNotificationsAsync() {
	const { status: existingStatus } = await Permissions.getAsync(
		Permissions.NOTIFICATIONS
	);
	let finalStatus = existingStatus;
	if (existingStatus !== 'granted') {
		const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
		finalStatus = status;
	}

	if (finalStatus !== 'granted') {
		console.log('GRANTED?', finalStatus);
		return;
	}
}
// moment().valueOf() + 10000
function scheduleNotification(title, body, time) {
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
		}
	);
}

function setNotificationTime(artist) {
	let day = artist.artist_session.session_day;
	let time;
	let timeSplit = artist.artist_session.session_start_time.split(':');
	if (day === 'day1') {
		time = moment().set({
			year: 2019,
			month: 5,
			date: 13,
			hour: Number(timeSplit[0]),
			minute: Number(timeSplit[1]),
			seconds: 0
		});
	} else if (day === 'day2') {
		time = moment().set({
			year: 2019,
			month: 5,
			date: 14,
			hour: Number(timeSplit[0]),
			minute: Number(timeSplit[1]),
			seconds: 0
		});
	} else if (day === 'day3') {
		time = moment().set({
			year: 2019,
			month: 5,
			date: 15,
			hour: Number(timeSplit[0]),
			minute: Number(timeSplit[1]),
			seconds: 0
		});
	}
	if (time.hours() < 12) time.add(1, 'days');
	time.subtract(10, 'minutes');
	return time;
}

export function scheduleFavoritesNotifications() {
	Notifications.cancelAllScheduledNotificationsAsync();
	FavoritesDB.Get().then(artists => {
		if (artists) {
			artists.forEach((artist, index) => {
				if (artist && artist.artist_session) {
					let time = setNotificationTime(artist);
					let text = `${artist.artist_name} plays on the ${
						artist.artist_session.session_stage
					} in 10 minutes.`;
					console.log('SANDBOX Festival', text, time);
					if (moment().isBefore(time)) {
						scheduleNotification('SANDBOX Festival', text, time.valueOf());
					}
				}
			});
		}
	});
}
