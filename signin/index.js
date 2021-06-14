import Joi from 'joi';

const signin = {
	register: async (server, options) => {
		/* const preResponse = (req, res) => {
			const response = req.response;

			if (!response.isBoom) {
				return res.continue;
			} else {
				const error = response;
				const ctx = {
					title: 'Sign In',
					error: error.output.statusCode === 404 ? 'page not found' : error.message
				};

				console.log(`Context ${JSON.stringify(ctx)}\n`);

				return res.view('auth/signup', ctx).code(error.output.statusCode);
			}
		};

		server.ext('onPreResponse', preResponse); */

		server.route({
			method: 'POST',
			path: '/signin',
			config: {
				auth: 'simple',
				validate: {
					payload: Joi.object({
						email: Joi.string().email().required(),
						password: Joi.string().label('Password ').required()
					}),
					failAction: (req, res, err) => {
						console.log(err);
						// throw err;
						return res.view('auth/signin', { title: 'Sign In', error: err });
					}
				}
			},
			handler: (req, res) => {
				const { email, password } = req.payload;
				console.log(`Signed In with ${email} and ${password}\n`);
				if (req.auth.isAuthenticated) {
					req.cookieAuth.set({
						token: req.auth.credentials.token,
						email: req.auth.credentials.email
					});
					return res.redirect('/user');
				} else {
					return res.redirect('/signin');
				}
			}
		});

		server.route({
			method: 'GET',
			path: '/signin',
			handler: (req, res) => {
				return res.view('auth/signin', { title: 'Sign In' });
			}
		});
	},
	pkg: {
		name: 'signin'
	}
};

export default signin;
