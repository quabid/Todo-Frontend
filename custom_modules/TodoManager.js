import Axios from 'axios';

export const removeTodo = async (tid, rev, token) => {
	return Axios({
		url: 'http://192.168.1.71:4000/api/todos/remove',
		method: 'post',
		data: {
			tid: tid,
			rev: rev
		},
		headers: {
			Authorization: `Bearer ${token}`
		}
	});
};
