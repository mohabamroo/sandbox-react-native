module.exports = {
	info: "https://sandboxfestival.com/wp-json/sandbox/get/info",
	General: "https://sandboxfestival.com/wp-json/sandbox/get/general",
	Media: "https://sandboxfestival.com/wp-json/sandbox/get/media",
	registerEmail: "https://www.qube.world/home/get_tickets_by_email",
	updatePicture: "https://www.qube.world/home/add_picture",
	token: "2269E69D7AC26336",
	Discover: "https://sandboxfestival.com/wp-json/sandbox/get/map_places",
	registerUserServerA: "https://sandboxfestival.com/wp-json/sandbox/users/register/",
	balance: "https://www.qube.world/home/get_transactions",
	likeArtist: "https://sandboxfestival.com/wp-json/sandbox/users/add_favorite_artist/",
	removeArtistLike: "https://sandboxfestival.com/wp-json/sandbox/users/remove_favorite_artist/",
	baseURL: "https://sandboxfestival.com",
	getUser: (id) => { 
		return `https://sandboxfestival.com/wp-json/sandbox/users/get_user_data/${id}`
	},
	getNews: (lastDate) => { 
		if (lastDate) {
			return `https://sandboxfestival.com/wp-json/sandbox/get/news/${lastDate}`
		} else { 
			return "https://sandboxfestival.com/wp-json/sandbox/get/news/null"
		} 

	},
	getSchedual: (lastDate) => { 
		if (lastDate) {
			return `https://sandboxfestival.com/wp-json/sandbox/get/home_schedule/${lastDate}`
		} else { 
			return "https://sandboxfestival.com/wp-json/sandbox/get/home_schedule/null";
		}
	},
	getArtists: (lastDate) => { 
		if (lastDate) {
			return `https://sandboxfestival.com/wp-json/sandbox/get/v2/artists/${lastDate}`
		} else { 
			return "https://sandboxfestival.com/wp-json/sandbox/get/v2/artists/null"
		}
	},
}