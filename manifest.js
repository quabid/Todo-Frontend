import inert from '@hapi/inert';
import handlebars from 'handlebars';
import Path from 'path';
import home from './home/index.js';
import auth from './auth/index.js';
import signin from './signin/index.js';
import signup from './signup/index.js';
import signout from './signout/index.js';
import user from './user/index.js';

const __dirname = Path.resolve('.');

const manifest = {
	server: {
		port: 3000,
		address: '0.0.0.0',
		routes: {
			files: {
				relativeTo: Path.join(__dirname, 'public')
			}
		}
	},
	register: {
		plugins: [
			{
				plugin: inert
			},
			{
				plugin: '@hapi/vision',
				options: {
					engines: {
						hbs: handlebars
					},
					path: Path.resolve(__dirname, 'views'),
					layout: true,
					layoutPath: 'views/layouts',
					partialsPath: 'views/partials',
					helpersPath: 'views/helpers',
					context: (request) => {
						return {
							credentials: request.auth.credentials
						};
					}
				}
			},
			{
				plugin: auth
			},
			{
				plugin: home
			},
			{
				plugin: signin
			},
			{
				plugin: signup
			},
			{
				plugin: signout
			},
			{
				plugin: user
			}
		]
	}
};

export default manifest;
