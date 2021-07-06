import axios from 'axios';

export const validate = async (req, email, password, res) => {
	console.log(`\n\t\tSigning in with ${email} and ${password}\n\n`);

	return axios({
		url: 'http://192.168.1.71:4000/auth/signin',
		method: 'post',
		data: {
			email: email,
			password: password
		}
	})
		.then((response) => {
			console.log(`\n\t\tSign In Successful\n\t\tResponse Status:\t${response.status}\n\n`);

			switch (response.status.toString()) {
				case '200':
					console.log(`\n\t\tSign In Response Data: ${JSON.stringify(response.data)}\n\n`);

					if (response.data.status) {
						return { isValid: false };
					} else {
						return {
							isValid: true,
							credentials: response.data
						};
					}
				default:
					return {
						isValid: false,
						credentials: null
					};
			}
		})
		.catch((err) => {
			return {
				isValid: false,
				credentials: null
			};
		});
};
