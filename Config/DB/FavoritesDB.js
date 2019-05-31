/**
 * Configure, create Schema and modules for Info document in ....
 */
import { AsyncStorage } from 'react-native';
const naming = 'FavoritesDB';
class FavoritesDB {
  Get() {
    // this should return all the data in ArtistsDB.
    return new Promise((resolve, reject) => {
      AsyncStorage.getItem(naming).then(
        success => {
          return resolve(JSON.parse(success));
        },
        err => {
          return reject({
            error: 'Error while fetching the favorites data from the DB'
          });
        }
      );
    });
  }
  Set(InfoContent) {
    // set / Replace the InfoContent.
    return new Promise((resolve, reject) => {
      AsyncStorage.setItem(naming, JSON.stringify(InfoContent)).then(
        success => {
          return resolve({ success: true });
        },
        err => {
          return reject({
            error: 'Error while Save the favorites data from the DB'
          });
        }
      );
    });
  }
}

module.exports = new FavoritesDB();
