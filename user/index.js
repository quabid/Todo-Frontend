import Joi from 'joi';
import Axios from 'axios';
import dayjs from 'dayjs';
import { removeTodo, addTodo } from '../custom_modules/index.js';

const user = {
	register: async (server, options) => {
		server.route({
			method: 'GET',
			path: '/user',
			config: {
				auth: 'session'
			},
			handler: (req, res) => {
				console.log(`\n\t\tGet Todos with User Id: ${JSON.stringify(req.auth.credentials)}\n\n`);

				return Axios({
					method: 'get',
					url: `http://192.168.1.71:4000/api/todos/${req.auth.credentials.userId}`,
					headers: {
						Authorization: `Bearer ${req.auth.credentials.token}`
					}
				})
					.then((todos) => {
						// console.log(data.data.records.docs);
						return Axios({
							method: 'get',
							url: `http://192.168.1.71:4000/user/profile/${req.auth.credentials.token}`,
							headers: {
								Authorization: `Bearer ${req.auth.credentials.token}`
							}
						})
							.then((profile) => {
								console.log(`\n\tProfile data: ${JSON.stringify(profile.data)}\n`);
								const payload = profile.data.payload;
								req.auth.credentials.profile = payload;

								return res.view('user/dashboard', {
									title: 'Dashboard',
									records: todos.data.records.docs,
									profile: profile.data.payload
								});
							})
							.catch((err) => {
								console.log(err);
								return res.view('user/dashboard', { title: 'Dashboard', error: err });
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
			path: '/user/settings',
			config: {
				auth: 'session',
				validate: {
					payload: Joi.object({
						fname: Joi.string().allow(''),
						lname: Joi.string().allow(''),
						email: Joi.string().email().required()
					}),
					failAction: (req, res, err) => {
						console.log(err.message);
						throw err;
					}
				}
			},
			handler: (req, res) => {
				const payload = req.payload;
				console.log(`\n\tProfile Update Data: ${JSON.stringify(payload)}\n`);

				return Axios({
					method: 'post',
					url: 'http://192.168.1.71:4000/user/profile/update',
					data: {
						payload
					},
					headers: {
						Authorization: `Bearer ${req.auth.credentials.token}`
					}
				})
					.then((data) => {
						console.log(`\n\tResponse from updating user's profile: ${JSON.stringify(data.data)}\n`);
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
			path: '/todos/add',
			config: {
				auth: 'session',
				validate: {
					payload: Joi.object({
						title: Joi.string().required(),
						body: Joi.string().required(),
						startdate: Joi.date().allow('').max(Joi.ref('enddate')),
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

				if (payload.startdate && payload.enddate) {
					payload.startdate = dayjs(payload.startdate).format('MM/DD/YYYY');
					payload.enddate = dayjs(payload.enddate).format('MM/DD/YYYY');
				}

				return addTodo(payload, req.auth.credentials.token)
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
