import Joi from 'joi';
import { register } from '../custom_modules/index.js';

const signup = {
	register: async (server, options) => {
		server.route({
			method: 'POST',
			path: '/signup',
			config: {
				validate: {
					payload: Joi.object({
						email: Joi.string().email().required(),
						pwd1: Joi.string().min(6).label('Password ').required(),
						pwd2: Joi.string().valid(Joi.ref('pwd1')).label("Passwords don't match").required()
					}),
					failAction: (req, res, err) => {
						console.log(err);
						throw err;
					}
				}
			},
			handler: (req, res) => {
				const { email, pwd1 } = req.payload;
				return register(email, pwd1)
					.then((data) => {
						console.log(`\n\t\tSign Up Response: ${JSON.stringify(data.data)}`);
						return res.redirect('/signin');
					})
					.catch((err) => {
						console.log(`\n\t\tSign Up Error: ${err}`);
						return res.redirect('/signup');
					});
			}
		});

		server.route({
			method: 'GET',
			path: '/signup',
			handler: (req, res) => {
				return res.view('auth/signup', { title: 'Sign Up' });
			}
		});
	},
	pkg: {
		name: 'signup'
	}
};

export default signup;
