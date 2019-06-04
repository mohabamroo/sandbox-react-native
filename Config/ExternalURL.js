module.exports = {
  info: 'https://sandboxfestival.com/wp-json/sandbox/get/info',
  General: 'https://sandboxfestival.com/wp-json/sandbox/get/general',
  Media: 'https://sandboxfestival.com/wp-json/sandbox/get/media',
  registerEmail: 'https://www.qube.world/home/get_tickets_by_email',
  updatePicture: 'https://www.qube.world/home/add_picture',
  token: '2269E69D7AC26336',
  Discover: 'https://sandboxfestival.com/wp-json/sandbox/get/map_places',
  registerUserServerA:
    'https://sandboxfestival.com/wp-json/sandbox/users/register/',
  balance: 'https://www.qube.world/home/get_transactions',
  likeArtist:
    'https://sandboxfestival.com/wp-json/sandbox/users/add_favorite_artist/',
  removeArtistLike:
    'https://sandboxfestival.com/wp-json/sandbox/users/remove_favorite_artist/',
  baseURL: 'https://sandboxfestival.com',
  scheduleURL:
    'https://sandboxfestival.com/wp-json/sandbox/get/v3/home_schedule/1',
  getUser: id => {
    return `https://sandboxfestival.com/wp-json/sandbox/users/get_user_data/${id}`;
  },
  getNews: lastDate => {
    if (lastDate) {
      return `https://sandboxfestival.com/wp-json/sandbox/get/news/${lastDate}`;
    } else {
      return 'https://sandboxfestival.com/wp-json/sandbox/get/news/null';
    }
  },
  getSchedual: lastDate => {
    if (lastDate) {
      return `https://sandboxfestival.com/wp-json/sandbox/get/v2/home_schedule/${lastDate}`;
    } else {
      return 'https://sandboxfestival.com/wp-json/sandbox/get/v2/home_schedule/null';
    }
  },
  getArtists: lastDate => {
    if (lastDate) {
      return `https://sandboxfestival.com/wp-json/sandbox/get/v2/artists/${lastDate}`;
    } else {
      return 'https://sandboxfestival.com/wp-json/sandbox/get/v2/artists/null';
    }
  },
  getFavorites: userID => {
    return `http://sandboxfestival.com/wp-json/sandbox/users/get_favorite_artists/${userID}`;
  },
  getBalance: qrCode => {
    const access_token =
      '074c9acdf1dba2946c8baac1d2b6a52fee9bfec01c7c494d970319695d7ea332b3ec5f7682dc5c240afde86bdbbc79172396103e6680b8344a0a6c8327eb8016ecb83590da8dbabca9c83f35160133fc3a6eb4040b4f23aad97beb5ecc4b5d850e01dcd3584ef7cc13ca9907768296e110a67c5d96e7e7b429e5fb937691a8d0cc3510e74d677b942f898a440ad7c653df8b27181773427d05ab4b7145b2a4954e52354c6de31d1f9cfb16ce02e609ddec1b34127345d32fd513aa957e3e00978a2e783c5c1ee70d3d88757fba735fadf4e96f0f3ea2e9ab52a4efc7de05835f35164178db85e6a6b2938ce2994e679024bf3d1bcd2ea5497b3aa97e2070c364e3248f5f36ac8b58cabd0b2f01a2cd9b533f63f724e6c0ce588a012c2227e68a31d33a67db9d2c32c9b47f56bd1da09d129fc11b3e04bb0bc1c03b711f1cf55fac335b2b54560ba3ad5be2260fee97a14fc2844e38211c4dee8baebb608cc089a4256407a251747fe633c4a9e88c9430310247cd47d0ecbd652e61e6b119c8bbc1c1165c2bedd5030dd8cd9998074feb9c236f9388ff6a58c96a958c313cb289849be39d51d8adf68b4ed36a1a96796b570cb921aadf1fd82569554c27eae2039c37403477facf08d6e0734fa2023ebafc683ec7cfd8b3d78451923125dc3c03cdd599d7f9100d54d51f5e7c5b492c59db150a12880187547b51e80861e48f23';
    return `http://142.93.161.0:3000/api/users/${qrCode}?access_token=${access_token}`;
  }
};
