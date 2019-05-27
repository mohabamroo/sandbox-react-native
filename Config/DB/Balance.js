/**
 * Configure, create Schema and modules for Info document in ....
 */
import { AsyncStorage } from 'react-native';
const naming = 'Balance';
class BalanceDB {
	Get() {
		// this should return all the data in BalanceDB.
		return new Promise((resolve, reject) => {
			AsyncStorage.getItem(naming).then(success => {
				return resolve(JSON.parse(success));
			}, err => {
				return reject({ error: "Error while fetching the info data from the DB" });
			})
		})
	}
	Set(InfoContent) {
		// set / Replace the InfoContent.
		return new Promise((resolve, reject) => {
			AsyncStorage.setItem(naming, JSON.stringify(InfoContent)).then(success => {
				return resolve({ success: true });
			}, err => {
				return reject({ error: "Error while Save the info data from the DB" });
			})
		})
	}
	GetLastUpdate() {
		// should get the last update key.
		return new Promise((resolve, reject) => {
			AsyncStorage.getItem(naming + 'LastUpdate').then(success => {
				return resolve(success);
			}, err => {
				return reject({ error: "Error while fetching the info data from the DB" });
			})
		})
	}
	SetLastUpdate(lastUpdate) {
		// set / Replace the InfoContent.
		return new Promise((resolve, reject) => {
			AsyncStorage.setItem(naming + 'LastUpdate', lastUpdate).then(success => {
				return resolve({ success: true });
			}, err => {
				return reject({ error: "Error while Save the info data from the DB" });
			})
		})
	}
}

module.exports = new BalanceDB();