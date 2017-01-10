
export default function waitFor(condition, callback, ...args){
	let timer;
  timer = setInterval(function(){
		if (condition) {
			clearInterval(timer);
			return callback.call(this, ...args);
		}
  }, 100);
};
