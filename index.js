'use strict';

import Hapi from '@hapi/hapi';
import Glue from '@hapi/glue';
import Path from 'path';
import manifest from './manifest.js';

const __dirname = Path.resolve('.');
const options = {
	relativeTo: __dirname
};

const init = async () => {
	try {
		const server = await Glue.compose(manifest, options);
		await server.start();
		console.clear();
		console.log('\n\t\tServer running on %s\n\n', server.info.uri);
	} catch (err) {
		console.log(err);
		process.exit(1);
	}
};

/* process.on('unhandledRejection', (err) => {
	console.log(err);
	process.exit(1);
}); */

init();
