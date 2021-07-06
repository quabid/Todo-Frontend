import Axios from 'axios';

const signout = {
	register: async (server, options) => {
		server.route({
			method: 'GET',
			path: '/signout',
			config: {
				auth: 'session'
			},
			handler: (req, res) => {
				console.log(`\n\t\tSigning Out Credentials: ${JSON.stringify(req.auth.credentials)}\n\n`);

				return Axios({
					method: 'get',
					url: `http://192.168.1.71:4000/user/signout/${req.auth.credentials.token}`,
					headers: {
						Authorization: `Bearer ${req.auth.credentials.token}`
					}
				})
					.then((response) => {
						console.log(`\n\t\tSignout Response: ${JSON.stringify(response.data)}\n\n`);

						req.cookieAuth.clear();
						return res.redirect('/signin');
					})
					.catch((err) => {
						console.log(`\n\t\tSign out error: ${err}\n\n`);
						return res.redirect('/signin');
					});
			}
		});
	},
	pkg: {
		name: 'signout'
	}
};

export default signout;
