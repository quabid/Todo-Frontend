import Moment from 'moment';

module.exports = function(context) {
	const format = [ 'apple', 'banana', 'pineapple', 'kiwi', 'mango', 'passion fruit' ];

	if (isNaN(context.data.root.query.fruitNumber)) {
		return format[Math.floor(Math.random() * format.length)];
	} else {
		return format[context.data.root.query.fruitNumber % format.length];
	}
};
