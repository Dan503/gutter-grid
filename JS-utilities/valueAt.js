
//this is a getter/setter method depending on if "newValue" has been set

//valueAt([1,2,3], 1) = 2;
//valueAt([1,2,3], 1, 4) = [1,4,3];

//valueAt([1,2,3], -1) = 3;
//valueAt([1,2,3], -1, 4) = [1,2,4];

export default function valueAt (array, index, newValue){
	//if a negative value, count from the end of the array
	//it needs to be added, not subtracted due to it being negative
	const newIndex = index < 0 ? array.length + index : index;

	if (typeof newValue !== 'undefined') {
		array[newIndex] = newValue;
		return array;

	} else {
		return array[newIndex];
	}

}
