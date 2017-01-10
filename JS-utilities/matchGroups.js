//similar to String.match except it returns with an array or regex objects

export default function matchGroups (string, regExpression, portion){
	var match = '', output = [];
	while (match !== null) {
      match = regExpression.exec(string);
      if (match !== null) {
				if (portion){
	      	output.push(match[portion]);
				} else {
	      	output.push(match);
				}
      }
	}
	if (output.length === 0){
		return null;
	} else {
		return output;
	}
}
