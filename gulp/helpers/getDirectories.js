import path from 'path';
import fs from 'fs';

//Taken from:
//http://stackoverflow.com/a/24594123/1611058
export default function getDirectories(srcpath) {
	return fs.readdirSync(srcpath).filter(function (file) {
		return fs.statSync(path.join(srcpath, file)).isDirectory();
	});
}
