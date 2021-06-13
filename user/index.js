const user = {
	register: async (server, options) => {
		server.route({
			method: 'GET',
			path: '/user',
			config: {
				auth: 'session'
			},
			handler: (req, res) => {
				return res.view('user/dashboard', { title: 'Dashboard' });
			}
		});
	},
	pkg: {
		name: 'user'
	}
};

export default user;
