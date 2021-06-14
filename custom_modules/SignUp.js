import axios from 'axios';

export const register = async (email, password) => {
	let obj = { isValid: false, credentials: null };
	return axios({
		url: 'http://192.168.1.71:4000/auth/register',
		method: 'post',
		data: {
			email,
			password,
			type: 'user'
		}
	});
};
