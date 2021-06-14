import axios from 'axios';

export const validate = async (req, email, password, res) => {
	return axios({
		url: 'http://192.168.1.71:4000/auth/signin',
		method: 'post',
		data: {
			email: email,
			password: password
		}
	})
		.then((response) => {
			console.log(`Response Status:\t${response.status}`);
			switch (response.status.toString()) {
				case '200':
					console.log(`\n\tResponse Data: ${JSON.stringify(response.data)}\n`);
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
