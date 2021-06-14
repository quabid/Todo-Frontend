import Joi from 'joi';
import Axios from 'axios';

const user = {
	register: async (server, options) => {
		server.route({
			method: 'GET',
			path: '/user',
			config: {
				auth: 'session'
			},
			handler: (req, res) => {
				return Axios({
					method: 'get',
					url: 'http://192.168.1.71:4000/api/todos/',
					headers: {
						Authorization: `Bearer ${req.auth.credentials.token}`
					}
				})
					.then((data) => {
						console.log(data);
						return res.view('user/dashboard', {
							title: 'Dashboard',
							records: data.data.records.docs
						});
					})
					.catch((err) => {
						console.log(err);
						return res.view('user/dashboard', { title: 'Dashboard' });
					});
			}
		});
	},
	pkg: {
		name: 'user'
	}
};

export default user;
