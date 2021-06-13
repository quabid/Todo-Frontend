const signout = {
	register: async (server, options) => {
		server.route({
			method: 'GET',
			path: '/signout',
			config: {
				auth: 'session'
			},
			handler: (request, res) => {
				request.cookieAuth.clear();
				return res.redirect('/signin');
			}
		});
	},
	pkg: {
		name: 'signout'
	}
};

export default signout;
