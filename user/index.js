import Joi from 'joi';
import Axios from 'axios';
import { removeTodo } from '../custom_modules/index.js';

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
						// console.log(data.data.records.docs);
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
						startdate: Joi.date().max(Joi.ref('enddate')).allow(''),
						enddate: Joi.date().allow('')
					}),
					failAction: (req, res, err) => {
						console.log(err.message);
						throw err;
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
						// console.log(data.data);
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
				auth: 'session'
			},
			handler: (req, res) => {
				const { _id, _rev } = req.payload;
				const token = req.auth.credentials.token;
				console.log(`Remove ID: ${_id} and Revision: ${_rev} Token: ${token}\n`);
				return removeTodo(_id, _rev, token)
					.then((data) => {
						console.log(data);
						return res.redirect('/user');
					})
					.catch((err) => {
						console.log(err);
						return res.redirect('/user');
					});
			}
		});
	},
	pkg: {
		name: 'user'
	}
};

export default user;
