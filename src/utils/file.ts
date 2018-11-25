import * as fs from "fs";
import { concat } from 'src/configs/route';

export function save(title: string, path: string, content: string) {
	path = concat(path, title);
	return new Promise((resolve: Function, reject: Function) => {
		fs.writeFile(path, content, err => {
			if (err) {
				return reject(err);
			}
			return resolve(true);
		});
	})
}