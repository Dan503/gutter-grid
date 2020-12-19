//these functions make it easier to convert the php code into javascript
//also they are easier shortcuts to simple functionality

function is_string(string) {
	return typeof string === 'string';
}

function is_int(int) {
	return typeof int === 'number';
}

function is_numeric(n) {
	return !isNaN(parseFloat(n)) && isFinite(n);
}

function is_array(array) {
	return Array.isArray(array);
}

function in_array(value, array) {
	return array.indexOf(value) >= 0;
}

function is_object(object) {
	return typeof object === 'object' && !Array.isArray(object);
}

function isset(variable) {
	return typeof variable !== 'undefined';
}

function end(array) {
	return array[array.length - 1];
}

export {
	is_string,
	is_int,
	is_numeric,
	is_array,
	in_array,
	is_object,
	isset,
	end,
};
