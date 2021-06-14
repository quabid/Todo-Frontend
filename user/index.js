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

		server.route({
			method: 'POST',
			path: '/todos/add',
			config: {
				auth: 'session',
				validate: {
					payload: Joi.object({
						title: Joi.string().required(),
						body: Joi.string().required(),
						startdate: Joi.any().allow(''),
						enddate: Joi.any().allow('')
					}),
					failAction: (req, res, err) => {
						console.log(err.message);
						return res.view('user/dashboard', { title: 'Dashboard', error: err.message });
					}
				}
			},
			handler: (req, res) => {
				const payload = req.payload;
				return Axios({
					method: 'post',
					url: 'http://192.168.1.71:4000/api/todos/add',
					data: {
						payload
					},
					headers: {
						Authorization: `Bearer ${req.auth.credentials.token}`
					}
				})
					.then((data) => {
						console.log(data.data);
						return res.redirect('/user');
					})
					.catch((err) => {
						console.log(err);
						return res.redirect('/user');
					});
			}
		});

		server.route({
			method: 'POST',
			path: '/todos/remove',
			config: {
				auth: 'session',
				validate: {
					payload: Joi.object({
						title: Joi.string().required(),
						body: Joi.string().required(),
						startdate: Joi.any().allow(''),
						enddate: Joi.any().allow(''),
						_id: Joi.any().required(),
						_rev: Joi.any().required()
					}),
					failAction: (req, res, err) => {
						console.log(err.message);
						return res.view('user/dashboard', { title: 'Dashboard', error: err.message });
					}
				}
			},
			handler: (req, res) => {
				const { title, body, _id, _rev } = req.payload;
				const data = {
					title: title,
					body: body,
					id: _id,
					rev: _rev
				};

				if (req.payload.startdate) {
					data.startdate = req.payload.startdate;
				}

				if (req.payload.enddate) {
					data.enddate = req.payload.enddate;
				}

				return res.redirect('/user');
			}
		});
	},
	pkg: {
		name: 'user'
	}
};

export default user;
