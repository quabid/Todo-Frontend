import Joi from 'joi';

const signin = {
	register: async (server, options) => {
		const preResponse = (req, res) => {
			const response = req.response;

			if (!response.isBoom) {
				return res.continue;
			}

			const error = response;
			const ctx = {
				title: 'Sign Up',
				error: error.output.statusCode === 404 ? 'page not found' : error.message
			};

			return res.view('auth/signin', ctx).code(error.output.statusCode);
		};

		server.ext('onPreResponse', preResponse);

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
						console.log(err.details.message);
						return err;
					}
				}
			},
			handler: (req, res) => {
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
